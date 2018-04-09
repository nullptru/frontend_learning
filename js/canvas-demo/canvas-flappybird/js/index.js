class Component {
  constructor(context, x = 200, y = 100, width = 30, height = 30, color = 'red') {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.xSpeed = 0;
    this.ySpeed = 0;
    this.context = context;
    this.color = color;
    this.gravity = 0;
    this.gravitySpeed = 0;
  }

  setHorizonSpeed(speed) {
    this.xSpeed = speed;
  }

  setVerticalSpeed(speed) {
    this.ySpeed = speed;
  }

  setGravity(gravity) {
    this.gravity = gravity;
  }

  draw() {
    // drawBird
    this.context.fillStyle = this.color;
    this.context.fillRect(this.x, this.y, this.width, this.height);
  }

  isCrashed(otherComponent) {
    const myLeft = this.x;
    const myRight = this.x + this.width;
    const myTop = this.y;
    const myBottom = this.y + this.height;

    const obstacleLeft = otherComponent.x;
    const obstacleRight = otherComponent.x + otherComponent.width;
    const obstacleTop = otherComponent.height > 0 ? otherComponent.y : otherComponent.y+ otherComponent.height;
    const obstacleBottom = otherComponent.height > 0 ? otherComponent.y + otherComponent.height : otherComponent.y;

    if (obstacleLeft > myRight || obstacleBottom < myTop || obstacleTop > myBottom || obstacleRight < myLeft) {
      return false;
    }
    return true;
  }

  update(width, height) {
    this.gravitySpeed += this.gravity;
    this.x = this.x + this.xSpeed;
    this.y = this.y + this.ySpeed + this.gravitySpeed;
    if (height !== undefined) {
      // console.log(this.x, this.xSpeed, this.y, this.ySpeed, this.gravitySpeed)
    }
    if (height !== undefined) {
      if (this.y < 0) { this.y = 0; this.gravitySpeed = 0; }
      if (this.y > height - this.height) { this.y = height - this.height; this.gravitySpeed = 0; }
    }
    if (width !== undefined) {
      if (this.x < 0) { this.x = 0; }
      if (this.x > width - this.width) { this.x = width - this.width; }
    }
  }
}

/**
 * game border
 */
class Border {
  constructor(width = 667, height = 375, isHorizontal = false) {
    this.frameNo =  0;
    this.width = width;
    this.height = height;
    // when device is pc, use horizaontal mode, otherwise, use vertical mode
    this.isHorizontal = isHorizontal;

    this.canvas = undefined;
    // canvas context
    this.ctx = undefined;

    this.bird = undefined;
    this.blocks = [];
    // used only when game is over
    this.restartListener = undefined;
    this.restartTouchListener = undefined;
    
    // operator image
    let image_left = new Image();
    image_left.src = './img/arrow_left.png';
    let image_right = new Image();
    image_right.src = './img/arrow_right.png';
    let image_down = new Image();
    image_down.src = './img/arrow_down.png';
    let image_up = new Image();
    image_up.src = './img/arrow_up.png';
    this.directions = {
      left: image_left,
      right: image_right,
      down: image_down,
      up: image_up,
    };
    let image_jump = new Image();
    image_jump.src = './img/arrow_up.png';
    this.jump = image_jump;
  }

  init() {
    // append canvas to root
    const root = document.getElementById('root');
    this.canvas = this.createCanvas();
    root.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');

    // draw init bird
    this.bird = new Component(this.ctx);
    this.bird.setGravity(0.05);
    // add listener
    this.addKeyListener();
    this.addOperatorListener();
  }

  drawOperator() {
    // draw direction
    this.ctx.drawImage(this.directions.up, 60, this.height - 140, 50, 50);
    this.ctx.drawImage(this.directions.down, 60, this.height - 60, 50, 50);
    this.ctx.drawImage(this.directions.left, 20, this.height - 100, 50, 50);
    this.ctx.drawImage(this.directions.right, 100, this.height - 100, 50, 50);
    // draw jump
    this.ctx.drawImage(this.jump, this.width - 110, this.height - 110, 80, 80);
  }

  // 判断点是否在四个方向键
  isInLeft(point) {
    return point.x > 20 && point.x < 70 && point.y > this.height - 100 && point.y < this.height - 50;
  }

  isInRight(point) {
    return point.x > 100 && point.x < 150 && point.y > this.height - 100 && point.y < this.height - 50;
  }

