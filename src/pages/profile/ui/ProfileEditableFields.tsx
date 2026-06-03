"use client";

import { ggoggoSeal } from "@/assets/mascot";
import { UserIcon } from "lucide-react";
import Image from "next/image";
import { FormEvent, useState } from "react";
import styles from "./ProfileEditableFields.module.css";

interface Profile {
  name: string;
  bio: string;
  joinedAt: string;
  quizStats: {
    solvedCount: number;
    correctCount: number;
    wrongCount: number;
  };
  activityStats: {
    currentStreakDays: number;
    bestStreakDays: number;
    currentBeans: number;
    totalBeans: number;
  };
}

interface ProfileEditableFieldsProps {
  profile: Profile;
}

export default function ProfileEditableFields({
  profile,
}: ProfileEditableFieldsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsEditing(false);
  };

  return (
    <>
      <div className={styles.titleRow}>
        <h1>내 정보</h1>
        <button
          type="button"
          className={styles.editButton}
          onClick={() => setIsEditing((current) => !current)}
        >
          {isEditing ? "취소" : "수정"}
        </button>
      </div>

      {isEditing ? (
        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.profileRow}>
            <label className={styles.field}>
              <span className={styles.label}>이름</span>
              <input
                type="text"
                value={name}
                className={styles.input}
                aria-label="이름"
                onChange={(event) => setName(event.target.value)}
              />
            </label>
            <button
              type="button"
              className={styles.avatarButton}
              aria-label="프로필 사진 수정"
            >
              <UserIcon size={48} />
            </button>
          </div>
          <label className={styles.field}>
            <span className={styles.label}>소개</span>
            <textarea
              rows={5}
              value={bio}
              className={styles.textarea}
              aria-label="바이오"
              onChange={(event) => setBio(event.target.value)}
            />
          </label>
          <button type="submit" className={styles.button}>
            저장
          </button>
        </form>
      ) : (
        <section className={styles.profileCard} aria-label="프로필 정보">
          <div className={styles.profileRow}>
            <div className={styles.profileSummary}>
              <span className={styles.label}>이름</span>
              <p className={styles.profileName}>{name}</p>
            </div>
            <div className={styles.avatarPreview} aria-hidden="true">
              <UserIcon size={48} />
            </div>
          </div>
          <div className={styles.bioSection}>
            <span className={styles.label}>소개</span>
            <p className={styles.bioText}>{bio}</p>
          </div>
          <div className={styles.statsSection}>
            <span className={styles.label}>학습 기록</span>
            <div className={styles.tableWrap}>
              <table className={styles.statTable}>
                <thead>
                  <tr>
                    <th scope="col">푼 문제수</th>
                    <th scope="col">맞춘 문제수</th>
                    <th scope="col">틀린 문제수</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{profile.quizStats.solvedCount}문제</td>
                    <td>{profile.quizStats.correctCount}문제</td>
                    <td>{profile.quizStats.wrongCount}문제</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className={styles.statsSection}>
            <span className={styles.label}>활동 정보</span>
            <div className={styles.tableWrap}>
              <table className={styles.statTable}>
                <thead>
                  <tr>
                    <th scope="col">연속학습</th>
                    <th scope="col">보유 콩</th>
                    <th scope="col">가입일</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {profile.activityStats.currentStreakDays}일 (
                      {profile.activityStats.bestStreakDays}일)
                    </td>
                    <td>
                      {profile.activityStats.currentBeans}개 (
                      {profile.activityStats.totalBeans}개)
                    </td>
                    <td>{profile.joinedAt}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div className={styles.certificate}>
            <p className={styles.certificateText}>
              상기 유저는 꼬깃 커뮤니티의 일원으로서 Git 학습에 최선을 다할 것을
              약속합니다.
            </p>
            <div className={styles.certificateFooter}>
              <time className={styles.joinedAt}>{profile.joinedAt}</time>
              <Image
                src={ggoggoSeal}
                alt="꼬꼬 인증 도장"
                width={92}
                className={styles.sealImage}
              />
            </div>
          </div>
        </section>
      )}
    </>
  );
}
