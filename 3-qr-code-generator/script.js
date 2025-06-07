let imgBox = document.getElementById('imgBox');
let qrImage = document.getElementById('qrImage');
let qrText = document.getElementById('qrText');
let downloadBtn = document.getElementById('downloadBtn');

function generateQR() {
    if (qrText.value.trim().length > 0) {
        const qrUrl = "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=" + encodeURIComponent(qrText.value);
        qrImage.crossOrigin = "anonymous"; // Enable CORS for canvas usage
        qrImage.src = qrUrl;
        qrImage.onload = () => {
            imgBox.classList.add("show-img");
            downloadBtn.style.display = "block";
        };
    } else {
        qrText.classList.add("error");
        setTimeout(() => {
            qrText.classList.remove("error");
        }, 1000);
    }
}

function downloadQR() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = qrImage.naturalWidth;
    canvas.height = qrImage.naturalHeight;

    // Draw the image onto canvas
    ctx.drawImage(qrImage, 0, 0);

    // Convert canvas to Data URL
    const dataURL = canvas.toDataURL("image/png");

    // Create download link
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "qr-code.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
