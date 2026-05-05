import React, { useState, useEffect, useRef } from 'react';
import './memorygame.css';
// Add ?url to imports
import right from './right_answer.wav?url';
import wrong from './wrong_answer.mp3?url';
import congrats from '../assets/congratulations.wav?url';
// Updated import to match the component file name
import Tutorial from './Tutorial'; 
import { Link } from 'react-router-dom';
import Confetti from 'react-confetti';

// Make sure this function is outside the component
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes < 10 ? '0' : ''}${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

const MemoryGame = () => {
    // const [cards, setCards] = useState(createDeck()); // Make settable for restart
    const [startGame, setStartGame] = useState(false);
    const [closeTut, setCloseTut] = useState(true);
    const [flippedIndexes, setFlippedIndexes] = useState([]);
    const [matchedIndexes, setMatchedIndexes] = useState([]);
    const [rightMatches, setRightMatches] = useState([]);
    const [wrongMatches, setWrongMatches] = useState([]);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [winner, setWinner] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [currentLevel, setCurrentLevel] = useState(1); // 1 = 2x2, 2 = 4x2, 3 = 4x4
    const [levelTransition, setLevelTransition] = useState(false); // For the brief celebration
    const [cards, setCards] = useState(createDeck(1)); // Start at level 1
    const [level3Diff, setLevel3Diff] = useState(3); // NEW: 1=Easy(2 fruits), 2=Med(4 fruits), 3=Hard(8 fruits)

    // --- DATA COLLECTION REFS (New) ---
    const eventLog = useRef([]); // Stores the raw timeline of events
    const lastClickTime = useRef(Date.now()); // To calculate Inter-Click Interval
    const isProcessing = useRef(false); // To track if board is locked (for invalid clicks)

// --- NEW: ADHD SPECIFIC MARKER REFS ---
    const failedPairs = useRef([]); // Tracks previous wrong pairs for Perseverative Errors
    const firstFlipTime = useRef(null); // Tracks time between clicks for Latency
    const inhibitoryFailures = useRef(0);// Counts clicks while board is locked
    const boardUnlockedTime = useRef(Date.now());

    // Use useState to create audio objects only once
    const [correctAudio] = useState(new Audio(right));
    const [wrongAudio] = useState(new Audio(wrong));
    const [winning] = useState(new Audio(congrats));

    function createDeck(level = 1, l3Diff = 3) {
        const allSymbols = ['🍎', '🍌', '🍉', '🍇', '🥑', '🍓', '🍊', '🍍'];
       
        let uniqueFruitCount = 2; // Level 1 default
        let totalCards = 4;       // Level 1 grid size (2x2)
        
        if (level === 2) {
            uniqueFruitCount = 3; // Just 3 fruits!
            totalCards = 8;       // But keep the 4x2 grid size
        } else if (level === 3) {
            totalCards = 16;      // Level 3 is always a 4x4 grid
            // LEVEL 3 ONLY: Look at the Easy/Med/Hard buttons!
            if (l3Diff === 1) uniqueFruitCount = 3;      // Easy
            else if (l3Diff === 2) uniqueFruitCount = 5; // Medium
            else uniqueFruitCount = 8;                   // Hard
        }

        // 1. Grab ONLY the allowed unique fruits
        const availableFruits = allSymbols.slice(0, uniqueFruitCount);
        
        // 2. Figure out how many pairs we need to fill the board
        const pairsNeeded = totalCards / 2;
        let selectedPairs = [];
        
        // 3. Loop through and duplicate fruits until we have enough pairs to fill the grid
        for (let i = 0; i < pairsNeeded; i++) {
            // The '%' operator gracefully loops back to the start of the fruits array if we run out!
            selectedPairs.push(availableFruits[i % availableFruits.length]);
        }

        // 4. Duplicate our selected pairs to make the matching deck, then shuffle
        const deck = selectedPairs.concat(selectedPairs);
        return shuffle(deck.map((symbol, index) => ({ symbol, index })));
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

     // --- HELPER: Log an event to the array (New) ---
     function logEvent(type, details = {}) {
        const now = Date.now();
        const timeDiff = now - lastClickTime.current;
        lastClickTime.current = now;

        eventLog.current.push({
            timestamp: now,
            eventType: type,
            timeSinceLastAction: timeDiff,
            ...details
        });
    }

    function handleClose() {
        setCloseTut(!closeTut);
    }

    function handleStart() {
        // Don't send data on the first start, only on restart
        if (startGame) {
             sendDatatoserver(); // Send data from the *previous* game
        }
        setStartGame(true); // Always set to true
        restartGame(false); // Pass false to not send data
        // Log Game Start
        logEvent('game_start', { deckSize: cards.length });
    }

    const contentRef = useRef(null);
    useEffect(() => {
        if (startGame && contentRef.current) {
            contentRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [startGame]);

   // Updated handleCardClick to accept the 'e' (event) object
   function handleCardClick(index, e) {
    // 1. CAPTURE CLICK COORDINATES (For Spatial Analysis)
    const clickDetails = {
        cardIndex: index,
        cardSymbol: cards[index].symbol,
        // Normalizes the coordinates to percentages!
    x: e ? parseFloat((e.clientX / window.innerWidth).toFixed(3)) : 0,
    y: e ? parseFloat((e.clientY / window.innerHeight).toFixed(3)) : 0
    };

    // 2. CHECK FOR INVALID CLICKS (Impulsivity / Hyperactivity)
    // If board is processing (waiting for timeout) or card already flipped/matched
    // if (isProcessing.current || matchedIndexes.includes(index) || flippedIndexes.includes(index)) {
    //     logEvent('invalid_click', {
    //         ...clickDetails,
    //         reason: isProcessing.current ? 'board_locked' : 'card_already_active'
    //     });
    //     return;
    // }
    // 1. INHIBITORY CONTROL CHECK (Hyperactivity marker)
    if (isProcessing.current) {
        inhibitoryFailures.current += 1; 
        logEvent('inhibitory_failure', { ...clickDetails, totalFailures: inhibitoryFailures.current });
        return; // Stop them from flipping
    }

    if (matchedIndexes.includes(index) || flippedIndexes.includes(index)) {
        logEvent('invalid_click', { ...clickDetails, reason: 'card_already_active' });
        return;
    }

    if (matchedIndexes.includes(index)) {
    // METRIC 2: Clicking a card that is already solved and visible!
    logEvent('revisit_error', clickDetails); 
    return;
}
if (flippedIndexes.includes(index)) {
    logEvent('invalid_click', { ...clickDetails, reason: 'double_click' });
    return;
}

    // 3. LOG VALID CLICK
    logEvent('card_flip', clickDetails);

    // Standard Logic
    if (flippedIndexes.length === 0) {
        // FIRST CARD FLIPPED: Start the latency timer
        firstFlipTime.current = Date.now();
        // METRIC 1: How long did they pause before starting this new pair?
    const pauseMs = Date.now() - boardUnlockedTime.current;
    logEvent('post_match_pause', { pauseTimeMs: pauseMs });

        setFlippedIndexes([index]);
    } else if (flippedIndexes.length === 1) {
        const firstIndex = flippedIndexes[0];
        const latencyMs = Date.now() - firstFlipTime.current; // Impulsivity/Inattention marker
        setFlippedIndexes([firstIndex, index]); // Show both cards
        
        isProcessing.current = true; // LOCK BOARD
        setTimeout(() => checkForMatch(firstIndex, index, latencyMs), 1000);
    }
}

    function checkForMatch(firstIndex, secondIndex, latencyMs) {
        const firstCard = cards[firstIndex];
        const secondCard = cards[secondIndex];
        const isMatch = firstCard.symbol === secondCard.symbol;

        // Log the result of the attempt
        // logEvent(isMatch ? 'match_found' : 'mismatch', {
        //     cardA: firstIndex,
        //     cardB: secondIndex,
        //     symbol: firstCard.symbol
        // });

        if (isMatch) {
            logEvent('match_found', { cardA: firstIndex, cardB: secondIndex, symbol: firstCard.symbol, latencyMs });
            setMatchedIndexes(prev => [...prev, firstIndex, secondIndex]);
            setRightMatches(prev => [...prev, firstIndex, secondIndex]);
            correctAudio.play();
        } else {
            // PERSEVERATIVE ERROR CHECK (Working Memory marker)
            // Create a unique string for this pair (e.g., "2-5") to see if they've guessed it before
            const pairKey = [firstIndex, secondIndex].sort().join('-');
            const isPerseverative = failedPairs.current.includes(pairKey);
            
            if (!isPerseverative) {
                failedPairs.current.push(pairKey); // Remember this mistake for next time
            }

            logEvent('mismatch', { 
                cardA: firstIndex, 
                cardB: secondIndex, 
                symbol: firstCard.symbol, 
                latencyMs,
                isPerseverative // <--- Sends true/false to your ML model!
            });
            setWrongMatches(prev => [...prev, firstIndex, secondIndex]);
            wrongAudio.play();
        }

        setFlippedIndexes([]); // Flip both back
        boardUnlockedTime.current = Date.now();
        isProcessing.current = false; // UNLOCK BOARD
    }

    function restartGame(shouldSendData = true, level = 1, l3Diff = level3Diff) {
        if (shouldSendData && level === 1) { // Only send data on full restart/end
            sendDatatoserver();
        }
        setCurrentLevel(level);
        setLevel3Diff(l3Diff); // Save the button choice
        setCards(createDeck(level, l3Diff)); // Deal the new cards // Get deck for specific level
        setFlippedIndexes([]);
        setMatchedIndexes([]);
        setRightMatches([]);
        setWrongMatches([]);
        setElapsedTime(0);
        setWinner(false);
        setGameOver(false); // Reset game over

        // Reset Logs
        eventLog.current = [];
        lastClickTime.current = Date.now();
        isProcessing.current = false;

        // --- ADD THESE ---
        failedPairs.current = [];
        firstFlipTime.current = null;
        inhibitoryFailures.current = 0;

        // window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
    }

    useEffect(() => {
        const timer = setInterval(() => {
            if (startGame && !gameOver) { // Only tick if game started and not over
                setElapsedTime(prevTime => prevTime + 1);
            }
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [startGame, gameOver]); // Add startGame to dependencies

    useEffect(() => {
        // Check if all cards in the CURRENT level are matched
        if (rightMatches.length > 0 && rightMatches.length === cards.length) {
            winning.play();
            
            if (currentLevel < 3) {
                // BRIEF CELEBRATION - Then move to next level
                setLevelTransition(true);
               
            } else {
                // FINAL WIN (Finished 4x4)
                setWinner(true);
                setGameOver(true);
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
    }, [rightMatches, winning, cards.length, currentLevel]);

    function sendDatatoserver(){
        // Only send if there's actually data to send
        if (rightMatches.length === 0 && wrongMatches.length === 0) return;

        const sendData = async () => {
            try {
                // 1. Figure out the difficulty string based on your states
                let diffString = "standard"; // Default for levels 1 & 2
                if (currentLevel === 3) {
                    if (level3Diff === 1) diffString = "easy";
                    if (level3Diff === 2) diffString = "medium";
                    if (level3Diff === 3) diffString = "hard";
                }
                console.log("🧐 WHAT TOKEN AM I SENDING?:", localStorage.getItem("token"));
                // Change fetch path to be relative for the proxy
                const response = await fetch('/api/memorygame', { 
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem("token")}`
                    },
                    body: JSON.stringify({
                        rightMatches: rightMatches.length / 2,
                        wrongMatches: wrongMatches.length / 2,
                        timetaken: elapsedTime,
                        events: eventLog.current, // SEND THE FULL EVENT LOG
                        level: currentLevel,
                        difficulty: diffString,
                        inhibitoryFailures: inhibitoryFailures.current // <--- NEW: Send total hyperactivity clicks
                    }),
                });
                const responseData = await response.json();
                // --- NEW: DISPLAY THE ALERT ---
                if (responseData.report) {
                    // This pops up the browser alert with the Python output
                    // alert(responseData.report);
                    console.log('ML Report Data:', responseData.report);
                }
                console.log('Response from server:', responseData.score);
            } catch (error) {
                console.error('Error sending data:', error);
            }
        };
        sendData();
    }
    
    useEffect(() => {
        if(winner){
            sendDatatoserver();
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [winner]); // 'winner' is the only dependency needed here

    return (
        <div className='container-fluid' style={{backgroundColor: `#440455`}}>
            <div className='row p-5'>
                {/* ... (rest of your JSX is fine) ... */}
                <hr style={{color: `white`}}/>
                <h1 className='text-white hanoi-title' style={{fontSize: `5rem`}}>CARD FLIP GAME</h1>
                <hr style={{color: `white`}}/>
                <div className='col-md-9'>
                    <div className="p-2" style={{color: `rgb(225, 187, 245)`, fontSize: `1.2em`}}>
                        The card flip game is a variation of the classic memory game...
                        <br/><br/>
                        Benefits of this game for individuals with ADHD : <br/><br/>
                        🌟 <span className='px-2' style={{fontSize: `1.2em`, textShadow: `0 0 3px #fff`, color: `yellow`}}>Memory</span> <br/>
                        🌟 <span className='px-2' style={{fontSize: `1.2em`, textShadow: `0 0 3px #fff`, color: `yellow`}}>Focus and Attention</span> <br/>
                        🌟 <span className='px-2' style={{fontSize: `1.2em`, textShadow: `0 0 3px #fff`, color: `yellow`}}>Hyperactivity Regulation</span> <br/>
                        <br/>
                        However, as with any activity, its suitability may vary...
                    </div>
                    <button className="btn btn-warning m-2" onClick={handleStart} style={{fontSize: `1.2em`}}>{startGame ? 'RESTART GAME' : 'START GAME'}</button>
                    <button className="btn btn-warning m-2" onClick={handleClose} style={{fontSize: `1.2em`}}>SEE TUTORIAL</button> 
                </div>
                 {/* NEW: THESE BUTTONS ONLY APPEAR IN LEVEL 3 */}
                    {currentLevel === 3 && (
                        <div className=" mt-5">
                            <span className="text-white fw-bold me-3" style={{fontSize: '1.2em'}}>Level 3 Difficulty:</span>
                            <button className={`btn ${level3Diff === 1 ? 'btn-success' : 'btn-outline-success'} m-1 fw-bold`} onClick={() => restartGame(false, 3, 1)}>Easy</button>
                            <button className={`btn ${level3Diff === 2 ? 'btn-warning' : 'btn-outline-warning'} m-1 fw-bold`} onClick={() => restartGame(false, 3, 2)}>Medium</button>
                            <button className={`btn ${level3Diff === 3 ? 'btn-danger' : 'btn-outline-danger'} m-1 fw-bold`} onClick={() => restartGame(false, 3, 3)}>Hard</button>
                        </div>
                    )}
            </div>
            {!closeTut && <Tutorial  onClose={handleClose}/>}
            { startGame && <div className="memory-game" ref={contentRef}>
           
                    
                <div className="cards-grid">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className={`card ${flippedIndexes.includes(index) || matchedIndexes.includes(index) ? 'flipped' : ''}`}
                            // Pass the event 'e' to the handler
                            onClick={(e) => handleCardClick(index, e)}
                        >
                            {flippedIndexes.includes(index) || matchedIndexes.includes(index) ? card.symbol : '💡💭'}
                        </div>
                    ))}
                    {/* <button className='btn btn-warning' style={{fontSize: `1.5em`, transition: 'transform 0.2s'}} onClick={() => restartGame(true, currentLevel)}>Restart Game</button> */}
                    <button className='btn btn-warning' style={{fontSize: `1.5em`, transition: 'transform 0.2s'}} onClick={() => restartGame(true)}>End Game</button>
                    <button className='btn btn-warning' style={{fontSize: `1.5em`, cursor: `default`, transition: 'transform 0.2s'}}>✅ {rightMatches.length/2}</button>
                    <button className='btn btn-warning' style={{fontSize: `1.5em`, cursor: `default`, transition: 'transform 0.2s'}}>❌ {wrongMatches.length/2}</button>
                    <button className='btn btn-warning' style={{fontSize: `1.5em`, cursor: `default`, transition: 'transform 0.2s'}}>⏰ {formatTime(elapsedTime)}</button>
                </div>
            </div>}

            {levelTransition && (
                <div className="overlay" style={{ zIndex: 9999, display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                    <Confetti />
                    <h1 style={{ color: 'white', fontSize: '4rem', textShadow: '2px 2px 8px #000' }}>
                        Level {currentLevel} Complete!
                    </h1>
                    <h3 style={{ color: 'yellow' }}>Get ready for the next level...</h3>
                    {/* NEW NEXT LEVEL BUTTON */}
                    <button 
                        className="btn btn-warning btn-lg mt-4" 
                        style={{ fontSize: '2rem', zIndex: 10000, position: 'relative' }}
                        onClick={() => {
                            sendDatatoserver();
                            setLevelTransition(false); // Hide the overlay
                            restartGame(false, currentLevel + 1); // Load next level
                        }}
                    >
                        Start Level {currentLevel + 1}
                    </button>
                </div>
            )}

            {winner && (
                <div className="overlay">
                    <Confetti />
                <div className="win-message">
                    CONGRATULATIONS!
                <div className="win-subtitle">
                    You are on the go!
                </div>
                <div className="win-subtitle p-1" style={{fontSize: `0.45em`}}>
                    There is no ideal solution to this since luck is also a factor...
                </div>
                <div className='win-subtitle'>
                    <button className='btn btn-warning btn-lg' onClick={() => restartGame(false)}>Play Again</button>
                    <Link to='/profile' className='btn btn-warning btn-lg'>Go to Profile</Link>
                </div>
                </div>
                </div>
                )}
        </div>
    );
};

export default MemoryGame;