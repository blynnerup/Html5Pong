/**
* Game Logic Goes Here
**/

// Canvas
var canvas;
var canvasContext;

// Game objects
var ballX = 50;
var ballSpeedX = 10;
var ballY = 10;
var ballSpeedY = 4;

var player1Score = 0;
var player2Score = 0;
const WINNING_SCORE = 3;

var showingWinScreen = false;

// Left Paddle
var paddle1Y = 250;
// Right Paddle
var paddle2Y = 250;
// Height of both paddles
const PADDLE_THICKNESS = 10;
const PADDLE_HEIGHT = 100;

function calculateMousePos(evt){
	var rect = canvas.getBoundingClientRect();
	var root = document.documentElement;
	var mouseX = evt.clientX - rect.left - root.scrollLeft;
	var mouseY = evt.clientY - rect.top - root.scrollTop;
	return{
		x:mouseX,
		y:mouseY
	};
}

function handleMouseClick(evt){
	if(showingWinScreen){
		player1Score = 0;
		player2Score = 0;
		showingWinScreen = false;
	}
}

// Load the canvas once the window is done loading..
window.onload = function(){
	canvas = document.getElementById('gameCanvas');	
	canvasContext = canvas.getContext('2d');

	// Set FPS
	var framesPerSecond = 30;
	setInterval(function(){
			moveEverything();
			drawEverything();
	}, 1000 / framesPerSecond);
	canvas.addEventListener('mousedown', handleMouseClick)

	canvas.addEventListener('mousemove', function(evt){
		var mousePos = calculateMousePos(evt);
		paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
	});
}

function ballReset(){
	if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
		showingWinScreen = true;
	}
	ballSpeedX = -ballSpeedX;
	ballX = canvas.width / 2;
	ballY = canvas.height /2;
}

function computerMovement(){
	var paddle2YCenter = paddle2Y + (PADDLE_HEIGHT / 2);
	if(paddle2YCenter < ballY - 35){
		paddle2Y += 6;
	} else if (paddle2YCenter > ballY + 35){
		paddle2Y -= 6;
	}
}

function moveEverything(){
	if(showingWinScreen){
		return;
	}
	computerMovement();

	ballX += ballSpeedX;
	ballY += ballSpeedY;

	if(ballX < 10){
		if(ballY > paddle1Y && ballY < paddle1Y + PADDLE_HEIGHT){
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY - (paddle1Y + PADDLE_HEIGHT / 2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player2Score++;			
			ballReset();
		}
	}

	if(ballX > canvas.width -10){
		if(ballY > paddle2Y && ballY < paddle2Y + PADDLE_HEIGHT){
			ballSpeedX = -ballSpeedX;

			var deltaY = ballY - (paddle2Y + PADDLE_HEIGHT / 2);
			ballSpeedY = deltaY * 0.35;
		} else {
			player1Score++;
			ballReset();		
		}
	}

	if(ballY > canvas.height - 10){
		ballSpeedY = -ballSpeedY
	}

	if(ballY < 10){
		ballSpeedY = -ballSpeedY;
	}
}

function drawNet() {
	for(var i = 0; i < canvas.height; i += 40){
		colourRect(canvas.width/2-1, i, 2, 20 ,'white');
	}
}
 
function drawEverything() {
	// create the canvas
	colourRect(0, 0, canvas.width, canvas.height, 'black');
	canvasContext.fillStyle = 'white';
	if(showingWinScreen){
		if(player1Score >= WINNING_SCORE){
			canvasContext.fillText("Left player won!", 350, 200);

		} else if(player2Score >= WINNING_SCORE){
			canvasContext.fillText("Right player won!", 350, 200);
		}
		canvasContext.fillText("click to continue", 350, 500);
		return;
	}
	
	drawNet();
	// create the paddle on the left
	colourRect(10, paddle1Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
	// create the paddle on the right
	colourRect(canvas.width - PADDLE_THICKNESS - 10, paddle2Y, PADDLE_THICKNESS, PADDLE_HEIGHT, 'white');
	// create the ball
	colourCircle(ballX, ballY, 10, 'white');
	// Scoreboard
	canvasContext.fillText(player1Score, 100, 100);
	canvasContext.fillText(player2Score, canvas.width - 100, 100);
}

function colourCircle(centerX, centerY, radius, drawColour){
	canvasContext.fillStyle = drawColour;
	canvasContext.beginPath();
	canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
	canvasContext.fill();
}

function colourRect(lextX, topY, width, height, drawColour){
	canvasContext.fillStyle = drawColour;
	canvasContext.fillRect(lextX, topY, width, height);	
}