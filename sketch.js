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
  let startButton = createButton('Generate Circles');
  let resetButton = createButton('Reset');

  startButton.mousePressed(startProject);
  resetButton.mousePressed(resetCircles);
  
  createCanvas(canvasWidth, canvasHeight);

  colorMode(HSB, 360, 100, 100, 100);
  ellipseMode(CENTER);


  // let x = (windowWidth - width) / 2;
  // let y = (windowHeight - height) / 2;
  // cnv.position(x, y);
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
  frameRate(120);

  // Gradient Code ~ https://www.youtube.com/watch?v=-MUOweQ6wac
  let angle = map(frameCount % 360, 0, 360, 0, TWO_PI) * 2; //Speed up by 2
  let centerX = canvasWidth / 2;
  let centerY = canvasHeight / 2;
  let lineLength = 250;

  let gStartX = centerX + cos(angle) * lineLength;
  let gStartY = centerY + sin(angle) * lineLength;

  let gEndX = centerX + cos(angle + PI) * lineLength;
  let gEndY = centerY + sin(angle + PI) * lineLength;

  // strokeWeight(10);
  // line(gStartX, gStartY, gEndX, gEndY);
  let gradient = drawingContext.createLinearGradient(
    gStartX, gStartY, gEndX, gEndY
  );
  gradient.addColorStop(0, color(310, 100, 100, 100));
  gradient.addColorStop(1, color(250, 100, 100, 100));
  drawingContext.strokeStyle = gradient;



  if(startDrawing) {
    if(!generatingCircle) {
      drawCircle();
    }

    for (let i = 0; i < circles.length; i++) {
      circles[i].show();
      circles[i].changeSize();
    }
  }
  else {
    if(mouseIsPressed) {
      circles.push(new Circle(mouseX, mouseY, 1));
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
  
  
  if(validity)  {
    let c = new Circle(x, y, 1);
    circles.push(c);
  }
}