-- Daily Git quiz server-side set generation, grading, reward, and streak logic.
-- Run after 015_mini_quiz_stage_grading_functions.sql.

begin;

drop function if exists public.get_or_create_daily_git_quiz_set();
drop function if exists public.grade_daily_git_quiz_answer(date, text, text);
drop function if exists public.submit_daily_git_quiz_attempt(date, jsonb, bigint);
drop function if exists public.submit_daily_git_quiz_attempt(date, jsonb, bigint, text, text);
drop function if exists public.get_daily_git_quiz_ranking(date, integer);
drop function if exists public.claim_user_study_streak(uuid, date);

alter table public.daily_git_quiz_attempts
alter column user_id drop not null;

alter table public.daily_git_quiz_attempts
add column if not exists author_role text not null default 'user' check (
  author_role in ('user', 'guest')
),
add column if not exists guest_session_id text,
add column if not exists guest_name text;

create unique index if not exists daily_git_quiz_attempts_one_guest_completed_per_day_idx
on public.daily_git_quiz_attempts (guest_session_id, quiz_date)
where status = 'completed'
  and author_role = 'guest';

create or replace function public.claim_user_study_streak(
  p_user_id uuid,
  p_studied_on date
)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  previous_studied_on date;
  next_streak_days integer;
begin
  insert into public.user_activity_stats (user_id)
  values (p_user_id)
  on conflict (user_id) do nothing;

  select last_studied_on
  into previous_studied_on
  from public.user_activity_stats
  where user_id = p_user_id
  for update;

  if previous_studied_on = p_studied_on then
    return false;
  end if;

  select case
    when previous_studied_on = p_studied_on - 1 then current_streak_days + 1
    else 1
  end
  into next_streak_days
  from public.user_activity_stats
  where user_id = p_user_id;

  update public.user_activity_stats
  set
    current_streak_days = next_streak_days,
    best_streak_days = greatest(best_streak_days, next_streak_days),
    last_studied_on = p_studied_on
  where user_id = p_user_id;

  return true;
end;
$$;

create or replace function public.get_or_create_daily_git_quiz_set()
returns table (
  quiz_date date,
  question_ids text[]
)
language plpgsql
security definer
set search_path = public
as $$
declare
  today_date date := (now() at time zone 'Asia/Seoul')::date;
  selected_question_ids text[];
begin
  select daily_git_quiz_sets.question_ids
  into selected_question_ids
  from public.daily_git_quiz_sets
  where daily_git_quiz_sets.quiz_date = today_date;

  if selected_question_ids is null then
    select array_agg(id order by md5(today_date::text || ':' || id))
    into selected_question_ids
    from (
      select id
      from public.mini_quiz_questions
      order by md5(today_date::text || ':' || id)
      limit 5
    ) selected_questions;

    if cardinality(selected_question_ids) <> 5 then
      raise exception '데일리 퀴즈 문제를 5개 생성할 수 없습니다.';
    end if;

    insert into public.daily_git_quiz_sets (quiz_date, question_ids)
    values (today_date, selected_question_ids)
    on conflict on constraint daily_git_quiz_sets_pkey do nothing;
  end if;

  return query
  select daily_git_quiz_sets.quiz_date, daily_git_quiz_sets.question_ids
  from public.daily_git_quiz_sets
  where daily_git_quiz_sets.quiz_date = today_date;
end;
$$;

