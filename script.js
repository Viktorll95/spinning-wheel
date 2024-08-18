function randomColor(lastColor = { r: 0, b: 0, g: 0 }) {
  r = Math.floor(Math.random() * 255);
  g = Math.floor(Math.random() * 255);
  b = Math.floor(Math.random() * 255);
  return { r, g, b };
}

function toRad(deg) {
  return deg * (Math.PI / 180.0);
}

function randomRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function easeOutSine(x) {
  return Math.sin((x * Math.PI) / 2);
}

function getPercent(input, min, max) {
  return ((input - min) * 100) / (max - min) / 100;
}

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const width = document.getElementById("canvas").width;
const height = document.getElementById("canvas").height;

const centerX = width / 2;
const centerY = height / 2;
const radius = width / 2;

const spinSound = new Audio("spin-sound.mp3");

let items = document
  .getElementsByTagName("textarea")[0]
  .value.trim()
  .split("\n");

let currentDeg = 0;
let step = 360 / items.length;
let colors = [];
let itemDegs = {};

for (let i = 0; i < items.length + 1; i++) {
  let lastColor;
  if (i > 0) lastColor = colors[i - 1];
  colors.push(randomColor(lastColor));
}

function createWheel() {
  items = document
    .getElementsByTagName("textarea")[0]
    .value.split("\n")
    .filter((item) => item !== "");
  console.log(items);
  step = 360 / items.length;
  for (let i = 0; i < items.length + 1; i++) {
    if (!colors[i]) {
      colors.push(randomColor());
    }
  }
  draw();
}
draw();

function draw() {
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, toRad(0), toRad(360));
  ctx.fillStyle = `rgb(${33},${33},${33})`;
  ctx.lineTo(centerX, centerY);
  ctx.fill();

  let startDeg = currentDeg;
  for (let i = 0; i < items.length; i++, startDeg += step) {
    let endDeg = startDeg + step;

    let color = colors[i];
    let colorStyle = `rgb(${color.r},${color.g},${color.b})`;

    ctx.beginPath();
    rad = toRad(360 / step);
    ctx.arc(centerX, centerY, radius - 2, toRad(startDeg), toRad(endDeg));
    let colorStyle2 = `rgb(${color.r - 30},${color.g - 30},${color.b - 30})`;
    ctx.fillStyle = colorStyle2;
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    ctx.beginPath();
    rad = toRad(360 / step);
    ctx.arc(centerX, centerY, radius - 30, toRad(startDeg), toRad(endDeg));
    ctx.fillStyle = colorStyle;
    ctx.lineTo(centerX, centerY);
    ctx.fill();

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(toRad((startDeg + endDeg) / 2));
    ctx.textAlign = "center";

    let textColor;
    if (color.r > 150 || color.g > 150 || color.b > 150) {
      ctx.fillStyle = textColor = "#000";
    } else {
      ctx.fillStyle = textColor = "#fff";
    }
    ctx.font = "bold 30px serif";
    ctx.fillText(items[i], 130, 10);
    ctx.restore();

    itemDegs[items[i]] = {
      startDeg: startDeg,
      endDeg: endDeg,
    };

    if (startDeg % 360 < 270 && endDeg % 360 >= 270) {
      document.getElementById("winner").innerHTML = items[i];
      document.getElementById("winner").style.backgroundColor = colorStyle;
      document.getElementById("winner").style.color = textColor;
    }
  }
}

let speed = 0;
let maxRotation = randomRange(360 * 3, 360 * 6);
let pause = false;

const btnGroupAfterSpin = document.querySelector(".btn-group-after-spin");

function hideBtnGroupAfterSpin() {
  btnGroupAfterSpin.classList.add("hidden");
  btnGroupAfterSpin.classList.remove("visible");
}
function showBtnGroupAfterSpin() {
  btnGroupAfterSpin.classList.add("visible");
  btnGroupAfterSpin.classList.remove("hidden");
}

function animate() {
  if (pause) {
    console.log("paused");
    showBtnGroupAfterSpin();
    return;
  }
  speed = easeOutSine(getPercent(currentDeg, maxRotation, 0)) * 20;
  if (speed < 0.01) {
    speed = 0;
    pause = true;
  }
  currentDeg += speed;
  draw();
  window.requestAnimationFrame(animate);
}

function spin() {
  spinSound.play();
  hideBtnGroupAfterSpin();
  if (speed != 0) {
    return;
  }

  maxRotation = 0;
  currentDeg = 0;
  createWheel();
  draw();

  maxRotation = randomRange(360 * 3, 360 * 6);
  itemDegs = {};
  pause = false;
  window.requestAnimationFrame(animate);
}

document
  .querySelector("#btn-remove-name")
  .addEventListener("click", function () {
    const winnerName = document.getElementById("winner").innerHTML;
    const trimmedItems = items.map((item) => item.trim());
    const filteredItems = trimmedItems.filter(
      (item) =>
        item.trim().toLowerCase() !== winnerName.trim().toLowerCase() &&
        item !== ""
    );
    // Eight whitespaces to push out the word, can be removed
    const itemStr = filteredItems.reduce((acc, item, i, arr) => {
      return `${acc}\n        ${item}`;
    }, "");
    console.log(itemStr);
    document.getElementsByTagName("textarea")[0].value = itemStr;

    createWheel();
  });

document
  .querySelector("#btn-spin-again")
  .addEventListener("click", function () {
    spin();
  });

// document.getElementsByTagName("textarea")[0].value = `Viktor \n Bee`;
// createWheel();
