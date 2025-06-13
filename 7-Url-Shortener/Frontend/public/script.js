async function shortenUrl() {
  const input = document.getElementById('originalUrl');
  const result = document.getElementById('result');
  const longUrl = input.value.trim();

  if (!longUrl) {
    result.textContent = 'Please enter a URL.';
    return;
  }

  try {
    const response = await fetch('http://localhost:5000/api/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ originalUrl: longUrl })
    });

    const data = await response.json();

    if (data.shortUrl) {
      result.innerHTML = `
        Short URL: <a href="${data.shortUrl}" target="_blank">${data.shortUrl}</a>
        <br><br>
        <button id="copyBtn">Copy Short URL</button>
      `;

      document.getElementById('copyBtn').addEventListener('click', () => {
        navigator.clipboard.writeText(data.shortUrl).then(() => {
          const btn = document.getElementById('copyBtn');
          btn.textContent = "Copied!";
          setTimeout(() => btn.textContent = "Copy Short URL", 2000);
        });
      });

    } else {
      result.textContent = 'Failed to shorten the URL.';
    }
  } catch (error) {
    console.error(error);
    result.textContent = 'Server error. Please try again later.';
  }
}
