

/* REMAINING:
	Add sprite.
*/

console.log('script connected');



var game = Object.create(Object);
game['minRadius'] = 20;
game['maxRadius'] = 50;
game['numFriendlyBalls'] = 50;
game['numEvilBalls'] = 1;
game.frameNumber = 0;
game.sounds = [
	new Howl( {volume: 0.5, src: 'sounds/bubbles.mp3'		} 	),
	new Howl( {volume: 0.5, src: 'sounds/clay.mp3'			}	),
	new Howl( {volume: 0.5, src: 'sounds/confetti.mp3'		}	),
	new Howl( {volume: 0.5, src: 'sounds/corona.mp3'		} 	),
	new Howl( {volume: 0.5, src: 'sounds/dotted-spiral.mp3'	} 	),
	new Howl( {volume: 0.5, src: 'sounds/flash-1.mp3'		} 	),
	new Howl( {volume: 0.5, src: 'sounds/flash-2.mp3'		} 	),
	new Howl( {volume: 0.5, src: 'sounds/flash-3.mp3'		} 	),
	new Howl( {volume: 0.5, src: 'sounds/glimmer.mp3'		} 	),
	new Howl( {volume: 0.5, src: 'sounds/moon.mp3'			}	),
	new Howl( {volume: 0.5, src: 'sounds/pinwheel.mp3'		}	),
	new Howl( {volume: 0.5, src: 'sounds/piston-1.mp3'		}	),
	new Howl( {volume: 0.5, src: 'sounds/piston-2.mp3'		}	),
	new Howl( {volume: 0.5, src: 'sounds/piston-3.mp3'		}	),
	new Howl( {volume: 0.5, src: 'sounds/prism-1.mp3'		} 	),
	new Howl( {volume: 0.5, src: 'sounds/prism-2.mp3'		} 	),
	new Howl( {volume: 0.5, src: 'sounds/prism-3.mp3'		} 	),
	new Howl( {volume: 0.5, src: 'sounds/splits.mp3'		} 	),
	new Howl( {volume: 0.5, src: 'sounds/squiggle.mp3'		} 	),
	new Howl( {volume: 0.5, src: 'sounds/strike.mp3'		} 	),
	new Howl( {volume: 0.5, src: 'sounds/suspension.mp3'	}	),
	new Howl( {volume: 0.5, src: 'sounds/timer.mp3'			} 	),
	new Howl( {volume: 0.5, src: 'sounds/ufo.mp3'			}	),
	new Howl( {volume: 0.5, src: 'sounds/veil.mp3'			}	),
	new Howl( {volume: 0.5, src: 'sounds/wipe.mp3'			}	),
	new Howl( {volume: 0.5, src: 'sounds/zig-zag.mp3' 		}	)
];
game.music = new Howl( {
	src: 'music/OutThere.ogg',
	autoplay: true,
	loop: true,
	volume: 1
});


function initialiseGame() {
	game.friendlyBalls = [];
	game.evilBalls = [];
	for (var i=0; i<game.numFriendlyBalls; i++) {
		game.friendlyBalls.push(createBall());
	}
	for (var i=0; i<game.numEvilBalls; i++) {
		var radius = 50;
		var x = randomInRange(0 + radius, view.size.width - radius);
		var y = randomInRange(0 + radius, view.size.height - radius);

		ball = new Path.Circle(new Point(x, y), radius);
		ball.radius = radius;
		ball.strokeColor = '#ffffff';
		ball.strokeWidth = 10;
		game.evilBalls.push(ball);
	}
}

function createBall() {
	var radius = randomInRange(game.minRadius, game.maxRadius);
	var x = randomInRange(0 + radius, view.size.width - radius);
	var y = randomInRange(0 + radius, view.size.height - radius);

	ball = new Path.Circle(new Point(x, y), radius);
	ball.radius = radius;
	ball.fillColor = generateColor();
	ball.velX = randomInRange(-4, 4);
	ball.velY = randomInRange(-4, 4);
	ball.collidingWith = [];
	return ball;
}

function randomInRange(min, max) {
	return Math.floor(Math.random() * (max-min) + min);
}

function generateColor() {
	return new Color(Math.random(), Math.random(), Math.random());
}

function isColliding(ball1, ball2) {
	var dist = Math.sqrt(
					 Math.pow(ball1.position.x - ball2.position.x, 2) + Math.pow(ball1.position.y - ball2.position.y, 2)
			);
	if (dist < ball1.radius + ball2.radius) {
		return true;
	}
	return false;
}

// MOVING THE EVIL BALL
function onMouseMove(event) {
	game.evilBalls[0].position = event.point;
}

function onFrame(event) {
	// COUNT FRAMES, CREATE A NEW BALL IF NEEDED
	game.frameNumber++;
	game.frameNumber %= 100;
	if (game.frameNumber === 0 && game.friendlyBalls.length < game.numFriendlyBalls) {
			game.friendlyBalls.push(createBall());
	}

	for (var i=0; i<game.friendlyBalls.length; i++) {
		// MOVE BALL
		var ball = game.friendlyBalls[i];
		if (ball.position.x+ball.radius+ball.velX >= view.size.width || ball.position.x-ball.radius+ball.velX <= 0) {
			ball.velX *= -1;
		}
		if (ball.position.y+ball.radius+ball.velY >= view.size.height || ball.position.y-ball.radius+ball.velY <= 0) {
			ball.velY *= -1;
		}
		ball.position.x += ball.velX;
		ball.position.y += ball.velY;

		// COLLISION WITH EVIL BALL
		if (isColliding(game.evilBalls[0], ball)) {
			ball.remove();
			game.friendlyBalls.splice(i, 1);
			i--;
			var index = randomInRange(0, game.sounds.length);
			game.sounds[randomInRange(0, game.sounds.length)].play();
		}

		// COLLISIONS FOR FRIENDLY BALLS
		for (var j=0; j<game.friendlyBalls.length; j++) {
			var otherBall = game.friendlyBalls[j];
			if (otherBall === ball) {
				continue;
			}
			else if (isColliding(ball, otherBall)) {
				if (!ball.collidingWith.includes(otherBall)) {
					ball.fillColor = generateColor();
					ball.strokeWidth = 5; 
					ball.strokeColor = 'white';
					ball.collidingWith.push(otherBall);
					continue;
				}
			}
			else if (ball.collidingWith.includes(otherBall)) {
				var index = ball.collidingWith.indexOf(otherBall);
				ball.strokeColor = null;
				ball.strokeWidth = null;
				ball.collidingWith.splice(index, 1);
			}
		}
	}
}



function run() {
	initialiseGame();
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
	if (!(game.minRadius === 20 && game.maxRadius === 50 && game.numFriendlyBalls === 40 && game.numEvilBalls === 1)) {
		// alert('Fail. Function name:', testGame.name);
	}
}

function testInitialiseGame() {
	initialiseGame();
	if (!(Array.isArray(game.friendlyBalls) && game.friendlyBalls.length === 40) 
		&& Array.isArray(game.evilBalls) && game.evilBalls.length === 1) {
		// alert('Fail. Function name:', testInitialiseGame.name);	
	}
}

function runTests() {
	testRandomInRange(-10, 10);
	testGame();
	testInitialiseGame();
}

// runTests();
run();