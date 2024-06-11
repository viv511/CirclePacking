var startDrawing = false;
var generatingCircle = false;

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  
  show() {
    stroke(255)
    noFill()
    strokeWeight(3)
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  } 

  changeSize() {
    if(!this.collision()) {
      if(!this.touchingOtherCircle()) {
        this.r += 1;
        generatingCircle = true;
      }
      else {
        generatingCircle = false;
      }
    }
    else {
      generatingCircle = false;
    }
  }

  collision() {
    if(this.x + this.r > width || this.x - this.r < 0) {
      return true;
    }
    if(this.y + this.r > height || this.y - this.r < 0) {
      return true;
    }

    return false;
  }

  touchingOtherCircle() {
    for (let i = 0; i < circles.length; i++) {
      if(this == circles[i]) continue;

      let d = dist(this.x, this.y, circles[i].x, circles[i].y);
      if(d < this.r + circles[i].r) {
        return true;
      }
    }
    return false;
  }

}

var circles = []
let canvasWidth = 500;
let canvasHeight = 500;

function setup() {
  createCanvas(canvasWidth, canvasHeight);
  let button = createButton('click me');
  button.position(canvasHeight, canvasWidth);

  // Call repaint() when the button is pressed.
  button.mousePressed(startProject);
}

function startProject() {
  startDrawing = true;
  generatingCircle = false;
  circles = [];
  
  //Initial Circle (if you want from the middle)
  // circles.push(new Circle(canvasWidth/2, canvasHeight/2, 1));
}

function draw() {
  background(0);
  frameRate(120);

  if(startDrawing) {
    if(!generatingCircle) {
      drawCircle();
    }

    for (let i = 0; i < circles.length; i++) {
      circles[i].show();
      circles[i].changeSize();
    }
  }

}

function drawCircle() {
  let x = random(width);
  let y = random(height);
  
  let validity = true;

  //Validity of being within a circle 
  for (let i = 0; i < circles.length; i++) {
    let d = dist(x, y, circles[i].x, circles[i].y);
    if(d < circles[i].r) {
      validity = false;
      break;
    }
  }
  
  //

  if(validity)  {
    let c = new Circle(x, y, 1);
    circles.push(c);
  }
}