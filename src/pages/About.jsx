import React from "react";
import { Card } from "react-bootstrap";
import { Container, Row, Col } from "react-bootstrap";
// A simple star icon for decoration
const StarIcon = ({ className }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />
  </svg>
);

export default function About() {
  return (
    <Row className="justify-content-center">
      <Col md={10} lg={8}>
        <Card className="shadow-sm border-0 p-4 p-md-5 fade-in-up">
          <Card.Body className="text-center">
            <StarIcon
              className="text-warning mb-3"
              style={{ width: 60, height: 60 }}
            />
            <Card.Title as="h1" className="font-fredoka text-dark">
              About FunZone!
            </Card.Title>

            <p className="lead text-muted mt-4">
              Welcome to <strong>FunZone Arcade</strong>! We built this place
              because we believe games should be fun, creative, and safe for
              everyone. Our mission is to create a colorful world where kids
              ages 5-10 can explore, learn, and play.
            </p>

            <p className="lead text-muted mt-3">
              From exciting puzzle adventures to creative drawing canvases,
              every game here is designed to spark imagination and help you
              discover new skills. We hope you have an awesome time!
            </p>

            <div className="mt-4">
              <span className="font-fredoka h4 text-danger">
                Happy Playing!
              </span>
            </div>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
