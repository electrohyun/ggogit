import styles from "./page.module.css";

const colorGroups = [
  {
    title: "Primary",
    colors: [
      ["Deep", "--primary-deep"],
      ["Strong", "--primary-strong"],
      ["Base", "--primary-base"],
      ["Soft", "--primary-soft"],
      ["Pale", "--primary-pale"],
    ],
  },
  {
    title: "Secondary",
    colors: [
      ["Deep", "--secondary-deep"],
      ["Strong", "--secondary-strong"],
      ["Base", "--secondary-base"],
      ["Soft", "--secondary-soft"],
      ["Pale", "--secondary-pale"],
    ],
  },
  {
    title: "Neutral",
    colors: [
      ["Background", "--background"],
      ["Surface", "--surface"],
      ["Border", "--border"],
      ["Text Primary", "--text-primary"],
      ["Text Secondary", "--text-secondary"],
    ],
  },
  {
    title: "Semantic",
    colors: [
      ["Success", "--success"],
      ["Warning", "--warning"],
      ["Error", "--error"],
      ["Info", "--info"],
    ],
  },
];

export default function DesignSystemPage() {
  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>GGoGit Design System</p>
        <h1>색상과 폰트 구조</h1>
      </header>

      <div className={styles.groups}>
        {colorGroups.map((group) => (
          <section className={styles.group} key={group.title}>
            <h2>{group.title}</h2>
            <div className={styles.swatches}>
              {group.colors.map(([label, token]) => (
                <article className={styles.swatch} key={token}>
                  <div
                    className={styles.preview}
                    style={{ backgroundColor: `var(${token})` }}
                  />
                  <div className={styles.meta}>
                    <strong>{label}</strong>
                    <code>{token}</code>
                  </div>
                </article>
              ))}
            </div>
          </section>
        ))}
      </div>

      <section className={styles.fontSection}>
        <h2>Font Roles</h2>
        <div className={styles.fontSamples}>
          <article className={styles.fontSample}>
            <p className={styles.fontLabel}>Pretendard / 기본 UI</p>
            <p className={styles.sansSample}>
              꼬깃은 Git 그래프를 직접 만지며 배우는 퍼즐 학습 게임입니다.
            </p>
          </article>
          <article className={styles.fontSample}>
            <p className={styles.fontLabel}>학교안심 그림일기 / 캐릭터 대사</p>
            <p className={styles.characterSample}>
              괜찮아, 꼬깃꼬깃 접혀도 히스토리는 남아!
            </p>
          </article>
          <article className={styles.fontSample}>
            <p className={styles.fontLabel}>Cascadia Code / 터미널</p>
            <code className={styles.codeSample}>git commit -m &quot;first commit&quot;</code>
          </article>
        </div>
      </section>
    </main>
  );
}