  isInDown(point) {
    return point.x > 60 && point.x < 110 && point.y > this.height - 60 && point.y < this.height - 10;
  }

  isInUp(point) {
    return point.x > 60 && point.x < 110 && point.y > this.height - 140 && point.y < this.height - 90;
  }

  isInJump(point) {
    return point.x > this.width - 110 && point.x < this.width - 30 && point.y > this.height - 110 && point.y < this.height - 30;
  }

  _operatorUp(ev) {
    let mouse;
    if (!this.isHorizontal) {
      mouse = {
        x: ev.pageY - this.canvas.offsetTop,
        y: this.height - (ev.pageX - this.canvas.offsetLeft),
      };
    } else {
      mouse = {
        x: ev.pageX - this.canvas.offsetLeft,
        y: ev.pageY - this.canvas.offsetTop,
      };
    }
    if (this.isInLeft(mouse) || this.isInRight(mouse)) {
      this.bird.setHorizonSpeed(0);
    } else if (this.isInDown(mouse) || this.isInUp(mouse)) {
      this.bird.setVerticalSpeed(0);
    }

    if (this.isInJump(mouse)) {
      this.bird.setGravity(0.05);
    }
  }

  _operatorDown(ev) {
    let mouse;
    if (!this.isHorizontal) {
      mouse = {
        x: ev.pageY - this.canvas.offsetTop,
        y: this.height - (ev.pageX - this.canvas.offsetLeft),
      };
    } else {
      mouse = {
        x: ev.pageX - this.canvas.offsetLeft,
        y: ev.pageY - this.canvas.offsetTop,
      };
    }
    if (this.isInLeft(mouse)) {
      this.bird.setHorizonSpeed(-2);
    } else if (this.isInRight(mouse)) {
      this.bird.setHorizonSpeed(2);
    } else if (this.isInDown(mouse)) {
      this.bird.setVerticalSpeed(2);
    } else if (this.isInUp(mouse)) {
      this.bird.setVerticalSpeed(-2);
    }
    if (this.isInJump(mouse)) {
      this.bird.setGravity(-0.1);
    }
  }

  _addMouseOperatorListener() {
    this.directionMouseDownListener = (ev) => {
      this._operatorDown(ev);
    };
    this.directionMouseUpListener = (ev) => {
      this._operatorUp(ev);
    };
    document.addEventListener('mousedown', this.directionMouseDownListener);
    document.addEventListener('mouseup', this.directionMouseUpListener);
  }

  _addTouchOperatorListener() {
    this.directionTouchStartListener = ({ changedTouches }) => {
      event.preventDefault(); // prevent touch event
      const ev = changedTouches[0];
      this._operatorDown(ev);
    };
    this.directionTouchEndListener = ({ changedTouches }) => {
      event.preventDefault(); // prevent touch event
      const ev = changedTouches[0];
      this._operatorUp(ev);
    };
    document.addEventListener('touchstart', this.directionTouchStartListener);
    document.addEventListener('touchend', this.directionTouchEndListener);
  }

  addOperatorListener() {
    this._addMouseOperatorListener();
    this._addTouchOperatorListener();
  }

  addClickListener() {
    const restart = (ev) => {
      let mouse;
      if (!this.isHorizontal) {
        mouse = {
          x: ev.pageY - this.canvas.offsetTop,
          y: this.height - (ev.pageX - this.canvas.offsetLeft),
        };
      } else {
        mouse = {
          x: ev.pageX - this.canvas.offsetLeft,
          y: ev.pageY - this.canvas.offsetTop,
        };
      }
      if (mouse.x > this.width / 2 - 45 && mouse.x < this.width / 2 + 45 
        && mouse.y > this.height / 2 - 20 && mouse.y < this.height / 2 + 20) {
          this.restart();
        }
    };
    this.restartListener = (ev) => {
      restart(ev);
    };
    this.restartTouchListener = ({ changedTouches }) => {
      event.preventDefault(); // prevent touch event
      const ev = changedTouches[0];
      restart(ev);
    }
    document.addEventListener('click', this.restartListener);
    document.addEventListener('touchstart', this.restartTouchListener);
  }

