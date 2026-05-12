import "./App.css";
import icon from "./assets/icon.png";

function App() {
  return (
    <main className="app">
      <section className="character-card">
        <img className="character-image" src={icon} alt="꼬깃 캐릭터" />
        <h1>꼬깃!</h1>
      </section>
    </main>
  );
}

export default App;