create or replace function public.grade_daily_git_quiz_answer(
  p_quiz_date date,
  p_question_id text,
  p_submitted_answer text
)
returns table (
  is_correct boolean,
  correct_answer text,
  explanation text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  answer_rule record;
  normalized_submitted_answer text;
  normalized_correct_answer text;
begin
  if p_quiz_date <> (now() at time zone 'Asia/Seoul')::date then
    raise exception '오늘의 퀴즈가 갱신됐어요. 다시 시작해 주세요.';
  end if;

  perform 1
  from public.daily_git_quiz_sets
  where daily_git_quiz_sets.quiz_date = p_quiz_date
    and p_question_id = any(question_ids);

  if not found then
    raise exception '오늘의 데일리 퀴즈 문제가 아닙니다.';
  end if;

  select type, answer, hint
  into answer_rule
  from public.mini_quiz_answer_rules
  where question_id = p_question_id;

  if answer_rule.answer is null then
    raise exception '정답 규칙을 찾을 수 없습니다.';
  end if;

  if answer_rule.type = 'command' then
    normalized_submitted_answer := public.normalize_mini_quiz_command(
      p_submitted_answer
    );
    normalized_correct_answer := public.normalize_mini_quiz_command(
      answer_rule.answer
    );
  else
    normalized_submitted_answer := coalesce(p_submitted_answer, '');
    normalized_correct_answer := answer_rule.answer;
  end if;

  is_correct := normalized_submitted_answer = normalized_correct_answer;
  correct_answer := answer_rule.answer;
  explanation := answer_rule.hint;

  return next;
end;
$$;

create or replace function public.submit_daily_git_quiz_attempt(
  p_quiz_date date,
  p_answers jsonb,
  p_elapsed_ms bigint,
  p_guest_session_id text default null,
  p_guest_name text default null
)
returns table (
  score integer,
  correct_count integer,
  ranking_eligible boolean,
  earned_beans integer,
  streak_incremented boolean,
  already_completed boolean
)
language plpgsql
security definer
set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  today_date date := (now() at time zone 'Asia/Seoul')::date;
  daily_question_ids text[];
  normalized_guest_session_id text := nullif(trim(coalesce(p_guest_session_id, '')), '');
  normalized_guest_name text := nullif(trim(coalesce(p_guest_name, '')), '');
  total_answer_count integer;
  answer_count integer;
  matching_answer_count integer;
  elapsed_seconds integer;
  speed_bonus integer;
begin
  if p_quiz_date <> today_date then
    raise exception '오늘의 퀴즈가 갱신됐어요. 다시 시작해 주세요.';
  end if;

  if p_elapsed_ms < 0 then
    raise exception '풀이 시간이 올바르지 않습니다.';
  end if;

  select question_ids
  into daily_question_ids
  from public.daily_git_quiz_sets
  where daily_git_quiz_sets.quiz_date = p_quiz_date;

  if daily_question_ids is null then
    raise exception '오늘의 데일리 퀴즈 세트를 찾을 수 없습니다.';
  end if;

  select count(*)
  into total_answer_count
  from jsonb_to_recordset(p_answers) as answer_row(
    question_id text,
    submitted_answer text
  );

  select count(*), count(distinct answer_row.question_id)
  into answer_count, matching_answer_count
  from jsonb_to_recordset(p_answers) as answer_row(
    question_id text,
    submitted_answer text
  )
  where answer_row.question_id = any(daily_question_ids);

  if total_answer_count <> 5 or answer_count <> 5 or matching_answer_count <> 5 then
    raise exception '제출한 답안이 오늘의 문제 세트와 일치하지 않습니다.';
  end if;

  select count(*)
  into correct_count
  from jsonb_to_recordset(p_answers) as answer_row(
    question_id text,
    submitted_answer text
  )
  join public.mini_quiz_answer_rules answer_rule
    on answer_rule.question_id = answer_row.question_id
  where answer_row.question_id = any(daily_question_ids)
    and (
      (
        answer_rule.type = 'command'
        and public.normalize_mini_quiz_command(answer_row.submitted_answer)
          = public.normalize_mini_quiz_command(answer_rule.answer)
      )
      or
      (
        answer_rule.type <> 'command'
        and coalesce(answer_row.submitted_answer, '') = answer_rule.answer
      )
    );

  elapsed_seconds := floor(p_elapsed_ms / 1000.0);
  speed_bonus := greatest(0, 300 - elapsed_seconds * 3);
  score := correct_count * 200 + speed_bonus;
  ranking_eligible := false;
  earned_beans := 0;
  streak_incremented := false;
  already_completed := false;

  if current_user_id is null then
    if normalized_guest_session_id is null or normalized_guest_name is null then
      return next;
      return;
    end if;

    already_completed := exists (
      select 1
      from public.daily_git_quiz_attempts
      where daily_git_quiz_attempts.author_role = 'guest'
        and daily_git_quiz_attempts.guest_session_id = normalized_guest_session_id
        and daily_git_quiz_attempts.quiz_date = p_quiz_date
        and status = 'completed'
    );

    if already_completed then
      return next;
      return;
    end if;

    begin
      insert into public.daily_git_quiz_attempts (
        user_id,
        quiz_date,
        status,
        score,
        correct_count,
        elapsed_ms,
        completed_at,
        author_role,
        guest_session_id,
        guest_name
      )
      values (
        null,
        p_quiz_date,
        'completed',
        score,
        correct_count,
        p_elapsed_ms,
        now(),
        'guest',
        normalized_guest_session_id,
        normalized_guest_name
      );
    exception
      when unique_violation then
        already_completed := true;
        return next;
        return;
    end;

    ranking_eligible := true;
    return next;
    return;
  end if;

  already_completed := exists (
    select 1
    from public.daily_git_quiz_attempts
    where daily_git_quiz_attempts.author_role = 'user'
      and daily_git_quiz_attempts.user_id = current_user_id
      and daily_git_quiz_attempts.quiz_date = p_quiz_date
      and status = 'completed'
  );

  if already_completed then
    return next;
    return;
  end if;

  begin
    insert into public.daily_git_quiz_attempts (
      user_id,
      quiz_date,
      status,
      score,
      correct_count,
      elapsed_ms,
      completed_at,
      author_role
    )
    values (
      current_user_id,
      p_quiz_date,
      'completed',
      score,
      correct_count,
      p_elapsed_ms,
      now(),
      'user'
    );
  exception
    when unique_violation then
      already_completed := true;
      return next;
      return;
  end;

  insert into public.user_wallets (user_id)
  values (current_user_id)
  on conflict (user_id) do nothing;

  insert into public.user_bean_transactions (
    user_id,
    amount,
    reason,
    source_type,
    source_id
  )
  values (
    current_user_id,
    50,
    '일일 깃 퀴즈 랭킹 반영 완료',
    'daily_git_quiz',
    p_quiz_date::text
  );

  update public.user_wallets
  set
    current_beans = current_beans + 50,
    total_earned_beans = total_earned_beans + 50
  where user_id = current_user_id;

  ranking_eligible := true;
  earned_beans := 50;
  streak_incremented := public.claim_user_study_streak(
    current_user_id,
    p_quiz_date
  );

  return next;
end;
$$;

create or replace function public.get_daily_git_quiz_ranking(
  p_quiz_date date,
  p_limit integer default 5
)
returns table (
  rank_number bigint,
  user_id uuid,
  author_role text,
  profile_name text,
  correct_count integer,
  elapsed_ms bigint,
  score integer
)
language sql
security definer
set search_path = public
as $$
  select
    row_number() over (
      order by
        daily_git_quiz_attempts.correct_count desc,
        daily_git_quiz_attempts.elapsed_ms asc,
        daily_git_quiz_attempts.completed_at asc
    ) as rank_number,
    daily_git_quiz_attempts.user_id,
    daily_git_quiz_attempts.author_role,
    case
      when daily_git_quiz_attempts.author_role = 'guest' then daily_git_quiz_attempts.guest_name
      else profiles.name
    end as profile_name,
    daily_git_quiz_attempts.correct_count,
    daily_git_quiz_attempts.elapsed_ms,
    daily_git_quiz_attempts.score
  from public.daily_git_quiz_attempts
  left join public.profiles
    on profiles.id = daily_git_quiz_attempts.user_id
  where daily_git_quiz_attempts.quiz_date = p_quiz_date
    and daily_git_quiz_attempts.status = 'completed'
  order by
    daily_git_quiz_attempts.correct_count desc,
    daily_git_quiz_attempts.elapsed_ms asc,
    daily_git_quiz_attempts.completed_at asc
  limit greatest(0, p_limit);
$$;

revoke all on function public.claim_user_study_streak(uuid, date)
from anon, authenticated;
revoke all on function public.get_or_create_daily_git_quiz_set()
from anon, authenticated;
revoke all on function public.grade_daily_git_quiz_answer(date, text, text)
from anon, authenticated;
revoke all on function public.submit_daily_git_quiz_attempt(date, jsonb, bigint, text, text)
from anon, authenticated;
revoke all on function public.get_daily_git_quiz_ranking(date, integer)
from anon, authenticated;

grant execute on function public.get_or_create_daily_git_quiz_set()
to anon, authenticated;
grant execute on function public.grade_daily_git_quiz_answer(date, text, text)
to anon, authenticated;
grant execute on function public.submit_daily_git_quiz_attempt(date, jsonb, bigint, text, text)
to anon, authenticated;
grant execute on function public.get_daily_git_quiz_ranking(date, integer)
to anon, authenticated;

commit;
