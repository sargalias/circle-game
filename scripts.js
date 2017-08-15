
// Each time through, location is updated based on velocity.
// Also there will be collision detection that changes the ball color.
// each object will have a collidedWit attribute that keeps track of current collisions, so balls don't change color too many times for one collision.
// The evil ball will be controllable by mouse and keyboard.
// I'll add in sprites later, for now just have an evil ball.
// Add music and a sound effect later too.
// canvas resizing;

console.log('script connected');



var game = Object.create(Object);
game['minRadius'] = 10;
game['maxRadius'] = 50;
game['numFriendlyBalls'] = 50;
game['numEvilBalls'] = 1;


function initialiseGame() {
	game.friendlyBalls = [];
	game.evilBalls = [];
	for (var i=0; i<game.numFriendlyBalls; i++) {
		var radius = randomInRange(game.minRadius, game.maxRadius);
		var x = randomInRange(0 + radius, view.size.width - radius);
		var y = randomInRange(0 + radius, view.size.height - radius);
		var color = new Color(Math.random(), Math.random(), Math.random());
		var velX = randomInRange(-6, 6);
		var velY = randomInRange(-6, 6);
		ball = new Path.Circle(new Point(x, y), radius);
		ball.fillColor = color;
		ball.velX = velX;
		ball.velY = velY;
		ball.radius = radius;
		game.friendlyBalls.push(ball);
	}
	for (var i=0; i<game.numEvilBalls; i++) {
		var radius = randomInRange(game.minRadius, game.maxRadius);
		var x = randomInRange(0 + radius, view.size.width - radius);
		var y = randomInRange(0 + radius, view.size.height - radius);
		var color = new Color(Math.random(), Math.random(), Math.random()); 
		ball = new Path.Circle(new Point(x, y), 50);
		ball.fillColor = '#ffffff';
		ball.radius = radius;
		game.evilBalls.push(ball);
	}
}

function randomInRange(min, max) {
	return Math.random() * (max-min) + min
}

function onFrame(event) {
	for (var i=0; i<game.friendlyBalls.length; i++) {
		var ball = game.friendlyBalls[i];
		if (ball.position.x+ball.radius+ball.velX >= view.size.width || ball.position.x-ball.radius+ball.velX <= 0) {
			ball.velX *= -1;
		}
		if (ball.position.y+ball.radius+ball.velY >= view.size.height || ball.position.y-ball.radius+ball.velY <= 0) {
			ball.velY *= -1;
		}
		ball.position.x += ball.velX;
		ball.position.y += ball.velY;
	}
}




// TESTS //

function testRandomInRange(min, max) {
	for (var i=0; i<100; i++) {
		var res = randomInRange(min, max);
		if (res < min || res > max) {
			alert('Fail. Function name:', testRandomInRange.name, 'Value is', res, 'but should be between', min, max);
		}
	};
}

function testGame() {
	if (!(game.minRadius === 10 && game.maxRadius === 50 && game.numFriendlyBalls === 50 && game.numEvilBalls === 1)) {
		alert('Fail. Function name:', testGame.name);
	}
}

function testInitialiseGame() {
	initialiseGame();
	if (!(Array.isArray(game.friendlyBalls) && game.friendlyBalls.length === 50) 
		&& Array.isArray(game.evilBalls) && game.evilBalls.length === 1) {
		alert('Fail. Function name:', testInitialiseGame.name);	
	}
}

function runTests() {
	testRandomInRange(-10, 10);
	testGame();
	testInitialiseGame();
}

runTests();