/*jslint browser: true*/
/*global jQuery,console*/

/**
 * jQuery Snake
 *
 * @author 蒼時弦也
 * @version 0.0.1
 */

(function ($) {
    "use strict";

    $.fn.snake = function (args) {

        args = args || {};

        var width = args.width || 60,
            height = args.height || 40,
            backgroundColor = args.bgckground || "#000",
            snakeColor = args.snakeColor || "#FFF",
            appleColor = args.appleColor || "#FFF",
            speed = args.speed || 2,
            frameLength = Math.ceil(1000 / speed) || 500, //Count Frame Per Second, Default 30 FPS around 1000/30 = 33.333
            blockSize = args.blockSize || 10,
            startX = args.startX || 30,
            startY = args.startY || 20,
            self = this,
            canvas,
            canvasWidth = width * blockSize,
            canvasHeight = height * blockSize,
            snake,
            apple,
            timeout;

        function gameOver() {
            var centerX = canvasWidth / 2,
                centerY = canvasHeight / 2;

            canvas.save();

            canvas.clearRect(0, 0, canvasWidth, canvasHeight);
            canvas.font = '30px "Open Sans",sans-serif normal';
            canvas.fillStyle = "#000";
            canvas.textAlign = "center";
            canvas.textBaseline = "middle";
            canvas.fillText("Game Over", centerX, centerY - 10);
            canvas.font = '15px "Open Sans",sans-serif normal';
            canvas.fillText("Press space to restart", centerX, centerY + 15);

            canvas.restore();
        }

        function gameLoop() {
            // Refresh Canva
            canvas.clearRect(0, 0, canvasWidth, canvasHeight);

            // Set Background Color
            canvas.fillStyle = backgroundColor;
            canvas.fillRect(0, 0, canvasWidth, canvasHeight);

            // Controll Snake
            snake.handleMove(apple);
            snake.draw(canvas);

            // Controll Apple
            apple.draw(canvas);

            // Game Over Check
            if (snake.checkCollision()) {
                snake.retreat();
                snake.draw(canvas);
                gameOver();
            } else {
                // Update Frame Updae
                timeout = setTimeout(gameLoop, frameLength);
            }
        }

        function restart() {
            clearTimeout(timeout);
            $(document).unbind('keydown');
            $(snake).unbind('appleEaten');
            self.start();
        }

        function touchCheck(objectA, objectB) {
            return objectA[0] === objectB[0] && objectA[1] === objectB[1];
        }

        function AppleObject() {
            var position = [6, 6];

            function draw(canvas) {
                var radius = blockSize / 2,
                    x = position[0] * blockSize + radius,
                    y = position[1] * blockSize + radius;

                canvas.save();

                canvas.fillStyle = appleColor;
                canvas.beginPath();
                canvas.arc(x, y, radius, 0, Math.PI * 2, true);
                canvas.fill();

                canvas.restore();
            }

            function random(low, high) {
                return Math.floor(Math.random() * (high - low + 1) + low);
            }

            function getRandomPosition() {
                var x = random(1, width - 2),
                    y = random(1, height - 2);

                return [x, y];
            }

            function setNewPosition(snakeArray) {
                var newPosition = getRandomPosition();

                if (snake.bodyCollision(newPosition, snakeArray)) {
                    setNewPosition(snakeArray);
                } else {
                    position = newPosition;
                }
            }

            function getPosition() {
                return position;
            }

            return {
                draw: draw,
                getPosition: getPosition,
                setNewPosition: setNewPosition
            };

        };

        function SnakeObject() {
            var pos = [],
                lastPos = [],
                direction = "right";

            // Initialize Snake
            pos.push([startX, startY]);
            pos.push([startX - 1, startY]);
            pos.push([startX - 2, startY]);

            function drawSection(canvas, position) {
                var x = blockSize * position[0],
                    y = blockSize * position[1];

                canvas.fillRect(x, y, blockSize, blockSize);
            }

            function draw(canvas) {
                var i;

                canvas.save();

                canvas.fillStyle = snakeColor;
                for (i = 0; i < pos.length; i += 1) {
                    drawSection(canvas, pos[i]);
                }

                canvas.restore();
            }

            function handleMove(apple) {
                var nextPosition = pos[0].slice();

                switch (direction) {
                case 'up':
                    nextPosition[1] -= 1;
                    break;
                case 'down':
                    nextPosition[1] += 1;
                    break;
                case 'left':
                    nextPosition[0] -= 1;
                    break;
                case 'right':
                    nextPosition[0] += 1;
                    break;
                }

                lastPos = pos.slice();
                pos.unshift(nextPosition);
                if (touchCheck(pos[0], apple.getPosition())) {
                    $(snake).trigger('appleEaten', [pos]);
                } else {
                    pos.pop();
                }
            }

            function setDirection(newDirection) {
                var allowDirection = [];
                switch (direction) {
                case 'up':
                case 'down':
                    allowDirection = ['left', 'right'];
                    break;
                case 'left':
                case 'right':
                    allowDirection = ['up', 'down'];
                    break;
                }

                if (allowDirection.indexOf(newDirection) > -1) {
                    direction = newDirection;
                }
            }

            function bodyCollision(head, rest) {
                var isInArray = false;

                $.each(rest, function (index, item) {
                    if (touchCheck(head, item)) {
                        isInArray = true;
                    }
                });

                return isInArray;
            }

            function checkCollision() {
                var wallCollision = false,
                    snakeCollision = false,
                    head = pos[0],
                    rest = pos.slice(1),
                    snakeX = head[0],
                    snakeY = head[1],
                    minX = 1,
                    minY = 1,
                    maxX = width,
                    maxY = height,
                    outsideHorizontal = snakeX < minX || snakeX >= maxX,
                    outsideVertical = snakeY < minY || snakeY >= maxY;

                if (outsideHorizontal || outsideVertical) {
                    wallCollision = true;
                }

                snakeCollision = bodyCollision(head, rest);

                return wallCollision || snakeCollision;
            }

            function retreat() {
                pos = lastPos;
            }

            return {
                draw: draw,
                handleMove: handleMove,
                setDirection: setDirection,
                checkCollision: checkCollision,
                retreat: retreat,
                bodyCollision: bodyCollision
            };
        };

        this.start = function () {
            // Set Canvas Size
            $(self).attr('width', canvasWidth).attr('height', canvasHeight);

            // Get Context
            canvas = self[0].getContext("2d");

            //Initialize Game Object
            snake = new SnakeObject();
            apple = new AppleObject();

            // Run Game
            gameLoop();

            // Bind Keydown
            $(document).keydown(function (event) {
                var keyToDirection = {
                    37: 'left',
                    38: 'up',
                    39: 'right',
                    40: 'down'
                },
                    direction = keyToDirection[event.which];

                if (direction) {
                    snake.setDirection(direction);
                    event.preventDefault();
                } else if (event.which === 32) {
                    restart();
                }

            });

            $(snake).bind('appleEaten', function (event, snakeArray) {
                apple.setNewPosition(snakeArray);
                self.setSpeed(speed + 1);
            });

            return this;
        };

        this.setSpeed = function (newSpeed) {
            speed = newSpeed;
            frameLength = Math.ceil(1000 / newSpeed);

            return this;
        };

        return this;

    };

}(jQuery));
