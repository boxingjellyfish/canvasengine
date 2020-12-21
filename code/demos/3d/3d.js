/*
 * A main loop useful for games and other animated applications.
 * https://github.com/IceCreamYou/MainLoop.js/blob/gh-pages/src/mainloop.js
 */
class Loop {
	constructor() {
		this.simulationTimestep = 1000 / 60;
		this.frameDelta = 0;
		this.lastFrameTimeMs = 0;
		this.fps = 60;
		this.fpsAlpha = 0.9;
		this.fpsUpdateInterval = 1000;
		this.lastFpsUpdate = 0;
		this.framesSinceLastFpsUpdate = 0;
		this.numUpdateSteps = 0;
		this.minFrameDelay = 0;
		this.running = false;
		this.started = false;
		this.panic = false;
		this.fpsHistogram = [];
		this.frameHandle = null;

		this.canvas = document.getElementById("canvas");
		this.ctx = canvas.getContext("2d");

		// Resize
		window.addEventListener("resize", () => {
			this.resize();
		}, false);
		this.resize();
	}

	// Returns Frames per Second.
	getFPS() {
		return this.fps;
	}

	// Returns last 100 FPS.
	getFPSHistogram() {
		return this.fpsHistogram;
	}

	// Starts the main loop.
	start() {
		if (!this.started) {
			this.started = true;
			this.frameHandle = requestAnimationFrame((timestamp) => {
				this.draw(1);
				this.running = true;
				this.lastFrameTimeMs = timestamp;
				this.lastFpsUpdate = timestamp;
				this.framesSinceLastFpsUpdate = 0;
				this.frameHandle = requestAnimationFrame(this.animate.bind(this));
			});
		}
		return this;
	}

	// Stops the main loop.
	stop() {
		this.running = false;
		this.started = false;
		cancelAnimationFrame(this.frameHandle);
		return this;
	}

	// Returns true if loop is running.
	isRunning() {
		return this.running;
	}

	// The main loop that runs updates and rendering.
	animate(timestamp) {
		this.frameHandle = requestAnimationFrame(this.animate.bind(this));
		if (timestamp < this.lastFrameTimeMs + this.minFrameDelay) { return; }
		this.frameDelta += timestamp - this.lastFrameTimeMs;
		this.lastFrameTimeMs = timestamp;
		this.begin(timestamp, this.frameDelta);
		if (timestamp > this.lastFpsUpdate + this.fpsUpdateInterval) {
			this.fps = this.fpsAlpha * this.framesSinceLastFpsUpdate * 1000 / (timestamp - this.lastFpsUpdate) + (1 - this.fpsAlpha) * this.fps;
			this.lastFpsUpdate = timestamp;
			this.framesSinceLastFpsUpdate = 0;
		}
		this.framesSinceLastFpsUpdate++;
		this.numUpdateSteps = 0;
		while (this.frameDelta >= this.simulationTimestep) {
			this.update(this.simulationTimestep);
			this.frameDelta -= this.simulationTimestep;
			if (++this.numUpdateSteps >= 240) {
				this.panic = true;
				break;
			}
		}
		this.draw(this.frameDelta / this.simulationTimestep);
		this.end(this.fps, this.panic);
		this.panic = false;
		this.fpsHistogram.push(Math.round(this.fps));
		if (this.fpsHistogram.length >= 100) {
			this.fpsHistogram.splice(0, 1);
		}
	}

	resize() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	// Loop begin function.
	begin(timestamp, delta) {

	}

	// Loop end function.
	end(fps, panic) {

	}

	// Loop update function.
	update(delta) {
	}

	// Loop render function.
	draw(interp) {

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
		this.ctx.save();
		
		this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);

		for (var i = 0; i < triangles.length; i++) {

			var t  = triangles[i];

			var a  = this.project(points[t.a]);
			var b  = this.project(points[t.b]);
			var c  = this.project(points[t.c]);

			this.ctx.fillStyle = t.color;
			this.ctx.strokeStyle = t.color;
			this.ctx.beginPath();
			this.ctx.moveTo(a.x, a.y);
			this.ctx.lineTo(b.x, b.y);
			this.ctx.lineTo(c.x, c.y);
			this.ctx.closePath();
			//this.ctx.fill();
			this.ctx.stroke();
		}

		this.ctx.restore();
		this.ctx.fillStyle = "#FFF";
		this.ctx.font = "12px monospace";
		this.ctx.fillText(Math.round(this.fps) + " FPS", 15, 15);

	}

	project(o) {
		var p = new Vector();
		p.x = Math.round(o.x * distance / o.z);
		p.y = Math.round(o.y * distance / o.z);
		//console.log("{" + o.x.toFixed(2) + "," + o.y.toFixed(2) + "," + o.z.toFixed(2) + "} -> {" + + p.x.toFixed(0) + "," + p.y.toFixed(0) + "}");
		return p;
	}
}

class Vector {
	constructor(x, y, z) {
		this.x = x ? x : 0;
		this.y = y ? y : 0;
		this.z = z ? z : 0;
	}
}

class Triangle {
	constructor(a, b, c, color) {
		this.a = a ? a : 0;
		this.b = b ? b : 0;
		this.c = c ? c : 0;
		this.color = color ? color : "#FFF";
	}
}

var distance = 100;
//var points = [new Vector(50, 50, 100), new Vector(100, 50, 100), new Vector(50, 100, 100), new Vector(70, 70, 100)];
//var triangles = [new Triangle(0, 1, 2, "#F00"), new Triangle(0, 1, 3, "#0F0"), new Triangle(0, 2, 3, "#00F"), new Triangle(1, 2, 3, "#FFF")];
//var points = [new Vector(50, 50, 10), new Vector(50, 100, 10), new Vector(150, 150, 10)];
//var triangles = [new Triangle(0, 1, 2, "#F00")];
var modelPoints = [new Vector(-5, -5, 0), new Vector(5, -5, 0), new Vector(5, 5, 0), new Vector(-5, 5, 0)];
var modeltriangles = [new Triangle(0, 1, 2, "#F00"), new Triangle(2, 3, 0, "#0F0")];

var loop = new Loop();
loop.start();