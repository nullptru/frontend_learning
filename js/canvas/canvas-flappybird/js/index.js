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
  }

  setHorizonSpeed(speed) {
    this.xSpeed = speed;
  }

  setVerticalSpeed(speed) {
    this.ySpeed = speed;
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

  update() {
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  }
}

/**
 * game border
 */
class Border {
  constructor() {
    this.frameNo =  0;
    this.width = 500;
    this.height = 300;
    this.canvas = undefined;

    this.bird = undefined;
    this.blocks = [];
    this.restartListener = undefined;
  }

  init() {
    const root = document.getElementById('root');
    this.canvas = this.createCanvas();
    root.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d');
    this.bird = new Component(this.ctx);

    // add listener
    this.addKeyListener();
  }

  addClickListener() {
    this.restartListener = (ev) => {
      console.log('click', ev);
      const mouse = {
        x: ev.pageX - this.canvas.offsetLeft,
        y: ev.pageY - this.canvas.offsetTop,
      };
      console.log(mouse.x, this.width / 2, this.height / 2)
      if (mouse.x > this.width / 2 - 45 && mouse.x < this.width / 2 + 45 
        && mouse.y > this.height / 2 - 20 && mouse.y < this.height / 2 + 20) {
          this.restart();
        }
    };
    this.canvas.addEventListener('click', this.restartListener);
  }

  addKeyListener() {
    document.addEventListener('keypress', ({ key }) => {
      switch(key.toLowerCase()) {
        case 'a': this.bird.setHorizonSpeed(-2); break;
        case 'd': this.bird.setHorizonSpeed(2); break;
        case 'w': this.bird.setVerticalSpeed(-2); break;
        case 's': this.bird.setVerticalSpeed(2); break;
        default: break;
      }
    });
    document.addEventListener('keyup', ({ key }) => {
      switch(key.toLowerCase()) {
        case 'a':
        case 'd': this.bird.setHorizonSpeed(0); break;
        case 'w':
        case 's': this.bird.setVerticalSpeed(0); break;
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
      // this.restart();
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
    this.bird.update();
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
    this.canvas.removeEventListener('click', this.restartListener);
    this.blocks = [];
    this.bird = new Component(this.ctx);
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
      const MIN_GAP = 50;
      const MAX_GAP = 110;

      const gap = (MAX_GAP - MIN_GAP) * Math.random() + MIN_GAP;
      console.log(gap);
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

    setTimeout(() => {
      this.updateGame();
    }, 1000 / 60);
  }
}

const border = new Border();
border.init();
border.render();