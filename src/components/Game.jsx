import React, { useState, useEffect, useRef } from "react";
import "./Game.css";
import axios from "axios";
import Header from "./Header"; // <-- You imported this

// --- Game Configuration ---
const NUM_GEMS = 6; // Total number of gems on screen
const STARTING_LEVEL = 3; // Initial sequence length
const MISTAKES_ALLOWED = 1; // Tries per level (1 mistake means 2 tries total)

const Game = () => {
  // --- Game State Management ---
  const [gameState, setGameState] = useState("start"); // 'start', 'watching', 'playing', 'feedback', 'gameover'
  const [level, setLevel] = useState(STARTING_LEVEL);
  const [sequence, setSequence] = useState([]);
  const [playerSequence, setPlayerSequence] = useState([]);
  const [activeGem, setActiveGem] = useState(null);
  const [mistakes, setMistakes] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  // --- ADD NEW STATE for Player ID ---
  const [playerId, setPlayerId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [totalMistakes, setTotalMistakes] = useState(0);

  // --- Data Collection State ---
  const [sessionData, setSessionData] = useState([]);
  const roundStartTime = useRef(null);

  // --- Core Data Logging Function ---
  const logData = (eventType, eventDetails) => {
    const event = {
      timestamp: new Date().toISOString(),
      eventType,
      level,
      ...eventDetails,
    };
    setSessionData((prevData) => [...prevData, event]);
  };

  // --- Game Logic Functions ---
  const startNewRound = () => {
    setGameState("watching");
    setPlayerSequence([]);
    const newSequence = Array.from({ length: level }, () =>
      Math.floor(Math.random() * NUM_GEMS)
    );
    setSequence(newSequence);
    logData("round_start", { sequence: newSequence });
  };

  const handleStartGame = () => {
    if (!playerId.trim()) {
      setFeedbackMessage("Please enter a name or ID to start.");
      return;
    }

    setSessionData([]);
    logData("game_start", { playerId: playerId });
    setLevel(STARTING_LEVEL);
    setMistakes(0);
    setTotalMistakes(0);
    startNewRound();
  };

  // Effect to display the sequence to the player
  useEffect(() => {
    if (gameState === "watching") {
      const displayInterval = 800;
      const pauseInterval = 400;

      let i = 0;
      const interval = setInterval(() => {
        setActiveGem(sequence[i]);
        setTimeout(() => setActiveGem(null), displayInterval);
        i++;
        if (i >= sequence.length) {
          clearInterval(interval);
          setTimeout(() => {
            setGameState("playing");
            roundStartTime.current = Date.now();
            logData("sequence_displayed", { sequence });
          }, displayInterval + pauseInterval);
        }
      }, displayInterval + pauseInterval);

      return () => clearInterval(interval);
    }
  }, [gameState, sequence]);

  // *** CORRECTION 1: Moved this function to the component's main scope ***
  // *** CORRECTION 2: Using the robust version with .finally and error logging ***
  const sendDataToBackend = async (data) => {
    setIsSubmitting(true);
    setFeedbackMessage("Saving results...");

    const payload = {
      playerId: playerId,
      events: data,
    };

    console.log("Attempting to send data to backend...", payload);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/sessions",
        payload
      );

      // --- Success ---
      console.log("Session data saved successfully:", response.data);
      setFeedbackMessage("Results saved!");
    } catch (error) {
      // --- Failure ---
      console.error("--- ERROR SAVING SESSION DATA ---");
      if (error.response) {
        console.error("Data:", error.response.data);
        console.error("Status:", error.response.status);
      } else if (error.request) {
        console.error(
          "Request Error: No response received. Check backend server and CORS."
        );
      } else {
        console.error("Axios Error:", error.message);
      }
      setFeedbackMessage("Error saving results. Data logged to console.");
      console.log("--- FAILED BACKUP DATA (Manual Log) ---");
      console.log(JSON.stringify(payload, null, 2));
    } finally {
      // --- Always runs ---
      // This is the crucial fix for the "empty page"
      console.log("Setting isSubmitting to false.");
      setIsSubmitting(false);
    }
  };

  // Handle player's click on a gem
  const handleGemClick = (gemIndex) => {
    if (gameState !== "playing") return;

    const responseTime = Date.now() - roundStartTime.current;
    const isCorrect = sequence[playerSequence.length] === gemIndex;
    const newPlayerSequence = [...playerSequence, gemIndex];
    setPlayerSequence(newPlayerSequence);

    logData("player_tap", {
      tappedGem: gemIndex,
      isCorrect,
      sequencePosition: playerSequence.length,
      responseTime,
    });

    // --- The sendDataToBackend function was REMOVED from here ---

    if (newPlayerSequence.length === sequence.length) {
      setGameState("feedback");
      if (isCorrect) {
        // --- Round Success ---
        setFeedbackMessage("Great job!");
        logData("round_success", { playerSequence: newPlayerSequence });
        setTimeout(() => {
          setLevel((prevLevel) => prevLevel + 1);
          setMistakes(0);
          startNewRound();
        }, 1500);
      } else {
        // --- Round Failure (on the very last tap) ---
        handleMistake(newPlayerSequence);
      }
    } else if (!isCorrect) {
      // --- Mistake mid-sequence ---
      setGameState("feedback");
      handleMistake(newPlayerSequence);
    }
  };

  const handleMistake = (finalPlayerSequence) => {
    logData("round_fail", {
      playerSequence: finalPlayerSequence,
      mistakesMade: mistakes + 1,
    });

    // *** ADD THIS LINE to count total mistakes ***
    setTotalMistakes((prevTotal) => prevTotal + 1);

    // This block is now simpler. We REMOVED the 'else'
    // part that caused a game over. The game never ends on a mistake now.

    setMistakes(mistakes + 1); // Tracks mistakes for this level
    setFeedbackMessage("Oops! Watch again.");
    setTimeout(() => {
      setPlayerSequence([]);
      setGameState("watching"); // Re-watch the same sequence
    }, 2000);
  };

  // --- NEW useEffect: To handle 'gameover' data sending ---
  useEffect(() => {
    if (gameState === "gameover" && sessionData.length > 0) {
      const lastEvent = sessionData[sessionData.length - 1];
      if (lastEvent && lastEvent.eventType === "game_over") {
        // This can now correctly find the function
        sendDataToBackend(sessionData);
      }
    }
    // This dependency array is correct
  }, [gameState, sessionData]);

  // *** ADD THIS ENTIRE NEW FUNCTION ***
  const handleEndGame = () => {
    setFeedbackMessage("Game Over");
    setGameState("gameover");

    // Log the final event with the new totalMistakes count
    logData("game_over", {
      finalScore: level - 1,
      totalMistakes: totalMistakes, // Add total mistakes here
    });
  };
  // --- Render Logic ---
  return (
    <>
      {/* // *** CORRECTION 4: Added the Header component *** */}
      <Header />
      <div className="game-container">
        <h1>Magic Gems</h1>
        <div className="game-board">
          {Array.from({ length: NUM_GEMS }).map((_, index) => (
            <div
              key={index}
              className={`gem gem-${index} ${
                activeGem === index ? "active" : ""
              } ${gameState !== "playing" ? "disabled" : ""}`}
              onClick={() => handleGemClick(index)}
            ></div>
          ))}
        </div>

        <div className="status-container">
          {gameState === "start" && (
            <div className="start-screen">
              <input
                type="text"
                placeholder="Enter Your Name/ID"
                className="player-id-input"
                value={playerId}
                onChange={(e) => setPlayerId(e.target.value)}
              />
              <button className="start-button" onClick={handleStartGame}>
                Start Game
              </button>
              {feedbackMessage && (
                <p className="status-text feedback">{feedbackMessage}</p>
              )}
            </div>
          )}

          {gameState === "watching" && (
            <p className="status-text">Watch the magic gems!</p>
          )}
          {gameState === "playing" && <p className="status-text">Your turn!</p>}

          {gameState === "feedback" && (
            <p className="status-text feedback">{feedbackMessage}</p>
          )}

          {/* *** ADD THIS BLOCK *** */}
          {/* This button will show during the game and let the user quit */}
          {(gameState === "playing" || gameState === "watching") && (
            <button className="end-game-button" onClick={handleEndGame}>
              End Game
            </button>
          )}

          {gameState === "gameover" && (
            <div className="gameover-screen">
              <h2>Game Over</h2>
              <p>You reached level {level - 1}!</p>
              {isSubmitting && (
                <p className="status-text">Saving your score...</p>
              )}
              {/* This logic is correct */}
              {!isSubmitting && (
                <button className="start-button" onClick={handleStartGame}>
                  Play Again
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Game;
