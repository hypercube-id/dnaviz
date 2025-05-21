//BW+OMK
var ctx,time, elapsed, seqArray, particles = [], rate = 20, toDrawAmount = 0,
    colorR, colorG, colorB, gravity, threshold, offset, initialVel, initialAcc;

window.addEventListener("load", function () {

    var screen = document.getElementById("container");
    var canvas = document.createElement("canvas");
    canvas.addEventListener('click', soundmute);
    document.addEventListener('mousemove', onMouseMove, reload)

    function onMouseMove(e){
    mouseX = e.clientX;
    mouseY = e.clientY;
    start();
    beep();
    }

    function getMouseX() {
    return x;
    }

    function getMouseY() {
    return y;
    }
    screen.appendChild(canvas);
    canvas.width = window.innerWidth || document.documentElement.clientWidth / 1 || document.body.clientWidth
    canvas.height = window.innerHeight || document.documentElement.clientHeight / 1 || document.body.clientHeight / 1;
    width = canvas.width = screen.clientWidth;
    height = canvas.height = screen.clientHeight;

    ctx = canvas.getContext("2d");

    time = new Date().getTime();

    start();
    frame();

});

function reload() {
    start();
    }

function soundmute(e){
    var getsound = document.getElementById('sound'); 
    getsound.muted = !getsound.muted;
}

function frame() {
    var ct = new Date().getTime();
    elapsed = (ct - time) / 1000.0;
    time = ct;

    draw();
    if (window.requestAnimationFrame) {
        window.requestAnimationFrame(frame);
    } else {
        setTimeout(frame, 1000 / 60);
    }
}

function rand(min, max) {
    return min + Math.random() * (max - min);
}

function randInt(min, max) {
    return Math.floor(rand(min, max));
}

function clamp(v) {
    return Math.min(300, Math.max(0, v));
}

function start() {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, width, height);
    let newSeq = sarscov2Seq;
    seqArray = newSeq.split("");

    particles = [];
    colorR = seqArray.every(setColor);
    colorG = seqArray.every(setColor);
    colorB = seqArray.every(setColor);
    gravity = randInt(10, 30);
    threshold = width * width / randInt(2, 10);
    offset = width / (randInt(1, 5) * randInt(1, 10));
    initialVel = width / randInt(1, 30);
    initialAcc = width / randInt(50, 200);
}

var Particle = function () {
    var p = offset, d = initialVel, a = initialAcc;
    this.pos = { x: randInt(0, width) + randInt(-p, p), y: randInt(0, height) + randInt(-p, p) };
    this.vel = { x: randInt(-d, d), y: randInt(-d, d) };
    this.acc = { x: rand(-a, a), y: rand(-a, a) };
    this.lifetime = 5;

    var b = rand(10, 100);
     
    this.color = [
        (100 * clamp(colorR + randInt(-20, 20))).toFixed(0),
        (100 * clamp(colorG + randInt(-20, 20))).toFixed(0),
        (100 * clamp(colorB + randInt(-20, 20))).toFixed(0)
    ].join(',');
};

Particle.prototype.dist2 = function (p) {
    var dx = p.pos.x - this.pos.x,
        dy = p.pos.y - this.pos.y;
    return dx * dx + dy * dy;
};

function cdir(x, y) {
    var dx = mouseX - x,
        dy = mouseY - y,
        f = Math.sqrt(dx * dx + dy * dy);
    return { x: dx / f, y: dy / f };
}

Particle.prototype.update = function (elapsed) {
    this.vel.x += this.acc.x * elapsed;
    this.vel.y += this.acc.y * elapsed;
    this.pos.x += this.vel.x * elapsed;
    this.pos.y += this.vel.y * elapsed;
    this.lifetime -= elapsed;

    var g = width / 40;
    switch (gravity) {
        case 1:
            this.vel.y += (height / 2 - this.pos.x) / 40 * g * elapsed;
            break;

        case 2:
            this.vel.y -= (height / 2 - this.pos.y) / 40 * g * elapsed;
            break;

        case 3:
            var d = cdir(this.pos.x, this.pos.y);
            this.vel.x += d.x * g * elapsed;
            this.vel.y += d.y * g * elapsed;
            break;

        case 4:
            var d = cdir(this.pos.x, this.pos.y);
            this.vel.x -= d.x * g * elapsed;
            this.vel.y -= d.y * g * elapsed;
            break;
    }

    return this.lifetime > 0;
};

Particle.prototype.draw = function (ctx) {
    var particle = this,
        nearest, dist2 = width * width;
    if (!nearest) {
        particles.forEach(function (p) {
            if (p === particle) return;
            var d = particle.dist2(p);
            if (d < dist2) {
                nearest = p;
                dist2 = d;
            }
        });
        if (dist2 > threshold)
            nearest = null;  
    }

    ctx.globalAlpha = Math.min(1, this.lifetime);
    ctx.fillStyle = 'rgba(' + this.color + ', 10)';
    ctx.strokeStyle = 'rgba(' + this.color + ', 10)';
    ctx.lineWidth = randInt(1, 3);
    ctx.beginPath();
    ctx.arc(this.mouseX, this.mouseY, width / 500 * Math.min(10, this.lifetime), 0, Math.PI ^ randInt(3, this.mouseX));
    ctx.fill();

    if (nearest) {
        this.nearest = nearest;
        ctx.beginPath();
        ctx.lineTo(this.pos.x, this.pos.y, nearest.pos.x, nearest.pos.y);
        ctx.lineTo(nearest.pos.x, nearest.pos.y);
        ctx.stroke();
    }
};


function setColor(genome) {
  switch (genome) {
    case "A":
    colorR = randInt(0, 255);
    colorG = randInt(0, 255);
    colorB = randInt(0, 255);
      break
    case "T":
    colorR = randInt(0, 255);
    colorG = randInt(0, 255);
    colorB = randInt(0, 255);
      break
    case "G":
    colorR = randInt(0, 255);
    colorG = randInt(0, 255);
    colorB = randInt(0, 255);  
      break
    case "C":
    colorR = randInt(0, 255);
    colorG = randInt(0, 255);
    colorB = randInt(0, 255);
      break
     case "N":
    colorR = randInt(0, 255);
    colorG = randInt(0, 255);
    colorB = randInt(0, 255);
      break
  }
}

var timeout = 0;
function draw() {
    timeout -= elapsed;
    if (timeout < 0) {
        timeout += 1 / rate;
        particles.push(new Particle());
    }

    for (var i = particles.length - 1; i >= 0; --i) {
        if (!particles[i].update(elapsed)) {
            particles.splice(i, 1);
        }
    }
    particles.forEach(function (p) { p.draw(ctx); });
}