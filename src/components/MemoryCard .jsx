import { useState, useEffect } from "react";
import "../styles/MemoryCard.css";

export default function MemoryCard({
  uniqueId,
  cardImage,
  flipCount,
  getNbFlipRef,
}) {
  const [flipped, isFlipped] = useState(false);
  function checkIfPlayable(cardTested) {
    if (
      !cardTested.classList.contains("card-flipped") &&
      !cardTested.classList.contains("card-matched")
    ) {
      return true;
    } else {
      return false;
    }
  }
  function handleClick(event) {
    const nbFlip = getNbFlipRef();
    const selectInnerCard = event.target.parentNode.parentNode;
    setTimeout(() => {
      isFlipped(false);
    }, 400);
    if (!flipped && nbFlip < 2 && checkIfPlayable(selectInnerCard)) {
      selectInnerCard.classList.add("card-flipped");
      isFlipped(true);
      flipCount(uniqueId);
    }
  }
  function getImgUrl(image) {
    let ext = "png"; // can be anything
    const imgUrl = new URL(`../assets/${image}.${ext}`, import.meta.url).href;
    return imgUrl;
  }
  return (
    <div onClick={handleClick} id="cardContainer" className="card-container">
      <div className="card">
        <div className="card-inner" data-id={uniqueId}>
          <div className="card-back">
            <img src={getImgUrl(cardImage)} />
          </div>
          <div className="card-front">
            <img src={getImgUrl("card_back")} />
          </div>
        </div>
      </div>
    </div>
  );
}
