import React from 'react';
import ImageToPDF from './ImageToPDF';

function App() {
  return (
    <div>
      <ImageToPDF />
      <footer class="bottom-right-footer">
        <p>
          Made by <a href="https://rohitsinghcodes-portfolio.onrender.com" target="_blank" rel="noopener">Rohit Singh</a>
        </p>
        <div class="social-icons">
          <a href="https://github.com/rohitsinghcodes" target="_blank" aria-label="GitHub">
            <img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg" alt="GitHub" />
          </a>
          <a href="https://www.facebook.com/rohitsinghcodes" target="_blank" aria-label="Facebook">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/facebook.svg" alt="Facebook" />
          </a>
          <a href="https://x.com/rohitsinghcodes" target="_blank" aria-label="X">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/x.svg" alt="Twitter / X" />
          </a>
          <a href="https://instagram.com/rohitsinghcodes" target="_blank" aria-label="Instagram">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/instagram.svg" alt="Instagram" />
          </a>
          <a href="https://linkedin.com/in/rohitsinghcodes" target="_blank" aria-label="LinkedIn">
            <img src="https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/linkedin.svg" alt="LinkedIn" />
          </a>
        </div>
      </footer>

    </div>
  );
}

export default App;
