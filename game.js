/**
 * Created by mk_1 on 5/9/17.
 */
window.onload = init;

var map;
var ctxMap;

var pl;
var ctxPl;

var enemyCanvas;
var ctxEnemy;

var stats;
var ctxStats;

var drawBtn;
var clearBtn;

var gameWidth = 800;
var gameHeight = 500;

var bgImage = new Image();
bgImage.src = "img/imageBg4.jpg";

var tiles = new Image();
tiles.src = "img/tiles.png";

var player;
var enemyes = [];

//for creating enemies
var spawnInterval;
var spawnTime = 6000;
var spawnAmount = 3;

var isPlaying;

var health;

var requestAnimationFrame = window.requestAnimFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame;

function init() {

    map = document.getElementById("map");
    ctxMap = map.getContext("2d");

    map.width = gameWidth;
    map.height = gameHeight;

    pl = document.getElementById("player");
    ctxPl = pl.getContext("2d");

    pl.width = gameWidth;
    pl.height = gameHeight;


    enemyCanvas = document.getElementById("enemy");
    ctxEnemy = enemyCanvas.getContext("2d");

    enemyCanvas.width = gameWidth;
    enemyCanvas.height = gameHeight;

    stats = document.getElementById("stats");
    ctxStats = stats.getContext("2d");

    stats.width = gameWidth;
    stats.height = gameHeight;

    ctxStats.fillStyle = "#3D3D3D";
    ctxStats.font = "bold 15pt Arial";


    drawBtn = document.getElementById("drawBtn");
    clearBtn = document.getElementById("clearBtn");


    player = new Player();

    health = 100;


    drawBg();
    startLoop();
    updateStats();

    document.addEventListener("keydown", checkKeyDown, false);
    document.addEventListener("keyup", checkKeyUp, false);


}

function resetHealth() {
    if (health < 20) health = 100;
}

function loop() {
    if (isPlaying) {
        draw();
        update();
        requestAnimationFrame(loop);
    }
}

function startLoop() {
    isPlaying = true;
    loop();
    startCreatingEnemies();
}

function stopLoop() {
    isPlaying = false;
}

function update() {
    player.update();
    for (var i = 0; i < enemyes.length; i++) {
        enemyes[i].update();
    }


}

function draw() {
    clearPlayerCanv();
    clearEnemyCanv();
    player.draw();
    for (var i = 0; i < enemyes.length; i++) {
        enemyes[i].draw();
    }

}


//create enemies
function spawnEnemies(count) {
    for (var i = 0; i < count; i++) {
        enemyes[i] = new Enemy();
    }
}

function startCreatingEnemies() {
    //удалить старые объекты
    stopCreatingEnemies();
    spawnInterval = setInterval(function () {
        spawnEnemies(spawnAmount);
    }, spawnTime);
}

function stopCreatingEnemies() {
    clearInterval(spawnInterval);
}


function checkKeyDown(e) {
    var keyID = e.keyCode || e.which;
    var keyChar = String.fromCharCode(keyID);

    if (keyChar == "W") {
        player.isUp = true;
        e.preventDefault();
        console.log("a click");
    }

    if (keyChar == "S") {
        player.isDown = true;
        e.preventDefault();
    }

    if (keyChar == "A") {
        player.isLeft = true;
        e.preventDefault();
    }

    if (keyChar == "D") {
        player.isRight = true;
        e.preventDefault();
    }
}


function checkKeyUp(e) {
    var keyID = e.keyCode || e.which;
    var keyChar = String.fromCharCode(keyID);

    if (keyChar == "W") {
        player.isUp = false;
        e.preventDefault();
    }

    if (keyChar == "S") {
        player.isDown = false;
        e.preventDefault();
    }

    if (keyChar == "A") {
        player.isLeft = false;
        e.preventDefault();
    }

    if (keyChar == "D") {
        player.isRight = false;
        e.preventDefault();
    }
}


//objects
function Player() {
    this.srcX = 0;
    this.srcY = 0;
    this.drawX = 0;
    this.drawY = 0;
    this.width = 191;
    this.height = 74;
    this.isUp = false;
    this.isDown = false;
    this.isRight = false;
    this.isLeft = false;


    this.speed = 5;
}

function Enemy() {
    this.srcX = 0;
    this.srcY = 80;
    this.drawX = Math.floor(Math.random() * gameWidth / 2 + gameWidth);
    this.drawY = Math.floor(Math.random() * gameHeight);
    this.width = 191;
    this.height = 74;

    this.speed = 9;
}

Player.prototype.draw = function () {
    ctxPl.drawImage(tiles, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, 191, 74);

};

Player.prototype.update = function () {
    resetHealth();


    this.choseDir();
    if (this.drawX < 0) this.drawX = 0;
    if (this.drawY < 0) this.drawY = 0;
    if (this.drawX > gameWidth - this.width) this.drawX = gameWidth - this.width;
    if (this.drawY > gameHeight - this.height) this.drawY = gameHeight - this.height;


};

Player.prototype.choseDir = function () {
    if (this.isUp) this.drawY -= this.speed;
    if (this.isDown) this.drawY += this.speed;
    if (this.isRight) this.drawX += this.speed;
    if (this.isLeft) this.drawX -= this.speed;
};

Enemy.prototype.draw = function () {
    ctxEnemy.drawImage(tiles, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, 191, 74);

};

Enemy.prototype.update = function () {
    this.drawX -= this.speed;
    if (this.drawX + this.width < 0) {
        this.destroy();
    }
};

Enemy.prototype.destroy = function () {
    enemyes.splice(enemyes.indexOf(this), 1);
};

function clearPlayerCanv() {
    ctxPl.clearRect(0, 0, 800, 500);
}

function clearEnemyCanv() {
    ctxEnemy.clearRect(0, 0, 800, 500);
}


function drawRect() {
    ctxMap.fillStyle = "red";
    ctxMap.fillRect(50, 20, 50, 50);
}

function clearRect() {
    ctxMap.clearRect(0, 0, 800, 500);
}

function drawBg() {
    ctxMap.drawImage(bgImage, 0, 0, 626, 455, 0, 0, gameWidth, gameHeight);
}


function updateStats() {
    ctxStats.clearRect(0, 0, gameWidth, gameHeight);
    ctxStats.fillText("Health: " + health, 10, 20);
}
