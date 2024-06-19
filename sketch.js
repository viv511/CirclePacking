//Credit to TheCodingTrain for initial inspiration: https://www.youtube.com/watch?v=QHEQuoIKgNE

var startDrawing = false;
var generatingCircle = false;

//Change if you want to do image detection or not
var isBadApple = true;
const growthConst = 3

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }
  
  show() {
    stroke(255)
    fill(0);
    strokeWeight(3)
    circle(this.x, this.y, this.r * 2);
  } 

  changeSize() {
    if(!this.collision()) {
      if(!this.touchingOtherCircle()) {
        if(!this.touchingWhite()) {
          this.r += growthConst;
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

let canvasWidth = 600;
let canvasHeight = 450;

var img;

function findCoordinate(x, y) {
  for(var i=0; i<xCoords.length; i++) {
    if(x == xCoords[i] && y == yCoords[i]) {
      return false; //If black
    }
  }

  return true //If white
}

function preload() {
  img = loadImage("data/videoFrames/3ezgif-frame-001.jpg")
  generateCounts();
}

function setup() {
  buttonHandling();
  createCanvas(canvasWidth, canvasHeight);
  colorMode(HSB, 360, 100, 100, 100);
  ellipseMode(CENTER);

  triggerImage();
}

function startProject() {
  resetCircles();
  startDrawing = true;
  generatingCircle = false;
}

function buttonHandling() {
  let startButton = createButton('Generate Circles');
  let resetButton = createButton('Reset');
  startButton.mousePressed(startProject);
  resetButton.mousePressed(resetCircles);
}

function resetCircles() {
  circles = []
  frameNumber = [];
  setNumber = [];
  generateCounts();
}

var frameNumber = [];
var setNumber = [];

function generateCounts() {
  for(var i=1; i<=7; i++) {
    for(var j=1; j<=150; j++) {
      frameNumber.push(j);
      setNumber.push(i);
    }
  }
  for(var j=1; j<=47; j++) {
    frameNumber.push(j);
    setNumber.push(8);
  }
}

var imageNumber = 60; //SWITCH BACK TO 0


var xCoords = []
var yCoords = []

function handleImage(img) {
  background(img);
  
  xCoords = [];
  yCoords = [];

  img.loadPixels();

  let xCoordinate = 0;
  let yCoordinate = 0;

  for (let i=0; i<img.pixels.length; i+=4) {
    xCoordinate++;
    if(xCoordinate == canvasWidth) {
      xCoordinate = 0;
      yCoordinate++;
    }

    let val = (img.pixels[i]+img.pixels[i+1]+img.pixels[i+2]) / 3;
    if(val < 100) {
      //BLACK!
      xCoords.push(xCoordinate);
      yCoords.push(yCoordinate);
    }
  }

  // console.log(xCoords, yCoords)
  removeIncorrectCircles();
  
  img.updatePixels();
}

function triggerImage() {
  var frame = frameNumber[imageNumber];
  var setNum = setNumber[imageNumber];

  if(frame < 10) {
    loadImage("data/videoFrames/" + setNum + "ezgif-frame-00" + frame + ".jpg", handleImage)
  }
  else if(frame < 100) {
    loadImage("data/videoFrames/" + setNum + "ezgif-frame-0" + frame + ".jpg", handleImage)
  }
  else {
    loadImage("data/videoFrames/" + setNum + "ezgif-frame-" + frame + ".jpg", handleImage)
  }

  imageNumber++;
  if(imageNumber == frameNumber.length) {
    imageNumber = 0;
  }
} 


//DOESNT WORK PROPERLY -- FIX IF STATEMENTS?
function removeIncorrectCircles() {
  for (let i=0; i<circles.length; i++) {
    // if(circles[i].touchingOtherCircle()) {
    //   circles.splice(i, 1);
    //   console.log("other circle")
    // }
    // if(circles[i].collision()) {
    //   circles.splice(i, 1);
    //   console.log("collision")
    //   i--;
    // }
    if(circles[i].touchingWhite()) {
      circles.splice(i, 1);
      console.log("white")
      i--;
    }

  }
}


var zeroTimer = 0;
function draw() {
  frameRate(120);
  // background(0);

  var circleArea = 0;
  for (let i=0; i<circles.length; i++) {
    circleArea += PI * pow(circles[i].r, 2);
  }
  var blackArea = xCoords.length

  var coveredArea = (circleArea / blackArea)
  if(coveredArea > .65){ 
    console.log(circles.length);
    triggerImage();
    zeroTimer = 0;
  }

  if(coveredArea == 0) {
    zeroTimer++;
  }

  // setInterval(triggerImage, 2000);

  gradientGeneration();

  var doneIndex;
  if(!generatingCircle) {
    doneIndex = drawCircle();
  }
  else {
    xCoords.splice(doneIndex, 1)
    yCoords.splice(doneIndex, 1)
  }
  circleLoop();
  
}

function gradientGeneration() {
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
}

function circleLoop() {
  for (let i = 0; i < circles.length; i++) {

    //CHANGE THIS IF U WANT ANIMATED
    circles[i].show();
    circles[i].changeSize();

    // circles[i].changeSize();
    // if(!generatingCircle) {
    //   circles[i].show();
    // }
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

// var setNum = 1;

// function triggerFrame(frame) {
//   frame = frame - 150 * (setNum - 1)

//   if((frame == 47) && setNum == 8) {
//     resetCircles();
//   }

//   if(frame < 10) {
//     img = loadImage("data/videoFrames/" + setNum + "ezgif-frame-00" + frame + ".jpg")
//   }
//   else if(frame < 100) {
//     img = loadImage("data/videoFrames/" + setNum + "ezgif-frame-0" + frame + ".jpg")
//   }
//   else {
//     img = loadImage("data/videoFrames/" + setNum + "ezgif-frame-" + frame + ".jpg")
//   }
  
//   handleImage();

//   if(frame == 150) {
//     setNum++;
//   }

//   console.log(setNum, frame)
// }
//   if(frameCount % 2 == 0) {
//     triggerFrame(frameCount / 2);
//   }
//   // // Check if enough time has passed since the last frame change
//   // if(millis() - lastFrameChangeTime > timeToTrigger * 1000) {
//   //   lastFrameChangeTime = millis();

//   //   currentFrame++;
//   //   triggerFrame(1 + floor(frameCount / 60) - (150 * (setNum - 1)));
//   // }