//Credit to TheCodingTrain for initial inspiration: https://www.youtube.com/watch?v=QHEQuoIKgNE

var startDrawing = false;
var generatingCircle = false;

//Change if you want to do image detection or not
var isBadApple = true;

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
        if(!this.touchingWhite()) {
          this.r += 2;
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
    else {
      generatingCircle = false;
    }
  }

  touchingWhite() {
    if(isBadApple) { //Jank but lol
      for(let angle = 0; angle < TWO_PI; angle += PI/8) {
        if(findCoordinate(floor(this.x + this.r * cos(angle)), floor(this.y + this.r * sin(angle)))) {
          return true;
        }
      }

      return false

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

//500, 500 
let canvasWidth = 600;
let canvasHeight = 450;

let img;
var xCoords = []
var yCoords = []

function findCoordinate(x, y) {
  for(var i=0; i<xCoords.length; i++) {
    if(x == xCoords[i] && y == yCoords[i]) {
      return false; //If black
    }
  }

  return true //If white
}

function preload() {
  img = loadImage("data/videoFrames/set2/ezgif-frame-121.jpg")
}

function setup() {
  let startButton = createButton('Generate Circles');
  let resetButton = createButton('Reset');

  startButton.mousePressed(startProject);
  resetButton.mousePressed(resetCircles);
  
  createCanvas(canvasWidth, canvasHeight);
    
  img.loadPixels();
  console.log(img.pixels.length)

  let xCoordinate = 0;
  let yCoordinate = 0;

  for (let i=0; i<img.pixels.length; i+=4) {
    xCoordinate++;
    if(xCoordinate == canvasWidth) {
      xCoordinate = 0;
      yCoordinate++;
    }

    let val = (img.pixels[i]+img.pixels[i+1]+img.pixels[i+2]) / 3;
    if(val < 5) {
      //BLACK!
      xCoords.push(xCoordinate)
      yCoords.push(yCoordinate)
    }
  }

  updatePixels();

  colorMode(HSB, 360, 100, 100, 100);
  ellipseMode(CENTER);

  console.log(xCoords.length)
}

function startProject() {
  resetCircles();
  startDrawing = true;
  generatingCircle = false;
}

function resetCircles() {
  circles = []
}

function draw() {
  background(0);
  // background(img);
  frameRate(120);

  // for (var i=0; i<xCoords.length; i++) {
  //   stroke(255)
  //   noFill()
  //   strokeWeight(3)
  //   ellipse(xCoords[i], yCoords[i], 3, 3);
  // }

  // Gradient Code ~ https://www.youtube.com/watch?v=-MUOweQ6wac
  let angle = map(frameCount % 360, 0, 360, 0, TWO_PI) * 2; //Speed up by 2
  let centerX = canvasWidth / 2;
  let centerY = canvasHeight / 2;
  let lineLength = 250;

  let gStartX = centerX + cos(angle) * lineLength;
  let gStartY = centerY + sin(angle) * lineLength;

  let gEndX = centerX + cos(angle + PI) * lineLength;
  let gEndY = centerY + sin(angle + PI) * lineLength;

  let gradient = drawingContext.createLinearGradient(
    gStartX, gStartY, gEndX, gEndY
  );

  
  gradient.addColorStop(0, color(310, 100, 100, 100));
  gradient.addColorStop(1, color(250, 100, 100, 100));
  // drawingContext.fillStyle = gradient;
  drawingContext.strokeStyle = gradient;

  var doneIndex;
  if(!generatingCircle) {
    doneIndex = drawCircle();
  }
  else {
    xCoords.splice(doneIndex, 1)
    yCoords.splice(doneIndex, 1)
  }

  for (let i = 0; i < circles.length; i++) {
    circles[i].show();
    circles[i].changeSize();
  }
  
 

}

function drawCircle() {
  let index = floor(random(xCoords.length));
  let x = xCoords[index];
  let y = yCoords[index];
  
  let validity = true;

  //Validity of being within a circle 
  for (let i = 0; i < circles.length; i++) {
    let d = dist(x, y, circles[i].x, circles[i].y);
    if(d < circles[i].r) {
      validity = false;
      break;
    }
  }
  
  
  if(validity)  {
    let c = new Circle(x, y, 1);
    circles.push(c);
  }

  return index;
}