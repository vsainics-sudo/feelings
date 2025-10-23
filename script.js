// Navigation script for the multi-page apology site
document.addEventListener('DOMContentLoaded', function() {
    const nextBtn = document.getElementById('nextBtn');
    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            // Determine current page and navigate to next
            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage === 'index.html' || currentPage === '') {
                window.location.href = 'page2.html';
            } else if (currentPage === 'page2.html') {
                window.location.href = 'page3.html';
            } else if (currentPage === 'page3.html') {
                window.location.href = 'page4.html';
            }
        });
    }
});

// Preview a selected image file in the circular photo area.
// Also provides a simple "download page" that generates an HTML file including current edits
// and the image as a data URL (if an image was chosen).
const fileInput = document.getElementById('fileInput');
const photo = document.getElementById('photo');
const downloadBtn = document.getElementById('downloadBtn');

let chosenDataUrl = null;

if (fileInput) {
    fileInput.addEventListener('change', async (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = () => {
            chosenDataUrl = reader.result;
            photo.src = chosenDataUrl;
        };
        reader.readAsDataURL(file);
    });
}

if (downloadBtn) {
    downloadBtn.addEventListener('click', () => {
        const title = document.getElementById('title').innerText;
        const message = document.getElementById('message').innerHTML; // keep basic formatting if present
        const imgSrc = chosenDataUrl || 'photo.jpg';

        const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width,initial-scale=1" />
<title>${escapeHtml(title)}</title>
<style>
/* Minimal styles for the downloaded page */
body{font-family:system-ui,Arial;display:flex;align-items:center;justify-content:center;padding:32px;background:#fff7f8}
.container{max-width:720px;background:#fff;border-radius:12px;padding:24px;box-shadow:0 10px 30px rgba(0,0,0,0.08);text-align:center}
img{width:160px;height:160px;border-radius:50%;object-fit:cover;margin-bottom:16px}
h1{color:#ff6b81;margin:0 0 12px 0}
p{color:#222;white-space:pre-wrap}
</style>
</head>
<body>
  <div class="container">
    <img src="${imgSrc}" alt="photo" />
    <h1>${escapeHtml(title)}</h1>
    <p>${message}</p>
  </div>
</body>
</html>`;

        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'message-for-you.html';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
    });
}

function escapeHtml(s){
  return (s+'').replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'<','>':'>','"':'"',"'":'&#39;'}[c];
  });
}
