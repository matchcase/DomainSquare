(async function() {
  try {
    const host = location.hostname.split('.').slice(-2).join('.');
    const color = await colorForString(host);

    const size = 32;
    const innerSize = size * 0.8;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');

    function applyFavicon(dataURL) {
      const links = document.querySelectorAll('link[rel~="icon"]');
      if (links.length) {
        links.forEach(el => el.href = dataURL);
      } else {
        const link = document.createElement('link');
        link.rel = 'icon';
        link.href = dataURL;
        document.head.appendChild(link);
      }
    }

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, size, size);

    let originalUrl = '/favicon.ico';
    const existing = document.querySelector('link[rel~="icon"]');
    if (existing && existing.href) originalUrl = existing.href;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = originalUrl;

    img.onload = () => {
      const offset = (size - innerSize) / 2;
      ctx.drawImage(img, offset, offset, innerSize, innerSize);
      applyFavicon(canvas.toDataURL('image/png'));
    };

    img.onerror = () => {
      applyFavicon(canvas.toDataURL('image/png'));
    };

  } catch (e) {
    console.error('Color-hash error:', e);
  }
})();
