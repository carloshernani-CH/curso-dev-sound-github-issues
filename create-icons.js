// Script Node.js para gerar ícones simples para a extensão
// Execute: node create-icons.js
const { createCanvas } = require("canvas");
const fs = require("fs");

const sizes = [16, 48, 128];

sizes.forEach((size) => {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // Fundo verde
  ctx.fillStyle = "#238636";
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, size * 0.2);
  ctx.fill();

  // Checkmark
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = size * 0.12;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(size * 0.2, size * 0.5);
  ctx.lineTo(size * 0.42, size * 0.72);
  ctx.lineTo(size * 0.78, size * 0.28);
  ctx.stroke();

  fs.writeFileSync(`icon${size}.png`, canvas.toBuffer("image/png"));
  console.log(`icon${size}.png criado`);
});
