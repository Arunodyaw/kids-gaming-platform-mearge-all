import React, { useState } from 'react';
import './memorygametut.css';
// Add ?url to tell Vite you just need the asset's URL
import right from './right_answer.wav?url';
import wrong from './wrong_answer.mp3?url';

const MemoryGameTut = () => {
    const [cards] = useState(createDeck());
    const [flippedIndexes, setFlippedIndexes] = useState([]);
    const [matchedIndexes, setMatchedIndexes] = useState([]);

    // Use useState to create audio objects only once
    const [correctAudio] = useState(new Audio(right));
    const [wrongAudio] = useState(new Audio(wrong));

    function createDeck() {
        const symbols = ['🍇', '🥑'];
        const deck = symbols.concat(symbols);
        return shuffle(deck.map((symbol, index) => ({ symbol, index })));
    }

    function shuffle(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    function handleCardClick(index) {
        if (matchedIndexes.includes(index) || flippedIndexes.includes(index)) return;

        // Check against the *current* state value
        if (flippedIndexes.length === 0) {
            setFlippedIndexes([index]);
        } else if (flippedIndexes.length === 1) {
            const firstIndex = flippedIndexes[0];
            setFlippedIndexes([firstIndex, index]); // Show both cards
            
            setTimeout(() => checkForMatch(firstIndex, index), 1000);
        }
    }

    function checkForMatch(firstIndex, secondIndex) {
        const firstCard = cards[firstIndex];
        const secondCard = cards[secondIndex];

        if (firstCard.symbol === secondCard.symbol) {
            setMatchedIndexes(prev => [...prev, firstIndex, secondIndex]);
            correctAudio.play();
        } else {
            wrongAudio.play();
        }

        setFlippedIndexes([]); // Flip both back
    }

    return (
        <div className='container-fluid'>
            <div className="memory-game2">
                <div className="cards2-grid">
                    {cards.map((card, index) => (
                        <div
                            key={index}
                            className={`card2 ${flippedIndexes.includes(index) || matchedIndexes.includes(index) ? 'flipped' : ''}`}
                            onClick={() => handleCardClick(index)}
                        >
                            {flippedIndexes.includes(index) || matchedIndexes.includes(index) ? card.symbol : '💡💭'}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MemoryGameTut;