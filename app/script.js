// Main Code - Iulia and Helen

/* global noLoop, collidePointCircle, collideRectRect, frameRate, noFill, round, sqrt, windowWidth, windowHeight, 
keyCode, keyIsDown, keyIsPressed, SHIFT, UP_ARROW, LEFT_ARROW, RIGHT_ARROW, DOWN_ARROW, 
collideRectCircle, collideCircleCircle, random, mouseIsPressed, clear, textSize, 
createCanvas, strokeWeight, rect, background, colorMode, HSB, noStroke, backgroundColor, 
color, fill, ellipse, text, stroke, line, width, height, mouseX, mouseY, frameCount, loop, 
collidePointRect, createImg*/

let gamePieces, rows, cols, player1, playerTurn, playerTurnX, playerTurnY, gameIsOver, catGif;

//variables for piece placement
let selectedColumn, bottomPiece, placeAgain;

function setup() {  
  createCanvas(700, 700);
  background("white");
  colorMode(HSB, 360, 100, 100);
  noStroke();
  rows = 6;
  cols = 7;
  playerTurnX = 100;
  playerTurnY = 670;
  player1 = true; // Player1 starts first
  gameIsOver = false;
  catGif = createImg("https://cdn.glitch.com/2ee4cbc7-18a6-465d-b047-8f88af8e7ebf%2Fcat.gif?v=1596054064201"); //loads cat gif
  catGif.hide(); //cat gif is hidden until the game is over
  gamePieces = new Array(rows);
  
  for (let i = 0; i < gamePieces.length; i++) {
    gamePieces[i] = new Array(cols);
  }
  
  for(let i=0; i<gamePieces.length; i++) {
    for(let j=0; j<gamePieces[0].length; j++) {
      gamePieces[i][j] = new Circles(50 + 100*j, 50 + 100*i);
    }
  }
}

function draw() {
  createGrid();
  bottomText();
  checkPiecePlacement();
  checkWin();
  //gameOver();
}

function createGrid() {
  fill(210, 80, 100);
  rect(0, 0, 700, 600, 20);
  for(let i=0; i<gamePieces.length; i++) {
    for(let j=0; j<gamePieces[0].length; j++) {
      gamePieces[i][j].show();
    }
  }
  noFill();
}

function bottomText() {
  fill(210, 80, 100)
  rect(0, 610, 700, 90, 20)
  if (player1) {
    playerTurn = "yellow";
  } else {
    playerTurn = "red";
  }
  fill("white")
  textSize(50);
  text("Player turn:", playerTurnX, playerTurnY);  //displays player's turn
  if (player1) {
    fill("yellow");
  } else {
    fill("red");
  }
  
  text(`${playerTurn}`, width/2 +20, playerTurnY);
  noFill();
}

function checkPiecePlacement() {  
  checkTie();
  if (checkTie() === true) {
    gameIsOver = true;
    gameOver("Tie");
  }
  
  if (gameIsOver) {
    return;
  }
  for(let i=0; i<gamePieces.length; i++) {
    for(let j=0; j<gamePieces[0].length; j++) {
      let hit = collidePointCircle(mouseX, mouseY, gamePieces[i][j].x, gamePieces[i][j].y, gamePieces[i][j].d);
      if(hit && player1 && mouseIsPressed) {
        selectedColumn = j;
        findBottomPiece();
        if (placeAgain) {
          placeAgain = false;
          return;
        }
        gamePieces[bottomPiece][j].color = "yellow";
        gamePieces[bottomPiece][j].show();
        player1 = false;
        mouseIsPressed = false;
      } else if (hit && !player1 && mouseIsPressed) {
        selectedColumn = j;
        findBottomPiece();
        if (placeAgain) {
          placeAgain = false;
          return;
        }
        gamePieces[bottomPiece][j].color = "red";
        gamePieces[bottomPiece][j].show();
        player1 = true;
        mouseIsPressed = false;
      }
    }
  }
}

function checkTie() {
  let count = 0;
  for(let i=0; i<cols; i++) {
      if (gamePieces[0][i].color === "white") {
        count++;
        if (count > 0) {
          return false;
        }
      }
  }
  return true;
}

function findBottomPiece() {
  for(let i = rows-1; i >= 0; i--) {
    if (gamePieces[i][selectedColumn].color === "white") {
      bottomPiece = i;
      return;
    }
  }
  fill("black")
  textSize(50);
  text("Try again!", 250, 300);
  noFill();
  placeAgain = true; //If the selected column is full, the player must place their piece again
  
}

