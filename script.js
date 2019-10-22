var bird;
var myObstacles = [];
var score;

function startGame() {
  bird = new component(30, 30, "bird.png", 10, 120, "image");
  bird.speed = 0.05;
  score = new component("30px", "calibri", "black", 280, 40, "text");
  myGameArea.start();
}

var myGameArea = {
  canvas: document.createElement("canvas"),
  start: function() {
    this.canvas.width = 900;
    this.canvas.height = 500;
    this.context = this.canvas.getContext("2d");
    document.body.insertBefore(this.canvas, document.body.childNodes[0]);
    this.frameNo = 0;
    this.interval = setInterval(updateGameArea, 20);
  },
  clear: function() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
};

function component(width, height, color, x, y, type) {
  this.type = type;
  if (type == "image") {
    this.image = new Image();
    this.image.src = color;
  }
  this.score = 0;
  this.width = width;
  this.height = height;
  this.speedX = 0;
  this.speedY = 0;
  this.x = x;
  this.y = y;
  this.speed = 0;
  this.gravitySpeed = 0;
  this.update = function() {
    context = myGameArea.context;
    if (this.type == "image") {
      context.drawImage(this.image, this.x, this.y, this.width, this.height);
    } else if (this.type == "text") {
      context.font = this.width + " " + this.height;
      context.fillStyle = color;
      context.fillText(this.text, this.x, this.y);
    } else {
      context.fillStyle = color;
      context.fillRect(this.x, this.y, this.width, this.height);
    }
  };
  this.newPos = function() {
    this.gravitySpeed += this.speed;
    this.x += this.speedX;
    this.y += this.speedY + this.gravitySpeed;
    this.hitBottom();
  };
  this.hitBottom = function() {
    var bottom = myGameArea.canvas.height - this.height;
    if (this.y > bottom) {
      this.y = bottom;
      this.gravitySpeed = 0;
    }
  };
  this.crashWith = function(otherobj) {
    var myleft = this.x;
    var myright = this.x + this.width;
    var mytop = this.y;
    var mybottom = this.y + this.height;
    var otherleft = otherobj.x;
    var otherright = otherobj.x + otherobj.width;
    var othertop = otherobj.y;
    var otherbottom = otherobj.y + otherobj.height;
    var crash = true;
    if (
      mybottom < othertop ||
      mytop > otherbottom ||
      myright < otherleft ||
      myleft > otherright
    ) {
      crash = false;
    }
    return crash;
  };
}

function updateGameArea() {
  var x, height, gap, minHeight, maxHeight, minGap, maxGap;
  for (i = 0; i < myObstacles.length; i += 1) {
    if (bird.crashWith(myObstacles[i])) {
      return;
    }
  }
  myGameArea.clear();
  myGameArea.frameNo += 1;
  if (myGameArea.frameNo == 1 || everyinterval(150)) {
    x = myGameArea.canvas.width;
    minHeight = 20;
    maxHeight = 200;
    height = Math.floor(
      Math.random() * (maxHeight - minHeight + 1) + minHeight
    );
    minGap = 50;
    maxGap = 200;
    gap = Math.floor(Math.random() * (maxGap - minGap + 1) + minGap);
    myObstacles.push(new component(50, height, "#BCFF33", x, 0));
    myObstacles.push(
      new component(50, x - height - gap, "#000", x, height + gap)
    );
  }
  for (i = 0; i < myObstacles.length; i += 1) {
    myObstacles[i].x += -1;
    myObstacles[i].update();
  }
  score.text = "SCORE: " + myGameArea.frameNo;
  score.update();
  bird.newPos();
  bird.update();
}

function everyinterval(n) {
  if ((myGameArea.frameNo / n) % 1 == 0) {
    return true;
  }
  return false;
}

function accelerate(n) {
  bird.speed = n;
}
