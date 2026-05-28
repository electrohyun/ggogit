import Card from "@/app/_components/Card";
import styles from "./page.module.css";
import ContinueCardContent from "./ContinueCardContent";

export default function LobbyPage() {
  return (
    <>
      <div className={styles.lobbyGrid}>
        <Card id="continue-card" title="이어하기" className={styles.span4}>
          <ContinueCardContent />
        </Card>
        <Card id="lobby-card-2" title="로비2" className={styles.span2}>
          로비2
        </Card>
        <Card id="lobby-card-3" title="로비3" className={styles.span2}>
          로비3
        </Card>
      </div>
    </>
  );
}
