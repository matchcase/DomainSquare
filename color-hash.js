function lchToLab(L, C, h) {
  const rad = (h * Math.PI) / 180;
  return { L, a: Math.cos(rad) * C, b: Math.sin(rad) * C };
}

function labToXyz({ L, a, b }) {
  let y = (L + 16) / 116;
  let x = a / 500 + y;
  let z = y - b / 200;
  const conv = v => (v ** 3 > 0.008856 ? v ** 3 : (v - 16/116) / 7.787);
  x = conv(x) * 0.95047;
  y = conv(y) * 1.00000;
  z = conv(z) * 1.08883;
  return { x, y, z };
}

function xyzToRgb({ x, y, z }) {
  let r = x * 3.2406 + y * -1.5372 + z * -0.4986;
  let g = x * -0.9689 + y * 1.8758 + z * 0.0415;
  let b = x * 0.0557 + y * -0.2040 + z * 1.0570;
  [r, g, b] = [r, g, b].map(v =>
    v <= 0.0031308 ? 12.92 * v : 1.055 * Math.pow(v, 1/2.4) - 0.055
  );
  return {
    r: Math.min(1, Math.max(0, r)),
    g: Math.min(1, Math.max(0, g)),
    b: Math.min(1, Math.max(0, b))
  };
}

function rgbToHex({ r, g, b }) {
  const to255 = v => Math.round(v * 255);
  return '#' + [r, g, b].map(to255)
    .map(n => n.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(str) {
  const buf = new TextEncoder().encode(str);
  const hash = await crypto.subtle.digest('SHA-256', buf);
  return Array.from(new Uint8Array(hash))
    .map(b => b.toString(16).padStart(2, '0')).join('');
}

async function colorForString(str) {
  const hex = await sha256Hex(str);
  const hueBits = parseInt(hex.slice(0, 4), 16);
  let hue = (hueBits / 0xFFFF) * 360;
  const phi = (1 + Math.sqrt(5)) / 2;
  hue = (hue * phi) % 360;
  const L = 70, C = 50;
  const lab = lchToLab(L, C, hue);
  const xyz = labToXyz(lab);
  const rgb = xyzToRgb(xyz);
  return rgbToHex(rgb);
}
