'use client'
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Home() {
  const gameOptions = [
    {
      label: '2x2',
      difficulty: 2,
    },
    {
      label: '4x4',
      difficulty: 4,
    },
    {
      label: '6x6',
      difficulty: 6,
    },
  ];

  const defaultSelectedCards = {
    first: { id: 0, value: 0 },
    second: { id: 0, value: 0 },
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const [rounds, setRounds] = useState(0);
  

  const [selectedGame, setSelectedGame] = useState(0);
  const [initialCards, setInitialCards] = useState([]);
  const [shuffledCards, setShuffledCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState(defaultSelectedCards);

  useEffect(() => {
    if (shuffledCards.every((x) => x.wasRemoved)) {
      setIsPlaying(false);
      setSelectedGame(0);
      setSelectedCards(defaultSelectedCards);
    }
  }, [shuffledCards]);

  useEffect(() => {
    setInitialCards(
      Array.from({ length: selectedGame ** 2 / 2 }, (_, index) => index + 1)
    );
  }, [selectedGame]);

  useEffect(() => {
    initiateCards();
  }, [initialCards]);

  useEffect(() => {
    if (selectedCards.first.value !== 0 && selectedCards.second.value !== 0) {
      validateCard();
    }
  }, [selectedCards]);

  const startGame = () => {
    setIsPlaying(true);
    setRounds(rounds + 1);
  };

  const restartGame = () => {
    startGame();
    //setSelectedGame(selectedGame);
    setSelectedCards(defaultSelectedCards);
    initiateCards();
  };

  const initiateCards = () => {
    const randomNumber = Math.floor(Math.random() * 8)
    setShuffledCards(
      [...initialCards, ...initialCards]
        .sort(() => Math.random() - 0.5)
        .map((x, index) => {
          return {
            id: index + 1,
            value: selectedGame == 2 ? x * (randomNumber + 1) : x,
            flip: false,
            wasRemoved: false,
          };
        })
    );
  };

  const chooseCard = (id, number) => {
    if (selectedCards.first.value === 0 || selectedCards.second.value === 0) {
      setSelectedCards((prevState) => {
        if (prevState.first.value === 0) {
          return {
            ...prevState,
            first: {
              ...prevState.first,
              id: id,
              value: number,
            },
          };
        }
        if (
          prevState.first.value > 0 &&
          prevState.second.value === 0 &&
          prevState.first.id !== id
        ) {
          return {
            ...prevState,
            second: {
              ...prevState.second,
              id: id,
              value: number,
            },
          };
        }
        return prevState; // Return previous state if conditions not met
      });
      flipCard(id, true);
    } else {
      console.log('You cannot choose for now.');
    }
  };

  const flipCard = (id, status) => {
    setShuffledCards(
      shuffledCards.map((row, i) =>
        row.id == id
          ? {
              ...row,
              flip: status,
            }
          : row
      )
    );
  };

  const validateCard = () => {
    if (selectedCards.first.value === selectedCards.second.value) {
      // update the cards, set this id to wasRemoved
      setTimeout(() => {
        setShuffledCards(
          shuffledCards.map((row, i) =>
            row.value == selectedCards.first.value
              ? {
                  ...row,
                  wasRemoved: true,
                }
              : row
          )
        );
        setSelectedCards(defaultSelectedCards);
      }, 1000);
    } else {
      // set a 1 second timer to flip the card back
      setTimeout(() => {
        setShuffledCards(
          shuffledCards.map((row, i) => ({
            ...row,
            flip: false,
          }))
        );
        setSelectedCards(defaultSelectedCards);
      }, 1000);
    }
  };

  return (
    <main>
      <div>
        {!isPlaying && (
          <button
            onClick={() => {
              startGame();
            }}
            className="play-button"
          >
            Play{' '}
            {shuffledCards.every((x) => x.wasRemoved) && rounds >= 1 ? (
              'Again'
            ) : (
              <></>
            )}
          </button>
        )}
        {isPlaying && (
          <div className="d-flex flex-wrap" style={{ gap: '0.5rem' }}>
            {selectedGame == 0 && (
              <>
                {gameOptions.map((opt) => (
                  <button
                    className="basis-full options"
                    onClick={() => {
                      setSelectedGame(opt.difficulty);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </>
            )}

            {selectedGame > 0 && (
              <>
                <div
                  className={`d-grid-${selectedGame}`}
                  style={{ gridGap: '1rem',margin:'0 auto'}}
                >
                  {/* Card1:{JSON.stringify(selectedCards.first)}
                  Card2:{JSON.stringify(selectedCards.second)} */}
                  {shuffledCards.map((card, index) => (
                    <div
                      key={index}
                      className={`card ${card.wasRemoved ? 'd-none' : ''} ${
                        !card.flip ? 'unflipped' : 'flipped'
                      }`}
                      onClick={() => {
                        chooseCard(card.id, card.value);
                      }}
                    >
                      <span className="center-both">
                        {card.flip ? <>{card.value}</> : <>X</>}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => {
                    restartGame();
                  }}
                  className="basis-full play-button"
                >
                  Restart
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
