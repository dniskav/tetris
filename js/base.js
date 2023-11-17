const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');

const BLOCK_SIZE = 20;
const BOARD_WIDTH = 14;
const BOARD_HEIGHT = 30;
const TOP_LEVEL_SCORE = 110;
const INCREASE_VELOCITY_FACTOR = 1.2;

const PIECES = [
  [
    [1,1],
    [1,1],
  ],
  [
    [1,0],
    [1,0],
    [1,1],
  ],
  [
    [0,1],
    [0,1],
    [1,1],
  ],
  [
    [1,1,0],
    [0,1,1],
  ],
  [
    [0,1,1],
    [1,1,0],
  ],
  [
    [0,1,0],
    [1,1,1],
  ],
  [
    [1,1,1,1],
  ],
]

canvas.width = BLOCK_SIZE * BOARD_WIDTH + 200;
canvas.height = BLOCK_SIZE * BOARD_HEIGHT;

context.scale(BLOCK_SIZE, BLOCK_SIZE);

let score = 0;
let velocity = 500;
let level = 1;

// create board
// const board = new Array(12).fill(new Array(10).fill(0));
const board = [
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [0,0,0,0,0,0,0,0,0,0,0,0,0,0],
  [1,1,1,1,0,0,0,0,0,0,0,0,0,0],
];

const piece = {
  position: {x: 5, y: 0},
  shape: [
    [1,1],
    [1,1],
  ],
}

const nextPiece = {
  position: {x: 5, y: 0},
  shape: PIECES[Math.floor(Math.random() * PIECES.length)],
}

function rotateArray(arr) {
  let newR = [];

  arr.forEach((row, r) => {
      row.forEach((val, c) => {
          newR[c] = newR[c] ? [val, ...newR[c]] : [val];
      })
  })
  return newR;
}

// add listeners
document.addEventListener('keydown', ev => {
  switch(ev.key) {
    case 'ArrowUp':
      const currentShape = piece.shape;
      piece.shape = rotateArray(piece.shape);

      if(checkCollision()) {
        piece.shape = currentShape;
      }
      break;
    case 'ArrowLeft':
      piece.position.x--;
      if(checkCollision()) {
        piece.position.x++;
      }
      break;
    case 'ArrowRight':
      piece.position.x++;
      if(checkCollision()) {
        piece.position.x--;
      }
      break;
    case 'ArrowDown':
      piece.position.y++;
      if(checkCollision()) {
        piece.position.y--;
        solidifyPiece();
        removeRows();
      }
      break;
  }
})

function checkCollision() {
  return piece.shape.find((row, y) => {
    return row.find((value, x) => {
      return (
        value !== 0 &&
        board[y + piece.position.y]?.[x + piece.position.x] !== 0
      );
    })
  })
}

function solidifyPiece() {
  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if(value === 1) {
        board[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  });

  piece.position.x = Math.floor(BOARD_WIDTH / 2 - 2);
  piece.position.y = 0;

  piece.shape = nextPiece.shape;

  nextPiece.shape = PIECES[Math.floor(Math.random() * PIECES.length)];

  if(checkCollision()) {
    alert('Game Over!');
    board.forEach(row => row.fill(0));
    velocity = 500;
  }

}


function removeRows() {
  const rowsToRemove = [];

  board.forEach((row, y) => {
    if(row.every(value => value === 1)) {
      rowsToRemove.push(y);
    }
  });

  rowsToRemove.forEach(y => {
    board.splice(y, 1);
    const newRow = Array(BOARD_WIDTH).fill(0);
    board.unshift(newRow);
    score += 10;
    if (score > TOP_LEVEL_SCORE * level) levelUp();
  });

}

function levelUp() {
  velocity = velocity / INCREASE_VELOCITY_FACTOR;
  level++;
}

let dropCounter = 0;
let lastTime = 0;

// game loop
function update(time = 0) {
  const deltatime = time - lastTime;
  lastTime = time;

  dropCounter += deltatime;

  if(dropCounter > velocity) {
    piece.position.y++;
    dropCounter = 0;

    if(checkCollision()) {
      piece.position.y--;
      solidifyPiece();
      removeRows();
    }
  }

  draw();
  window.requestAnimationFrame(update);
}

function draw() {
  context.fillStyle = '#000';
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = "#444";
  context.fillRect(15, 1, 8, 7);

  context.font = 'bold 1pt Arial';
  context.fillStyle = "white";
  context.fillText("Next", 17.5, 2.5);

  context.fillStyle = 'red';
  context.fillText(`Score: ${score}`, 16, 10);

  context.fillStyle = 'red';
  context.fillText(`Level: ${level}`, 16, 12);

  board.forEach((row, y) => {
    row.forEach((col, x) => {
      if(col === 1) {
        context.fillStyle = 'yellow';
        context.fillRect(x, y, 1, 1);
      }
    })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((col, x) => {
      if(col === 1) {
        context.fillStyle = 'red';
        context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1);
      }
    })
  })

  nextPiece.shape.forEach((row, y) => {
    row.forEach((col, x) => {
      if(col === 1) {
        context.fillStyle = 'green';
        context.fillRect(x + 17, y + 3, 1, 1);
      }
    })
  })


  // draw grid
  context.lineWidth = 1 / BLOCK_SIZE;
  context.strokeStyle = '#222';

  for (let i = 0; i <= BOARD_WIDTH; i++) {
    const x = i;
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, canvas.height);
    context.stroke();
  }

  for (let i = 0; i <= BOARD_HEIGHT; i++) {
    const y = i;
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(BOARD_WIDTH, y);
    context.stroke();
  }
}

update();