A simple HTML5 Snake Game, using jQuery and Canvas.

#Usage

```html
<html>
  <head>
    <title>Snake Game</title>
    <script src="jquery.min.js"></script>
    <script src="assets/javascripts/jquery.snake.js"></script>
  </head>
  <body>
    <canvas id="snake"></canvas>
    <script>
      var snake = jQuery('#snake').snake({ speed: 5 });
      snake.start();
      snake.setSpeed(10);
  </body>
</html>
```

# Options
`width` The horizontal size of game block, default is `60`.
`height` The vertical size of game block, default is `40`.
`backgroundColor` The background color of game, default is `black`.
`snakeColor` The snake color, default is `white`.
`appleColor` The apple color, default is `white`.
`speed` The snake move speed, default is `2`.
`blockSize` The size of block, default is `10`. Default canvas size will be 600px x 400px.
`startX` The snake default start positionX, default is `30`.
`startY` The snake default start positionY, default is `20`.

# Method
`start` Let game start.
`setSpeed` Change game speed. (Snake eat 1 apple, the speed will plus 1)

Reference: [http://css-tricks.com/learn-canvas-snake-game/](http://css-tricks.com/learn-canvas-snake-game/)
