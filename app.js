document.addEventListener('DOMContentLoaded', () => {

    const btn = document.querySelector('.btn');
    const pause = document.querySelector('.pause');
    const playAgain = document.querySelector('.playAgain');
    const grid = document.querySelector('.grid');
    let squares = Array.from(document.querySelectorAll('.grid div'));
    const scoreEl = document.getElementById('score');

    const androidControlsBtn = document.querySelector('.androidControlsBtn');
    const androidControlsBtns = document.querySelector('.androidControlsBtns');
    const btnLeft = document.querySelector('.btnLeft');
    const btnRight = document.querySelector('.btnRight');
    const btnRotate = document.querySelector('.btnRotate');
    const btnDown = document.querySelector('.btnDown');
    const btnClose = document.querySelector('.androidControlsBtns button i');
    
    let score = 0;
    scoreEl.innerHTML = score;
    width = 11;
    let timerId;
    let gameOn = false;
    let nextRandom = 0;
    let gameIsOver = false;


    

    const lTetromino = [
        [1,width+1,width*2+1,width*2+2],
        [width+1,width+2,width+3,width*2+1],
        [width+1,width+2,width*2+2,width*3+2],
        [width+2,width*2,width*2+1,width*2+2],
    ]
    const zTetromino = [
        [1,width+1,width+2,width*2+2],
        [width+1,width+2,width*2,width*2+1],
        [1,width+1,width+2,width*2+2],
        [width+1,width+2,width*2,width*2+1],
    ]
    const oTetromino = [
        [1,2,width+1,width+2],
        [1,2,width+1,width+2],
        [1,2,width+1,width+2],
        [1,2,width+1,width+2],
    ]
    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
    ]
    const tTetromino = [
        [1,width+1,width*2+1,width+2],
        [width,width+1,width+2,width*2+1],
        [1,width+1,width*2+1,width],
        [width,width+1,width+2,1],
    ]
 
    const tetrominos = [lTetromino, zTetromino, iTetromino, oTetromino, tTetromino];

    colors = ['yellow', '#f202ea', '#02f236', '#05f1f5', '#fa026a'];

    let random = Math.floor(Math.random()*tetrominos.length);
    let currentRotation = 0;
    let currentPosition = 4;
    let current = tetrominos[random][currentRotation];

   function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('tetromino');
            squares[currentPosition + index].style.backgroundColor = colors[random];
        })
   }

   function unDraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('tetromino');
            squares[currentPosition + index].style.backgroundColor = '';
        })
   }

   btn.addEventListener('click', () => {

 
        btn.style.display = 'none';
        pause.style.display = 'inline';
        draw(); 
        timerId = setInterval(moveDown, 300);
        gameOn = true;
        nextRandom = Math.floor(Math.random()*tetrominos.length);
        showNext();
   }
   )

   pause.addEventListener('click', () => {
    if(gameOn){
      pause.innerHTML = 'Continue';
      clearInterval(timerId);
      gameOn = false;
    } else {
      pause.innerHTML = 'Pause';
      timerId = setInterval(moveDown, 300);
      gameOn = true;
    }
   })

   playAgain.addEventListener('click', () => {
    location = location;
   })


   function moveDown() {
        unDraw();
        currentPosition += width;
        draw();
        freeze();
   }

   function freeze() {
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))) {
      current.forEach(index => squares[currentPosition + index].classList.add('taken'));
      random = nextRandom;
      nextRandom = Math.floor(Math.random() * tetrominos.length);
      current = tetrominos[random][currentRotation];
      currentPosition = 4;
      draw();
      showNext();
      addScore();
      gameOver();
    }
  }

  document.addEventListener('keydown', control);

  function control(e) {
    if(!gameIsOver){
      if (e.keyCode === 37){
          moveLeft();
      } else if (e.keyCode === 39){
          moveRight();
      } else if (e.keyCode === 40){
          moveDown();
      } else if (e.keyCode === 38){
          rotate();
      }
    }
  }

 

  function moveLeft() {
    unDraw();
    const leftEdge = current.some(index => (currentPosition + index) % width === 0);
    if(!leftEdge) currentPosition -= 1;
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) currentPosition += 1;
    draw();
  }

  function moveRight() {
    unDraw();
    const rightEdge = current.some(index => (currentPosition + index) % width === width -1);
    if(!rightEdge) currentPosition += 1;
    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))) currentPosition -= 1;
    draw();
  }