function checkWin() {
  checkHorizontal();
  checkVertical();
  checkRightDiagonal();
  checkLeftDiagonal();
}

function checkHorizontal() {
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < 4; j++) {
      if (
        gamePieces[i][j].color === "red" &&
        gamePieces[i][j + 1].color === "red" &&
        gamePieces[i][j + 2].color === "red" &&
        gamePieces[i][j + 3].color === "red"
      ) {
        gameIsOver = true;
        gameOver("Red");
        return;
      } else if (
        gamePieces[i][j].color === "yellow" &&
        gamePieces[i][j + 1].color === "yellow" &&
        gamePieces[i][j + 2].color === "yellow" &&
        gamePieces[i][j + 3].color === "yellow"
      ) {
        gameIsOver = true;
        gameOver("Yellow");
        return;
      }
    }
  }
}

function checkVertical() {
  for (let j = 0; j < cols; j++) {
    for (let i = 0; i < 3; i++) {
      if (
        gamePieces[i][j].color === "red" &&
        gamePieces[i+1][j].color === "red" &&
        gamePieces[i+2][j].color === "red" &&
        gamePieces[i+3][j].color === "red"
      ) {
        gameIsOver = true;
        gameOver("Red");
        return;
      } else if (
        gamePieces[i][j].color === "yellow" &&
        gamePieces[i+1][j].color === "yellow" &&
        gamePieces[i+2][j].color === "yellow" &&
        gamePieces[i+3][j].color === "yellow"
      ) {
        gameIsOver = true;
        gameOver("Yellow");
        return;
      }
    }
  }
}

function checkRightDiagonal() {
  for(let i = 0; i < 3; i++) {
    for(let j = 0; j < 4; j++) {
      if (
        gamePieces[i][j].color === "red" &&
        gamePieces[i+1][j+1].color === "red" &&
        gamePieces[i+2][j+2].color === "red" &&
        gamePieces[i+3][j+3].color === "red"
      ) {
        gameIsOver = true;
        gameOver("Red");
        return;
      } else if (
        gamePieces[i][j].color === "yellow" &&
        gamePieces[i+1][j+1].color === "yellow" &&
        gamePieces[i+2][j+2].color === "yellow" &&
        gamePieces[i+3][j+3].color === "yellow"
      ) {
        gameIsOver = true;
        gameOver("Yellow");
        return;
      }
    }
  }
}

function checkLeftDiagonal() {
  for(let i = 0; i < 3; i++) {
    for(let j = cols - 1; j >= 3; j--) {
      if (
        gamePieces[i][j].color === "red" &&
        gamePieces[i+1][j-1].color === "red" &&
        gamePieces[i+2][j-2].color === "red" &&
        gamePieces[i+3][j-3].color === "red"
      ) {
        gameIsOver = true;
        gameOver("Red");
        return;
      } else if (
        gamePieces[i][j].color === "yellow" &&
        gamePieces[i+1][j-1].color === "yellow" &&
        gamePieces[i+2][j-2].color === "yellow" &&
        gamePieces[i+3][j-3].color === "yellow"
      ) {
        gameIsOver = true;
        gameOver("Yellow");
        return;
      }
    }
  }
}

function gameOver(whoWon) {
  fill(95);
  strokeWeight(4);
  stroke(51);
  rect(100, 150, 500, 300, 20);
  fill(0);
  noStroke();
  textSize(25);
  if (whoWon != "Tie") {
    text("Congratulations! " + whoWon + " Won!", 150, 275);
  } else {
    text("Tie! Rematch?", 150, 275);
  }
  
  catGif.show();
  catGif.size(150, 150);
  catGif.position(300, 320);
  makeButton();
}

function makeButton() { 
  fill(0, 80, 100);
  stroke(0);
  rect(150, 350, 100, 50, 20);
  fill(0);
  noStroke();
  textSize(20);
  text("RESTART", 155, 380);
  noFill();
  let clicked = collidePointRect(mouseX, mouseY, 150, 350, 100, 50);
  
  if(clicked && mouseIsPressed && gameIsOver) {
    mouseIsPressed = false;
    restartGame();
  }
}

function restartGame() {
  console.log("restart attempted");
  catGif.hide();
  clear();
  setup();
}


class Circles {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.d = 80;
    this.color = "white";
  }

  show() {
    fill(this.color);
    ellipse(this.x, this.y, this.d);
    noFill();
  }
}
