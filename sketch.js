//
// pendulum vars
//

let r1;
let r2;
let m1;
let m2;
let a1;
let a2;
let a1_v = 0;
let a2_v = 0;
let a1_a;
let a2_a;
const g = 1;

let lineGraphics;

let px2;
let py2;
let cx;
let cy;

//
// sound vars
//
let carrier; // this is the oscillator we will hear
let modulator; // this oscillator will modulate the frequency of the carrier

// the carrier frequency pre-modulation
let carrierBaseFreq = 220;

// min/max ranges for modulator
let modMaxFreq = 112;
let modMinFreq = 0;
let modMaxDepth = 150;
let modMinDepth = -150;

let pendulum;
let rows = 10;
let cols = 10;
let scale = 3;

let mMin = 10;
let mMax = 50;

let pendula = [];
let count = 0;

function setup() {
  createCanvas(windowWidth, windowHeight)

  noFill();

  // pendulum setup
  lineGraphics = createGraphics(width, height);
  lineGraphics.background(255);

  let rMin = height / 4;
  let rMax = height / 2;


  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      // Values are slightly random, meaning every viewing is slightly different
      let px = ((width - (width / cols / 2)) / cols) * i + (width / cols / 1.5);
      let py = (height / rows) * j + (height / rows) / 3;
      r1 = random(rMin, rMax);
      r2 = random(rMin, rMax);
      m1 = random(mMin, mMax);
      m2 = random(mMin, mMax);

      // Starting angles
      a1 = PI / 2;
      a2 = PI / 4;

      pendula[count] = new DoublePendulum(g, px, py, r1, r2, m1, m2, a1, a2, lineGraphics)
      count++;
    }
  }
}

function draw() {
  image(lineGraphics, 0, 0)
  for (let i = 0; i < count; i++) {
    pendula[i].draw()
  }


}

// Noisy pendulum class
class DoublePendulum {
  constructor(g, px, py, r1, r2, m1, m2, a1, a2, graphics) {
    this.g = g;
    this.px = px;
    this.py = py;
    this.r1 = r1;
    this.r2 = r2;
    this.m1 = m1;
    this.m2 = m2;
    this.a1 = a1;
    this.a2 = a2;
    this.graphics = graphics;
    this.px2 = 0;
    this.py2 = 0;
    this.a1_v = 0.00000000000;
    this.a2_v = 0.00000000000;
  }

  setup() {}

  draw() {

    let num1 = -this.g * (2 * this.m1 + this.m2) * sin(this.a1);
    let num2 = -this.m2 * this.g * sin(this.a1 - 2 * this.a2);
    let num3 = -2 * sin(this.a1 - this.a2) * this.m2;
    let num4 = sq(this.a2_v) * this.r2 + sq(this.a1_v) * this.r1 * cos(this.a1 - this.a2);
    let den = this.r1 * (2 * this.m1 + this.m2 - this.m2 * cos(2 * this.a1 - 2 * this.a2))

    let num5 = 2 * sin(this.a1 - this.a2);
    let num6 = (sq(this.a1_v) * this.r1 * (this.m1 + this.m2));
    let num7 = this.g * (this.m1 + this.m2) * cos(this.a1);
    let num8 = sq(this.a2_v) * this.r2 * this.m2 * cos(this.a1 - this.a2);
    let den2 = this.r2 * (2 * this.m1 + this.m2 - this.m2 * cos(2 * this.a1 - 2 * this.a2));

    // calculate velocities
    let a1_a = (num1 + num2 + num3 * num4) / den;
    let a2_a = (num5 * (num6 + num7 + num8)) / den2;

    this.a1_v += a1_a;
    this.a2_v += a2_a;
    this.a1 += this.a1_v;
    this.a2 += this.a2_v;
    // this.a1_v *= 0.998;
    // this.a2_v *= 0.998;

    let x1 = this.r1 / (rows * scale) * sin(this.a1);
    let y1 = this.r1 / (rows * scale) * cos(this.a1);
    let x2 = x1 + this.r2 / (rows * scale) * sin(this.a2);
    let y2 = y1 + this.r2 / (rows * scale) * cos(this.a2);

    push()
    translate(this.px, this.py);
    stroke(0, 0, 0, 15);
    strokeWeight(2)
    line(0, 0, x1, y1);
    line(x1, y1, x2, y2);
    noStroke()
    fill(0, 0, 0, 15)
    circle(x1, y1, this.m1/scale);
    circle(x2, y2, this.m2/scale);
    pop()

    this.graphics.push()
    this.graphics.translate(this.px, this.py);
    this.graphics.stroke(0, 0, 0);
    this.graphics.strokeWeight(1)

    if (frameCount > 1) this.graphics.line(this.px2, this.py2, x2, y2)
    this.graphics.pop();
    this.px2 = x2;
    this.py2 = y2;
  }
}