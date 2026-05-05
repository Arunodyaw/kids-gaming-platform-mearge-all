// src/components/Games.jsx - UPDATED WITH PUZZLE LINK
import React from 'react';
import { Link } from 'react-router-dom';
import { Puzzle, Gamepad2, Brain, Target } from 'lucide-react';

const Games = () => {
  const games = [
    {
      id: 1,
      name: 'Pattern Master',
      description: 'Match shapes and colors to improve visual memory',
      icon: '🧩',
      path: '/games/pattern-master',
      color: 'from-purple-500 to-pink-500',
      difficulty: 'Easy',
      points: 15
    },
    {
      id: 2,
      name: 'Jigsaw Puzzle',
      description: 'Solve fun puzzles with 4-16 pieces',
      icon: '🧩',
      path: '/games/puzzle',
      color: 'from-blue-500 to-cyan-500',
      difficulty: 'Easy/Medium/Hard',
      points: 20
    },
    {
      id: 3,
      name: 'Focus Target',
      description: 'Hit targets to build reaction time',
      icon: '🎯',
      path: '/games/focus-target',
      color: 'from-green-500 to-emerald-500',
      difficulty: 'Medium',
      points: 25
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">Fun Games</h1>
        <p className="text-gray-600 mb-8">Play and build your brain power!</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {games.map((game) => (
            <Link
              key={game.id}
              to={game.path}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${game.color} rounded-xl flex items-center justify-center text-3xl mb-4`}>
                {game.icon}
              </div>
              <h2 className="text-xl font-bold text-gray-800 mb-2">{game.name}</h2>
              <p className="text-gray-600 mb-4">{game.description}</p>
              <div className="flex justify-between text-sm">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-gray-600">
                  {game.difficulty}
                </span>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">
                  +{game.points} points
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Games;