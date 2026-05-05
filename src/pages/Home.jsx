import React, { useState } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import { ButtonGroup, Button, Row, Col, Card } from "react-bootstrap";
import { PhaserGame } from "../components/PhaserGame";

// --- SVG Icon Components (No change needed) ---
const PuzzleIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M14 2H10V6H14V2M20.59 10.59L19 12V15L20.59 16.59C21.37 17.37 21.37 18.63 20.59 19.41L19.41 20.59C18.63 21.37 17.37 21.37 16.59 20.59L15 19H12V22H8V18H4V14H8V10H4V6H8V2H12V4.87L13.87 3L15.29 4.41L14.41 5.29L15.83 6.71L17.24 5.29L18.66 6.71L17.24 8.12L19.12 10L20.59 8.59C21.37 7.81 21.37 6.55 20.59 5.76L19.41 4.59C18.63 3.8 17.37 3.8 16.59 4.59L15.17 6L14.29 5.12L13.41 6L12 4.59L10.59 6L12 7.41L10.12 9.29L8.71 7.88L7.29 9.29L8.71 10.71L7.29 12.12L5.88 10.71L4.46 12.12L6.34 14L8 12.34V10H10V12.34L12 14.34V16.34L10 18.34H8L6.34 20L4.46 18.12L5.88 16.71L4.46 15.29L5.88 13.88L4.46 12.46L3 14L2.41 13.41L4.83 11H2V8H4.83L2.41 5.59L3 5L4.41 6.41L5.83 5L7.24 6.41L8.66 5L10.08 6.41L11.5 5L12.91 6.41L12.23 7.09L14 8.86V10H16V8.86L17.77 7.09L17.09 6.41L18.5 5L19.91 6.41L18.5 7.83L19.91 9.24L21.33 7.83L22 8.5L20.59 10.59Z" />
  </svg>
);
const AdventureIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M22 12A10 10 0 0 0 12 2A10 10 0 0 0 2 12A10 10 0 0 0 12 22A10 10 0 0 0 22 12M12 4A8 8 0 0 1 20 12A8 8 0 0 1 12 20A8 8 0 0 1 4 12A8 8 0 0 1 12 4M12 5A7 7 0 0 0 5 12A7 7 0 0 0 12 19A7 7 0 0 0 19 12A7 7 0 0 0 12 5M15.5 6.5L14.09 9.33L11.25 10.75L14.09 12.16L15.5 15L16.91 12.16L19.75 10.75L16.91 9.33L15.5 6.5M8.5 8.5L7.33 10.83L5 12L7.33 13.17L8.5 15.5L9.67 13.17L12 12L9.67 10.83L8.5 8.5Z" />
  </svg>
);
const DrawingIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M18.5,1.15C17.97,1.15 17.46,1.34 17.07,1.73L15.66,3.15L19.85,7.34L21.27,5.93C22.05,5.15 22.05,3.89 21.27,3.1L19.9,1.73C19.5,1.34 19,1.15 18.5,1.15M15.06,3.74L3,15.8V20H7.2L19.26,7.94L15.06,3.74M7,18H5V16L14.06,6.94L16.06,8.94L7,18Z" />
  </svg>
);
const MusicIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12,3V13.55C11.41,13.21 10.73,13 10,13C7.79,13 6,14.79 6,17C6,19.21 7.79,21 10,21C12.21,21 14,19.21 14,17V7H18V3H12Z" />
  </svg>
);

// --- Game Data ---
// We've mapped the Tailwind colors to Bootstrap 'variant' colors
const games = [
  {
    id: 1,
    title: "Jigsaw Jungle",
    category: "Puzzles",
    icon: PuzzleIcon,
    variant: "primary",
  },
  {
    id: 2,
    title: "Starship Quest",
    category: "Adventure",
    icon: AdventureIcon,
    variant: "info",
  },
  {
    id: 3,
    title: "Color Canvas",
    category: "Drawing",
    icon: DrawingIcon,
    variant: "danger",
  },
  {
    id: 4,
    title: "Melody Maker",
    category: "Music",
    icon: MusicIcon,
    variant: "success",
  },
  {
    id: 5,
    title: "Logic Blocks",
    category: "Puzzles",
    icon: PuzzleIcon,
    variant: "warning",
  },
  {
    id: 6,
    title: "Dragon's Maze",
    category: "Adventure",
    icon: AdventureIcon,
    variant: "danger",
  },
];

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", ...new Set(games.map((g) => g.category))];
  const filteredGames =
    selectedCategory === "All"
      ? games
      : games.filter((game) => game.category === selectedCategory);

  return (
    <>
      <div className="text-center mb-4">
        <p className="lead">Games and Adventures for Awesome Kids!</p>
      </div>

      {/* --- Category Filters --- */}
      <div className="d-flex justify-content-center flex-wrap gap-2 mb-5">
        {categories.map((category) => (
          <Button
            key={category}
            variant={
              selectedCategory === category ? "warning" : "outline-secondary"
            }
            onClick={() => setSelectedCategory(category)}
            className="fw-bold"
          >
            {category}
          </Button>
        ))}
      </div>

      {/* --- Games Grid --- */}
      {/* <Row className="g-4">
        {filteredGames.map((game, index) => (
          <Col
            key={game.id}
            sm={6}
            lg={4}
            xl={3}
            className="fade-in-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <Card
              className={`h-100 shadow-sm border-0 text-white bg-${game.variant}`}
            >
              <Card.Body className="d-flex flex-column align-items:center text-center">
                <div className="game-icon-wrapper">
                  <game.icon className="game-icon" />
                </div>
                <Card.Title as="h2" className="h4">
                  {game.title}
                </Card.Title>
                <Card.Text>{game.category}</Card.Text>
                <Button
                  variant="light"
                  className="mt-auto fw-bold text-dark w-100"
                >
                  Play Now!
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row> */}

      <div className="home-container d-flex justify-content-center flex-wrap gap-4 p-4">
        <h1 className="home-title font-fredoka">Cognitive Games</h1>
        <p className="home-subtitle">Select a game to begin your session.</p>

        <div className="game-card-container">
          {/* This is the card that links to your game */}
          <Link to="/game" className="game-card fade-in-up">
            <div className="game-icon-wrapper">
              {/* Simple SVG icon for the gem game */}
              <svg
                className="game-icon"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M12 2.25l-7.89 7.89a5.25 5.25 0 000 7.425l7.89 7.89a5.25 5.25 0 007.425 0l7.89-7.89a5.25 5.25 0 000-7.425L19.425 2.25a5.25 5.25 0 00-7.425 0z" />
              </svg>
            </div>
            <h2 className="card-title font-fredoka">Magic Gems</h2>
            <p className="card-description">
              Test your visuo-spatial working memory.
            </p>
          </Link>
        </div>
        <div className="game-card-container">
        <Link to="/memorygame" className="game-card fade-in-up" style={{ textDecoration: 'none' }}>
          <div className="game-icon-wrapper">
            {/* SVG Icon: Two cards or a simple rectangular shape */}
            <svg 
              className="game-icon" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 24 24" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="card-title font-fredoka">Card Flip</h2>
          <p className="card-description">
             Sharpen your memory and attention by matching pairs.
          </p>
        </Link>
      </div>
      </div>
      <PhaserGame />
    </>
  );
}
