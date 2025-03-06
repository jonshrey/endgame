import { useState, useEffect } from 'react';
import './App.css';
import { clsx } from 'clsx';
import { languages } from './languages';
import { randomWord, getFarewellText } from './utils'; // Import the utility functions
import { words } from './words'; // Import the words array
import winSound from './sound/win-sound.mp3'
import loseSound from './sound/lose-sound.mp3'

function AssemblyEndgame() {
  const [currentWord, setCurrentWord] = useState("");
  const [guess, setGuess] = useState([]);
  const [wrongCount, setWrongCount] = useState(0);

  // Initialize the game with a random word
  useEffect(() => {
    resetGame();
  }, []);

  const isGameWon = currentWord.split("").every(alphabet => guess.includes(alphabet));
  const isGameLost = wrongCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;

  const lastGuessedLetter = guess[guess.length - 1];
  const isLastGuessIncorrect = lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  // Play win sound when the game is won
  useEffect(() => {
    if (isGameWon) {
      playWinSound();
    }
    if(isGameLost){
      playLoseSound();
    }
  }, [isGameWon,isGameLost]);

  function handleClick(alphabet) {
    const isCorrect = currentWord.includes(alphabet);

    setGuess((prevGuess) =>
      prevGuess.includes(alphabet)
        ? prevGuess // If the letter is already guessed, return the previous guess array
        : [...prevGuess, alphabet] // Otherwise, add the new letter to the guess array
    );

    if (!isCorrect) {
      setWrongCount((prevCount) => prevCount + 1);
    }
  }

  // Reset the game state
  function resetGame() {
    const newWord = randomWord(words); // Use randomWord with the imported words array
    setCurrentWord(newWord); // Set the new word
    setGuess([]); // Clear the guessed letters
    setWrongCount(0); // Reset the wrong guess count
  }

  const alphabets = "abcdefghijklmnopqrstuvwxyz";

  // Create the keyboard buttons
  const keyboard = alphabets.split("").map((alphabet) => {
    const isGuessed = guess.includes(alphabet);
    const isCorrect = isGuessed && currentWord.includes(alphabet);
    const isWrong = isGuessed && !currentWord.includes(alphabet);

    const className = clsx({
      correct: isCorrect,
      wrong: isWrong,
    });

    return (
      <button
        className={className}
        key={alphabet}
        disabled={isGameOver}
        onClick={() => handleClick(alphabet)}
        aria-label={`Guess letter ${alphabet}`}
        tabIndex={0}
      >
        {alphabet}
      </button>
    );
  });

  // Create the language chips
  const languageElements = languages.map((lang, index) => {
    const isLanguageLost = index < wrongCount;
    const styles = {
      backgroundColor: lang.backgroundColor,
      color: lang.color,
    };
    return (
      <span
        className={`chip ${isLanguageLost ? "lost" : ""}`}
        style={styles}
        key={lang.name}
        role="status"
        aria-live="polite"
        tabIndex={0}
      >
        {lang.name}
      </span>
    );
  });

  // Create the letter elements for the current word
  const letterElements = currentWord.split("").map((letter, index) => {
    const isGuessedCorrectly = guess.includes(letter);
    return (
      <span key={index} role="text" aria-label={isGuessedCorrectly ? letter : "unrevealed letter"}>
        {isGuessedCorrectly ? letter : "_"}
      </span>
    );
  });

  const gameStatusClass = clsx("status-section", {
    win: isGameWon,
    lose: isGameLost,
    farewell: !isGameOver && isLastGuessIncorrect
  });

  const lostLanguage = languages[wrongCount - 1];

  function renderGameStatus() {
    if (!isGameOver && isLastGuessIncorrect) {
      return <p aria-live="polite">{getFarewellText(lostLanguage.name)}</p>; // Use getFarewellText
    }

    if (isGameWon) {
      return (
        <>
          <h2>You win!</h2>
          <p>Well done! 🎉</p>
        </>
      );
    }

    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭 Oh and the word was {currentWord.toUpperCase()}</p>
        </>
      );
    }
  }

  const playWinSound = () => {
    const audio = new Audio(winSound); // Path to the sound file
    audio.play()
      .then(() => console.log("Win sound played successfully!"))
      .catch((error) => console.error("Error playing sound:", error));
  };

  const playLoseSound = () => {
    const audio = new Audio(loseSound); // Path to the sound file
    audio.play()
      .then(() => console.log("Win sound played successfully!"))
      .catch((error) => console.error("Error playing sound:", error));
  };

  return (
    <main>
      <header>
        <h1>ASSEMBLY GAME</h1>
        <p>
          Guess the word within {languages.length - 1} attempts to keep the programming world safe from assembly
        </p>
      </header>
      <section className={gameStatusClass} aria-live="polite">
        {renderGameStatus()}
      </section>
      <section className="language-chips" aria-label="Languages">
        {languageElements}
      </section>
      <section className="word" aria-label="Current word">
        {letterElements}
      </section>
      <section className="keyboard-type" aria-label="Keyboard">
        {keyboard}
      </section>
      {isGameOver && (
        <button onClick={resetGame} className="game-button" aria-label="New Game">
          New Game
        </button>
      )}
    </main>
  );
}

export default AssemblyEndgame;