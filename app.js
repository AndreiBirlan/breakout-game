const rulesBtn = document.getElementById('rules-btn');
const closeBtn = document.getElementById('close-btn');
const startBtn = document.getElementById('start-btn')
const rules = document.getElementById('rules');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let score = 0;

const brickRowCount = 9;
const brickColumnCount = 5;

//Rules and close event handlers
rulesBtn.addEventListener('click', () => {
    rules.classList.add('show');
});

closeBtn.addEventListener('click', () => {
    rules.classList.remove('show');
});

// Bricks
const brickInfo = {
    w: 70,
    h: 20,
    padding: 10,
    offsetX: 45,
    offsetY: 60,
    visible: true
  };

const bricks = [];
for (let i = 0; i < brickRowCount; i++) {
  bricks[i] = [];
  for (let j = 0; j < brickColumnCount; j++) {
    const x = i * (brickInfo.w + brickInfo.padding) + brickInfo.offsetX;
    const y = j * (brickInfo.h + brickInfo.padding) + brickInfo.offsetY;
    bricks[i][j] = { x, y, ...brickInfo };
  }
}

function drawBricks() {
    bricks.forEach(column => {
      column.forEach(brick => {
        ctx.beginPath();
        ctx.rect(brick.x, brick.y, brick.w, brick.h);
        ctx.fillStyle = brick.visible ? 'black' : 'transparent';
        ctx.fill();
        ctx.closePath();
      });
    });
  }

//Ball 
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    size: 10,
    speed: 4,
    dx: 4, // ball's speed on the X axis
    dy: -4 // ball's speed on the y axis
}

function drawBall() {
    ctx.beginPath();
    //X value, Y value, radius, start angle, end angle
    ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
}


//Paddle
const paddle = {
    x: canvas.width / 2 - 40, 
    y: canvas.height - 20,
    width: 80,
    height: 10,
    speed: 8,
    dx: 0
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.closePath();
}

//Score
function drawScore() {
    ctx.font = '20px Arial';
    ctx.fillText(`Score: ${score}`, canvas.width -100, 30);
}

//Move paddle on canvas
function movePaddle() {
    paddle.x += paddle.dx;

    //Wall detection
    if (paddle.x + paddle.width > canvas.width) {
        paddle.x = canvas.width - paddle.width
    }

    if (paddle.x < 0) {
        paddle.x = 0;
    }
}

// Move ball on canvas
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    //Wall collision (right/ left)
    if (ball.x + ball.size > canvas.width || ball.x - ball.size < 0) {
        ball.dx *= -1; // to turn around on collision
    }

    //Wall collision (top/ bottom)
    if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
        ball.dy *= -1; 
    }

    // Paddle collision
    if (
        ball.x - ball.size > paddle.x && 
        ball.x + ball.size < paddle.x + paddle.width && 
        ball.y + ball.size > paddle.y
    ) {
        ball.dy = -ball.speed;
    }

    // Brick collision
    bricks.forEach(column => {
        column.forEach(brick => {
            if (brick.visible) {
                if (
                    ball.x - ball.size > brick.x && // left brick side check
                    ball.x + ball.size < brick.x + brick.w && // right brick side check
                    ball.y + ball.size > brick.y && // top brick side check
                    ball.y - ball.size < brick.y + brick.h // bottom brick side check
                ) {
                    ball.dy *= -1;
                    brick.visible = false;
                    increaseScore();
                }
            }
        });
    });

    //Hit bottom wall lose
    if (ball.y + ball.size > canvas.height) {
        showAllBricks();
        score = 0;
    }
}

//Increase score
function increaseScore(){
    score++;

    if(score % (brickRowCount * brickRowCount) === 0){
        showAllBricks();
    }
}

// Make all bricks appear
function showAllBricks() {
    bricks.forEach(column => {
      column.forEach(brick => (brick.visible = true));
    });
}

// Show drawings on canvas

function draw() {
    //clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawBall();
    drawPaddle();
    drawScore();
    drawBricks();
}

//Update canvas drawing and animation
const onStart = () => {
    startBtn.classList.add('hide')
    function update() {
        movePaddle();
        moveBall();

        //Draw everything
        draw();
        requestAnimationFrame(update);
    }

    update();
}
//Keydown event
function keyDown(event) {
    if (event.key === 'Right' || event.key === 'ArrowRight') {
        paddle.dx = paddle.speed;
    } else if (event.key === 'Left' || event.key === 'ArrowLeft') {
        paddle.dx = -paddle.speed;
    }
}

//Keyup event
function keyUp(event) {
    if (
        event.key === 'Right' || 
        event.key === 'ArrowRight' || 
        event.key === 'Left' || 
        event.key === 'ArrowLeft'
    ) {
        paddle.dx = 0;
    }
}

//Keyboard event handlers
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);