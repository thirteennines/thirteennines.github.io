const chomp = new Audio('assets/chomp.mp3');

document.querySelectorAll('img.food').forEach(img => {
  img.style.cursor = "url('assets/fork.png'), auto";

  img.addEventListener('click', function(e) {
    
    const rect = img.getBoundingClientRect();
    const scaleX = img.naturalWidth / rect.width;
    const scaleY = img.naturalHeight / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;

    if (!img._holeCanvas) {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    
      const rect = img.getBoundingClientRect();
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
    
      canvas.style.cssText = img.style.cssText;
      canvas.style.width = rect.width + 'px';   
      canvas.style.height = rect.height + 'px';
    
      canvas.className = img.className;
      canvas.style.cursor = "url('assets/fork.png'), auto";
    
      img.parentNode.replaceChild(canvas, img);
      img._holeCanvas = canvas;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      canvas._ctx = ctx;
      canvas.addEventListener('click', (ev) => punchHole(canvas, ev));
    }

    punchHole(img._holeCanvas, e);
  });
});

function punchHole(canvas, e) {
  chomp.cloneNode().play();
  const ctx = canvas._ctx;
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  const x = (e.clientX - rect.left) * scaleX;
  const y = (e.clientY - rect.top) * scaleY;

  const radius = 100 + Math.random() * 20;
  const angle = Math.random() * Math.PI * 2;

  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.beginPath();
  ctx.ellipse(0, 0, radius, radius * (0.6 + Math.random() * 0.8), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
  

}