///FIX ROTATION OF TETROMINOS AT THE EDGE 
function isAtRight() {
    return current.some(index=> (currentPosition + index + 1) % width === 0)  
  }
  
  function isAtLeft() {
    return current.some(index=> (currentPosition + index) % width === 0)
  }
  
  function checkRotatedPosition(P){
    P = P || currentPosition       //get current position.  Then, check if the piece is near the left side.
    if ((P+1) % width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
      if (isAtRight()){            //use actual position to check if it's flipped over to right side
        currentPosition += 1    //if so, add one to wrap it back around
        checkRotatedPosition(P) //check again.  Pass position from start, since long block might need to move more.
        }
    }
    else if (P % width > 5) {
      if (isAtLeft()){
        currentPosition -= 1
      checkRotatedPosition(P)
      }
    }
  }
  


  function rotate() {
    unDraw();
    currentRotation ++;
    if (currentRotation === current.length) {
        currentRotation = 0;
    }
    current = tetrominos[random][currentRotation];
    checkRotatedPosition();
    draw();
  }

const miniSquares = document.querySelectorAll('.mini-grid div');


miniWidth = 4;
miniIndex = 0;

  const upNextTetromino = [
    [1,miniWidth+1,miniWidth*2+1,miniWidth*2+2],
    [1,miniWidth+1,miniWidth+2,miniWidth*2+2],
    [1,miniWidth+1,miniWidth*2+1,miniWidth*3+1],
    [1,2,miniWidth+1,miniWidth+2],
    [1,miniWidth+1,miniWidth*2+1,miniWidth+2],
]

function showNext() {

    miniSquares.forEach(square => {
        square.classList.remove('tetromino');
        square.style.backgroundColor = '';
    })    

    upNextTetromino[nextRandom].forEach(i => {
        miniSquares[miniIndex + i].classList.add('tetromino');
        miniSquares[miniIndex + i].style.backgroundColor = colors[nextRandom];

    })
    
    } 

function addScore() {

    for (i=0; i<219; i += width) {

        const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9, i+10];

        if (row.every(index => squares[index].classList.contains('taken'))) {
            score += 10;
            scoreEl.innerHTML = score;
            row.forEach(index => {
                squares[index].classList.remove('taken');
                squares[index].classList.remove('tetromino');
                squares[index].style.backgroundColor = '';
            })
            const squaresRemoved = squares.splice(i, width);
            squares = squaresRemoved.concat(squares);
            squares.forEach(cell => grid.appendChild(cell));

        }
    }
}

function gameOver() {

  const gameOver = document.querySelector('.gameOver');

    if (current.some(i => squares[currentPosition + i].classList.contains('taken'))){
        gameOver.style.display = 'block';
        btn.style.display = 'none';
        pause.style.display = 'none';
        playAgain.style.display = 'inline';
        clearInterval(timerId);
        gameIsOver = true;
    }
}

androidControlsBtn.addEventListener('click', () => {
  androidControlsBtn.style.display = 'none';
  androidControlsBtns.style.display = 'inline';
  })

btnClose.addEventListener('click', () => {
  androidControlsBtn.style.display = 'inline';
  androidControlsBtns.style.display = 'none';
  })

  btnLeft.addEventListener('click', () => {
      moveLeft();
  })
  btnRight.addEventListener('click', () => {
      moveRight();
  })
  btnRotate.addEventListener('click', () => {
      rotate();
  })
  btnDown.addEventListener('click', () => {
      moveDown();
  })




})