import { useState, useEffect, useRef } from "react";
import "./styles/App.css";
import MemoryCard from "./components/MemoryCard ";
import { wait } from "./utils/wait";
import * as dataImages from "./data/cardList.json";

function App() {
  const [score, setScore] = useState(0);
  const [nbFlip, setNbFlip] = useState(0);
  const nbFlipRef = useRef(nbFlip);
  const [matched, isMatched] = useState([]);
  const matchedRef = useRef(matched);
  const [displayCards, setDisplayCards] = useState([]);
  const [cardFlipped, setCardFlipped] = useState([]);
  const cardFlippedRef = useRef(cardFlipped);
  const [endGame, isEndGame] = useState(false);
  const [restartGame, setRestartGame] = useState(0);

  const cardImages = [...dataImages.default];
  const shuffledCardImages = cardImages.sort(
    (prev, current) => Math.random() - 0.5
  );
  const cardImagesDivided = shuffledCardImages.splice(0, 7);
  const finalCardImages = cardImagesDivided.flatMap((card) => [card, card]);
  const shuffledfinalCard = finalCardImages.sort(
    (prev, current) => Math.random() - 0.5
  );

  useEffect(() => {
    const cards = [];
    for (let i = 0; i < 14; i++) {
      cards.push(
        <MemoryCard
          key={i}
          uniqueId={shuffledfinalCard[i].id}
          cardImage={shuffledfinalCard[i].image}
          flipCount={flipCount}
          getNbFlipRef={getNbFlipRef}
        />
      );
    }
    setDisplayCards(cards);
  }, [restartGame]);

  async function flipCount(id) {
    if (nbFlipRef.current < 2) {
      setNbFlip((prevNbFlip) => prevNbFlip + 1);
      nbFlipRef.current = nbFlipRef.current + 1;
      setCardFlipped((prevCardFlipped) => {
        return [...prevCardFlipped, id];
      });
      cardFlippedRef.current = [...cardFlippedRef.current, id];
    }
    if (nbFlipRef.current === 2) {
      if (cardFlippedRef.current[0] === cardFlippedRef.current[1]) {
        setScore((prevScore) => prevScore + 15);
        isMatched((prevMatched) => [...prevMatched, id]);
        matchedRef.current = [...matchedRef.current, id];
        winState();
      } else {
        await wait(1500);
        setScore((prevScore) => prevScore - 1);
        const cards = document.querySelectorAll(".card-inner");
        cards.forEach((card) => {
          matchedRef.current.forEach((referencedId) => {
            if (referencedId == card.getAttribute("data-id")) {
              card.classList.add("matched-card");
            }
          });
          if (!card.classList.contains("matched-card")) {
            card.classList.remove("card-flipped");
          }
        });
      }
      setNbFlip(0);
      cardFlippedRef.current = [];
      setCardFlipped([]);
      nbFlipRef.current = 0;
    }
  }

  function getNbFlipRef() {
    return nbFlipRef.current;
  }

  function winState() {
    console.log(matchedRef.current);
    if (matchedRef.current.length === shuffledfinalCard.length / 2) {
      isEndGame(true);
      return;
    }
    isEndGame(false);
  }

  function restart() {
    setRestartGame((prevRestartGame) => prevRestartGame + 1);
    setScore(0);
    setNbFlip(0);
    nbFlipRef.current = 0;
    isMatched([]);
    matchedRef.current = [];
    setDisplayCards([]);
    setCardFlipped([]);
    cardFlippedRef.current = [];
    console.log(matched);
    console.log(matchedRef.current);
    isEndGame(false);
  }

  return (
    <div className="global-container">
      <header>
        <h1 className="title">Memory Card Game</h1>
        <h2 className="score">Score : {score}</h2>
        <a className="link" href="http://google.fr">
          Link
        </a>
      </header>
      {endGame && (
        <div className="gameover-overlay">
          <div>
            <h3>Bravo !</h3>
            <p>
              Vous avez fait un score de{" "}
              <span className="final-score">{score}</span> !
            </p>
            <button type="button" className="replay-button" onClick={restart}>
              Rejouer ?
            </button>
          </div>
        </div>
      )}
      <div className="cards-container">{displayCards}</div>
      <footer>
        <p>
          Essayez de trouver les paires correspondantes en faisant le moins de
          coups possible !
        </p>
      </footer>
    </div>
  );
}

export default App;