  addKeyListener() {
    document.addEventListener('keypress', ({ key }) => {
      switch(key.toLowerCase()) {
        case 'a': this.bird.setHorizonSpeed(-2); break;
        case 'd': this.bird.setHorizonSpeed(2); break;
        case 'w': this.bird.setVerticalSpeed(-2); break;
        case 's': this.bird.setVerticalSpeed(2); break;
        case 'j': this.bird.setGravity(-0.1); break;
        default: break;
      }
    });
    document.addEventListener('keyup', ({ key }) => {
      switch(key.toLowerCase()) {
        case 'a':
        case 'd': this.bird.setHorizonSpeed(0); break;
        case 'w':
        case 's': this.bird.setVerticalSpeed(0); break;
        case 'j': this.bird.setGravity(0.05); break;
        default: break;
      }
    });
  }

  createCanvas() {
    const canvasContainer = document.createElement('canvas');
    canvasContainer.width = this.width;
    canvasContainer.height = this.height;
    canvasContainer.style.background = 'lightgrey';
    return canvasContainer;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  updateGame() {
    if (this.isGameOver()) {
      this.addClickListener();
      // draw restart button
      this.ctx.fillStyle = 'rgba(23,23,23,0.3)';
      this.ctx.fillRect(0, 0, this.width, this.height);
      this.ctx.fillStyle = 'rgba(100,23,200,0.7)';
      this.ctx.fillRect(this.width / 2 - 45, this.height / 2 - 20, 90, 40);
      this.ctx.fillStyle = 'rgb(255, 255, 255)';
      this.ctx.fillText('Restart', this.width / 2 - 28, this.height / 2 + 5);
      return -1;
    }

    this.blocks = this.blocks.filter(obstacleFilter => obstacleFilter.x > -obstacleFilter.width).map((obstacle) => {
      obstacle.update();
      return obstacle;
    });
    this.bird.update(this.width, this.height);
    this.clear();
    this.render();
  }

  isGameOver() {
    for(let i in this.blocks) {
      if (this.bird.isCrashed(this.blocks[i])) {
        return true;
      }
    }
    return false;
  }

  restart() {
    // remove gameover listener
    document.removeEventListener('click', this.restartListener);
    document.removeEventListener('touchstart', this.restartTouchListener);
    // reset data
    this.blocks = [];
    this.bird = new Component(this.ctx);
    this.bird.setGravity(0.05);
    this.frameNo = 0;
    this.render();
  }

  sholdUpdateObstacle() {
    return this.frameNo % 150 === 0;
  }

  render () {
    if (this.sholdUpdateObstacle()) {
      const MIN_HEIGHT = 30;
      const MAX_HEIGHT = 220;
      const MIN_GAP = 80;
      const MAX_GAP = 130;

      const gap = (MAX_GAP - MIN_GAP) * Math.random() + MIN_GAP;
      const height = (MAX_HEIGHT - MIN_HEIGHT) * Math.random() + MIN_HEIGHT;
      const obstacle = new Component(this.ctx, this.width, 0, 35, height, 'green');
      const obstacle2 = new Component(this.ctx, this.width, this.height, 35, (height + gap) - this.height, 'green');
      obstacle.setHorizonSpeed(-1);
      obstacle2.setHorizonSpeed(-1);
      this.blocks.push(obstacle);
      this.blocks.push(obstacle2);
    }
    this.frameNo += 1;
    this.bird.draw();
    this.blocks.forEach(obstacle => obstacle.draw());

    // draw score
    this.ctx.font = '20px Consolas';
    this.ctx.fillStyle = 'black';
    this.ctx.fillText(`Score: ${this.frameNo}`, this.width - 130, 35);

    this.drawOperator();

    requestAnimationFrame(this.updateGame.bind(this));
  }
}

const isMobile = () => {
  if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
    return true;
  } else {
    return false;
  }
}

const main = () => {
  if (isMobile()) {
    let root = document.getElementById('root');
    root.style.transform = "rotate(90deg)";
    document.body.style.height = `${window.innerHeight}px`;
    document.body.style.width = `${window.innerWidth}px`;
    const border = new Border(window.innerHeight, window.innerWidth, false);
    border.init();
    border.render();
    console.log(navigator.userAgent, 'mobile');
  } else {
    let root = document.getElementById('root');
    const textEle = document.createElement('div');
    textEle.innerText = "操纵方式为两种，可通过界面上的操作键进行点击操作，也可通过键盘wasd进行方向，j进行跳跃操作";
    root.appendChild(textEle);
    const border = new Border(undefined, undefined, true);
    border.init();
    border.render();
    console.log(navigator.userAgent, 'PC');
  }
}

main();