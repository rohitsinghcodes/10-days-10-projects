const form = document.getElementById('uploadForm');
const resultDiv = document.getElementById('result');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData();
  const imageFile = document.getElementById('imageInput').files[0];
  const targetKB = document.getElementById('targetInput').value;

  if (!imageFile || !targetKB) return alert("Please fill both fields.");

  formData.append('image', imageFile);
  formData.append('target_kb', targetKB);

  resultDiv.innerHTML = "⏳ Compressing image...";

  try {
    const response = await fetch('https://img-size-remover-backendonrender.com/reduce', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) throw new Error("Compression failed.");

    const blob = await response.blob();
    const downloadUrl = URL.createObjectURL(blob);

    resultDiv.innerHTML = `
      <p>✅ Compression Complete!</p>
      <a class="download-btn" href="${downloadUrl}" download="compressed.jpg">⬇️ Download Compressed Image</a>
      <br><br>
      <img src="${downloadUrl}" alt="Compressed Preview">
    `;
  } catch (err) {
    resultDiv.innerHTML = `<p style="color: red;">❌ Error: ${err.message}</p>`;
  }
});
