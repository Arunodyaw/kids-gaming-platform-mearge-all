import React from "react";

export default function Footer() {
  return (
    // 'p-4' is padding, 'mt-5' is margin-top
    <footer className="text-center p-4 mt-5 bg-light text-muted">
      <p>&copy; {new Date().getFullYear()} FunZone Arcade. Be kind and have fun!</p>
    </footer>
  );
}
