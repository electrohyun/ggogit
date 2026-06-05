import Image from "next/image";
import { Heart, ImageIcon, Music, Sparkles, Wrench } from "lucide-react";

import styles from "./CreditsPage.module.css";

const THANKS_ITEMS = [
  "인덕대학교 컴퓨터소프트웨어학과의 모든 분들께",
  "인덕대학교 웹 개발 동아리 모던 애자일 Team의 모든 분들께",
  "힘든 시기에도 믿고 응원해주신 부모님께",
  "꼬깃을 플레이하고, 읽고, 눌러보고, 여기까지 와주신 모든 분들께",
  "마음을 담아 진심으로 감사합니다.",
] as const;

const CREDIT_GROUPS = [
  {
    id: "making",
    icon: Wrench,
    title: "만든 사람",
    items: ["기획 · 디자인 · 개발: electrohyun"],
  },
  {
    id: "mascot",
    icon: ImageIcon,
    title: "그림 에셋",
    items: [
      '꼬깃 서비스의 마스코트 "꼬꼬"를 비롯한 그림 에셋 전반은 생성형 AI를 사용하였습니다.',
    ],
  },
  {
    id: "sound",
    icon: Music,
    title: "사운드",
    items: [
      "메인 배경음: Background Music by The_Mountain",
      "게임 배경음: Cooking by The_Mountain",
      "효과음: SoundBible.com 제공 효과음 사용",
    ],
  },
  {
    id: "thanks",
    icon: Heart,
    title: "고마운 마음",
    items: THANKS_ITEMS,
  },
] as const;

export default function CreditsPage() {
  return (
    <div className={styles.creditsPage}>
      <section className={styles.hero} aria-labelledby="credits-title">
        <div className={styles.heroText}>
          <p className={styles.eyebrow}>Credits</p>
          <h1 id="credits-title">함께 만든 꼬깃</h1>
          <p>
            작은 커밋처럼 쌓인 도움과 응원 덕분에, 꼬깃은 오늘도 조금 더 다정한
            Git 여행이 되고 있어요.
          </p>
        </div>
        <Image
          src="/images/credits/ggoggo-credits-group.png"
          alt="꼬깃의 여러 꼬꼬 캐릭터가 함께 모여 있는 단체샷"
          width={900}
          height={900}
          className={styles.groupImage}
          priority
        />
      </section>

      <section className={styles.creditGrid} aria-label="크레딧 목록">
        {CREDIT_GROUPS.map((group) => {
          const Icon = group.icon;

          return (
            <article key={group.id} className={styles.creditCard}>
              <div className={styles.creditTitle}>
                <Icon size={22} aria-hidden="true" />
                <h2>{group.title}</h2>
              </div>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          );
        })}
      </section>

      <section className={styles.essaySection} aria-labelledby="reason-title">
        <div className={styles.sectionTitle}>
          <Sparkles size={22} aria-hidden="true" />
          <h2 id="reason-title">꼬깃을 만든 이유</h2>
        </div>
        <div className={styles.essayBox}>
          <p>
            어렸을 때의 난 게임을 하는 시간이면 편안했고 즐거웠다. 현실의
            고단함에서 잠시 벗어날 수 있었다.
          </p>
          <p>
            그러다 문득, 게임을 만드는 건 어떨까 하는 생각이 들었다. 내가
            좋아했던 시간을 누군가에게도 건넬 수 있다면 어떤 기분일까.
          </p>
          <p>
            생각해 보면, 게임을 만든다는 건 내가 느낀 작은 즐거움과 위로를
            선물하는 방법과도 같았다.
          </p>
          <p>
            꼬깃은 내가 지금까지 버티고 살아올 수 있게 해준 모든 순간들과
            사람들에 대한 첫 번째 헌사이자 보답이다.
          </p>
          <p>
            Git을 공부하는 모든 사람들이 꼬깃을 즐기는 동안에는 잠시나마
            편안함과 즐거움을 느낄 수 있기를...
          </p>
        </div>
      </section>

      <section className={styles.noticeSection} aria-label="라이선스 안내">
        <p>
          배경음악은 Pixabay Content License에 따라 사용했습니다. 효과음은
          SoundBible.com에서 제공한 파일을 사용했으며, 각 효과음의 원작자와 세부
          라이선스 표기는 확인 후 보강할 예정입니다.
        </p>
      </section>
    </div>
  );
}
