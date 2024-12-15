let bg, bg2, forward, ceiling, bottom, dog, overlay;
let news, crash, woof, music;
let bgx, ky, vky, score, highscore, speed;
let px, py, dx, dy;
let gamestate;
let a;
let restart;
function setup() {
    createCanvas(1800, 600);
    textFont(a);
    music.loop();
    news.play();
    restart = new button(700, 100, 400, 400, "Restart 'Chase'?", 0, 0, 0);
    highscore = 0;
    reset();
}
function preload() {
    a = loadFont("MS-UIGothic-48.vlw");
    bg = loadImage("highway.jpg");
    bg2 = loadImage("highway2.jpg");
    forward = loadImage("getaway.png");
    ceiling = loadImage("blockadetop.png");
    bottom = loadImage("blockadebot.png");
    dog = loadImage("dog.png");
    overlay = loadImage("overlay.png");
    soundFormats("wav");
    woof = loadSound("woof");
    crash = loadSound("crash");
    news = loadSound("news");
    music = loadSound("music");
}
function reset() {
    px = new Array(3);
    py = new Array(px.length);
    for (let i = 0; i < px.length; i++) {
        px[i] = width + (width / 3) * i;
        py[i] = int(random(200, height - 200));
    }
    dx = new Array(1);
    dy = new Array(dx.length);
    for (let i = 0; i < dx.length; i++) {
        dx[i] = width + (width / 3) * i;
        dy[i] = int(random(200, height - 200));
    }
    speed = 3;
    score = 0;
    ky = 300;
    vky = 0;
    gamestate = true;
}
function draw() {
    if (gamestate) {
        setBG();
        image(overlay, 0, 0);
        setpipes();
        setdog();
        collect();
        car();
        tally();
        checkcrash();
    } else {
        fill(255);
        textSize(50);
        textAlign(CENTER, CENTER);
        text("Arrested!", width / 2, 50);
        fill(255);
        text("Highscore: " + highscore, width / 2, 550);
        restart.update();
        restart.render();
        if (highscore < score) {
            highscore = score;
        }
        if (restart.isClicked()) {
            reset();
        }
    }
}
function car() {
    image(forward, 50, ky);
    ky += vky;
    vky++;
    if (ky > height - forward.height) {
        crash.play();
        gamestate = false;
    }
    if (ky < 0) {
        crash.play();
        gamestate = false;
    }
}
function mouseClicked() {
    vky = -15;
}
function setBG() {
    image(bg, bgx, 0);
    image(bg2, bgx + bg.width, 0);
    image(bg, bgx + 2 * bg.width, 0);
    bgx -= 1;
    if (bgx <= -bg.width) {
        bgx += bg.width;
    }
}
function setpipes() {
    for (let i = 0; i < px.length; i++) {
        px[i] = px[i] - speed;
        image(ceiling, px[i] - 25, py[i] - ceiling.height - 100);
        image(bottom, px[i] - 25, py[i] + 100);
        if (px[i] < -50) {
            px[i] = width + 50;
            py[i] = int(random(100, height - 100));
        }
    }
}
function setdog() {
    for (let i = 0; i < dx.length; i++) {
        dx[i] -= speed;
        for (let j = 0; j < px.length; j++) {
            if (Math.abs(dx[i] - px[j]) < 10) {
                dy[i] = py[j];
            }
        }
        image(dog, dx[i] - 25, dy[i]);
        if (dx[i] < -50) {
            dx[i] = width + 50;
            dy[i] = py[int(random(px.length))];
        }
    }
}
function checkcrash() {
    for (let i = 0; i < px.length; i++) {
        if (px[i] < 75 + forward.width && px[i] > 25 && ky - py[i] > 100) {
            crash.play();
            gamestate = false;
        }
        if (px[i] < 75 + forward.width && px[i] > 25 && py[i] - ky > 100) {
            crash.play();
            gamestate = false;
        }
    }
}
function collect() {
    for (let i = 0; i < dx.length; i++) {
        if (
            dx[i] < 75 + forward.width &&
            dx[i] + dog.width > 75 &&
            dy[i] < ky + forward.height &&
            dy[i] + dog.height > ky
        ) {
            dx[i] = width + 50;
            dy[i] = int(random(100, height - 100));
            woof.play();
            score = score + 2;
            speed++;
        }
    }
}
function tally() {
    fill(255);
    textSize(50);
    textAlign(LEFT_ARROW, TOP);
    text("Score: " + score, 75, 50);
    for (let i = 0; i < px.length; i++) {
        if (px[i] + 25 < 75 && px[i] + 25 + speed >= 75) {
            score++;
        }
    }
}
class button {
    pos = new p5.Vector(0, 0);
    width = 0;
    height = 0;
    paint;
    text;
    pressed = false;
    clicked = false;
    constructor(x, y, w, h, t, r, g, b) {
        this.pos.x = x;
        this.pos.y = y;
        this.width = w;
        this.height = h;
        this.paint = color(r, g, b);
        this.text = t;
    }
    update() {
        if (
            mousePressed == true &&
            mouseButton == LEFT_ARROW &&
            this.pressed == false
        ) {
            this.pressed = true;
            if (
                mouseX >= this.pos.x &&
                mouseX <= this.pos.x + this.width &&
                mouseY >= this.pos.y &&
                mouseY <= this.pos.y + this.height
            ) {
                this.clicked = true;
            }
        } else {
            this.clicked = false;
            this.pressed = false;
        }
    }
    render() {
        fill(this.paint);
        rect(this.pos.x, this.pos.y, this.width, this.height);
        fill(255);
        textAlign(CENTER, CENTER);
        this.text(
            this.text,
            this.pos.x + this.width / 2,
            this.pos.y + this.height / 2
        );
    }
    isClicked() {
        return this.clicked;
    }
}
