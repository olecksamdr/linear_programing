/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.l = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };

/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};

/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};

/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });


/*
                     /$$             /$$    
                    |__/            | $$    
  /$$$$$$   /$$$$$$  /$$ /$$$$$$$  /$$$$$$  
 /$$__  $$ /$$__  $$| $$| $$__  $$|_  $$_/  
| $$  \ $$| $$  \ $$| $$| $$  \ $$  | $$    
| $$  | $$| $$  | $$| $$| $$  | $$  | $$ /$$
| $$$$$$$/|  $$$$$$/| $$| $$  | $$  |  $$$$/
| $$____/  \______/ |__/|__/  |__/   \___/  
| $$                                        
| $$                                        
|__/  

*/

// transform y coordinates 
class Transform {
	constructor(canvas) {
		this.cnv = canvas;
	}

	y(y) {
		return this.cnv.height - y;
	}
}
/* harmony export (immutable) */ __webpack_exports__["Transform"] = Transform;


class Point {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}

	toString() {
		return `(${this.x}; ${this.y})`;
	}

	subtract(point2) {
		return new Point(this.x - point2.x, this.y - point2.y);
	}
}
/* harmony export (immutable) */ __webpack_exports__["Point"] = Point;


class Line {
	constructor (startPoint, endPoint, ctx) {
		this.start = startPoint;
		this.end = endPoint;
		this.width = endPoint.x - startPoint.x;
		this.height = endPoint.y - startPoint.y;
	}

	draw(ctx) {
		ctx.moveTo(this.start.x, this.start.y);
		ctx.lineTo(this.end.x, this.end.y);
		ctx.stroke();
	}
}
/* harmony export (immutable) */ __webpack_exports__["Line"] = Line;


class Exis {
	constructor(options) {
		this.start = options.start;
		this.end = options.end;
		this.line = new Line(options.start, options.end);
		this.minVal = options.minVal;
		this.maxVal = options.maxVal;
		this.type = options.type; // x, y

		// кількість поділок які треба поставити на вісі Х
		// 1 додаємо щоб врахувати 0
		this.exisPointsCount = Math.abs(-this.minVal + Math.abs(this.maxVal)) + 1;
		console.log('min, max', this.minVal, this.maxVal);

		// відступи між поділками
		if (this.type == 'x') {
			this.unit = Math.floor( this.line.width / this.exisPointsCount);
		} else {
			this.unit = Math.floor( this.line.height / this.exisPointsCount);
			console.log('line height', this.line.height)
			console.log('exis unit', this.unit);
		}

		// console.log('line width', this.line.width);
		console.log('points count', this.exisPointsCount);
		// console.log('unit', this.unit);

	}

	draw(ctx, angle) {
		if (!angle) angle = 0;

		ctx.save();

		ctx.translate(this.line.width / 2, this.line.height / 2);
		ctx.rotate( angle * Math.PI / 180);
		ctx.translate(-this.line.width / 2, -this.line.height / 2);

		this.drawLine(ctx);
		this.drawArrow(ctx);
		this.drawGraduations(ctx);

		ctx.restore();
	}

	drawLine(ctx) {
		this.line.draw(ctx);
	}

	drawArrow(ctx) {
		if (this.type == 'x') {
			// x exis
			new Arrow({
				startX: this.end.x - 20,
				startY: this.end.y,
				width: 20,
				height: 20,
				arcR: 10
			}).draw(ctx);
		} else {
			// y exis
			new Arrow({
				startX: this.end.x - 10,
				startY: this.end.y + 10,
				width: 20,
				height: 20,
				arcR: 10,
				rotate: -90
			}).draw(ctx);
		}
	}

	drawGraduations(ctx) {
		let textWidth, textHeight;

		if (this.type == 'x') {
			for(let i = 0; i < this.exisPointsCount; i++) {
				let margin = this.start.x + i * this.unit;

				// console.log(margin);

				ctx.moveTo(margin, this.start.y - 5);
				ctx.lineTo(margin, this.start.y + 5);
				ctx.stroke();

				ctx.font = '16px arial';

				textWidth = ctx.measureText(this.minVal + i).width,
				textHeight = parseInt(ctx.font);

				// console.log('tetx width', textWidth);
				// console.log('margin', margin);

				ctx.fillText(this.minVal + i, margin - textWidth / 2,  this.start.y + textHeight + textHeight / 2);
			}
		} else {
				// y exis
			for(let i = 0; i < this.exisPointsCount; i++) {
				console.log('yExisPointsCount', this.exisPointsCount);

				let margin = this.start.y + i * this.unit;

				ctx.moveTo(this.start.x - 5, margin);
				ctx.lineTo(this.start.x + 5, margin);
				ctx.stroke();

				ctx.font = '16px arial';

				textWidth = ctx.measureText(this.minX + i).width,
				textHeight = parseInt(ctx.font);

				ctx.fillText(this.minVal + i, this.start.x + textWidth / 2, margin + textHeight / 2);
			}
		}
	}
}
/* harmony export (immutable) */ __webpack_exports__["Exis"] = Exis;


class Arrow {

	// options: ctx, startX, startY, width, height, arcR, rotate
	constructor(option) {
		this.ctx = option.ctx;
		this.startX = option.startX;
		this.startY = option.startY;
		this.width = option.width;
		this.height = option.height;
		this.arcR = option.arcR || 40;
		this.rotate = option.rotate || 0;
	}

	draw(ctx) {
	  let 
	  	startX = this.startX,
	  	startY = this.startY,
	  	width = this.width,
	  	height = this.height,
	  	arcR = this.arcR,
	  	rotate =  this.rotate;

	  ctx.save();
	  ctx.beginPath();
	  ctx.translate(startX + width / 2, startY);
	  ctx.rotate(rotate * Math.PI / 180);
	  ctx.translate(-(startX + width / 2), -startY);

	  
	  ctx.moveTo(startX + width, startY);
	  ctx.lineTo(startX, startY - height / 2);
	  ctx.arcTo(startX + width, startY, startX, startY + height / 2, arcR);
	  ctx.lineTo(startX, startY + height / 2);
	  ctx.stroke();
	  ctx.fill();
	  ctx.closePath();
	  ctx.restore();
	}
}

class CoordinateSystem {
	constructor(options) {

		this.equations = [];

		this.width = options.width;
		this.height = options.height;
		this.minX = options.minX || 0;
		this.maxX = options.maxX || 0;
		this.minY = options.minY || 0;
		this.maxY = options.maxY || 0;
		this.offset = options.offset || 0;
		this.ctx = options.ctx;

		this.trf = new Transform(this.ctx.canvas);
		// this.color = options.color || '#000';

		let yPointCount = Math.abs(this.minY) + Math.abs(this.maxY) + 1;
		let xPointCount = Math.abs(this.minX) + Math.abs(this.maxX) + 1;

		console.log('xPointCount', xPointCount);
		console.log('yPointCount', yPointCount);
		console.log('width', this.width);

		// відступи між поділками
		// if (this.type == 'x') {
			this.unitX = Math.floor( (this.width - 2*this.offset) / xPointCount);
		// } else {
			this.unitY = Math.floor( (this.height - 2*this.offset) / yPointCount);
		// }

		console.log('uniyY system', this.unitY);

		//  шукаємо позицію нуля на канвасі
			let j = 0;
			for (let i = this.minX; i < 0; i++) {
				j++
			}

			let x = this.offset + j * this.unitX;

			j = 0;
			for (let i = this.minY; i < 0; i++) {
				j++
			}

			let y = this.offset + j * this.unitY;


		this.zero = new Point(x, this.trf.y(y));

		console.log(this.offset, this.unitX, this.unitY, this.zero.x, this.zero.y, this.minX, this.maxX);

		this.xExis = new Exis({
			start: new Point(this.offset, this.zero.y),
			end: new Point(this.width - this.offset, this.zero.y),
			minVal: this.minX,
			maxVal: this.maxX,
			type: 'x'
		});

		this.yExis = new Exis({
			start: new Point(this.zero.x, this.trf.y(this.offset)),
			end: new Point(this.zero.x, this.trf.y(this.height - this.offset)),
			minVal: this.minY,
			maxVal: this.maxY,
			type: 'y'
		});

		this.start = new Point(this.offset, this.height - this.offset);
		this.end = new Point(this.width - this.offset, this.offset);

		console.log('graph start end', this.start, this.end);
	}

	pushEq(eq) {
		this.equations.push(eq);

		// this.ctx.lineTo(100, 100);
		eq.draw(this, this.ctx, this.unitX, this.unitY, this.trf);
		console.log('drawing eq', eq);
	}

	draw(ctx) {
		this.xExis.draw(ctx);
		this.yExis.draw(ctx, 0);
	}

}
/* harmony export (immutable) */ __webpack_exports__["CoordinateSystem"] = CoordinateSystem;


/*
                                           /$$     /$$                    
                                          | $$    |__/                    
  /$$$$$$   /$$$$$$  /$$   /$$  /$$$$$$  /$$$$$$   /$$  /$$$$$$  /$$$$$$$ 
 /$$__  $$ /$$__  $$| $$  | $$ |____  $$|_  $$_/  | $$ /$$__  $$| $$__  $$
| $$$$$$$$| $$  \ $$| $$  | $$  /$$$$$$$  | $$    | $$| $$  \ $$| $$  \ $$
| $$_____/| $$  | $$| $$  | $$ /$$__  $$  | $$ /$$| $$| $$  | $$| $$  | $$
|  $$$$$$$|  $$$$$$$|  $$$$$$/|  $$$$$$$  |  $$$$/| $$|  $$$$$$/| $$  | $$
 \_______/ \____  $$ \______/  \_______/   \___/  |__/ \______/ |__/  |__/
                | $$                                                      
                | $$                                                      
                |__/                                                      
*/

class Equation {
	// "ax1 + bx2 + c = d"
	constructor(a, b, c, operation, d) {
		this.a = Number(a) || 0;
		this.b = Number(b) || 0;
		this.c = Number(c) || 0;
		this.operation = operation || '=';
		this.d = Number(d) || 0;
	}

	draw(ctx) {
		if (a != 0 && b != 0) {
			let p1 = new Point(solve(this.b, this.c, this.d), solve(this.a, this.c, this.d));
		}
	}

	// ax + b = c 
	solve(a, b, c) {
		return (c - b) / a;
	}

	draw(graph, ctx, unitX, unitY, transform) {
		let
			start = new Point(graph.start.x, graph.start.y + transform.y(this.solve(this.b, this.c, this.d) * unitY)),
			end = new Point(graph.start.x + this.solve(this.a, this.c, this.d) * unitX, graph.start.y),
			line = new Line(start, end);

		console.log('eq', this);
		console.log('eq draw start', start);
		console.log('eq draw end', end);
		console.log('solved', this.solve(this.b, this.c, this.d));
		line.draw(ctx);

	}

	toString() {
		let result = `${this.a}x1`;

		if (this.b > 0)
			result += ` + ${this.b}x2`;
		else
			result += ` - ${Math.abs(this.b)}x2`;

		if (this.c > 0)
			result += ` + ${this.c}`;
		else 
			result += ` - ${Math.abs(this.c)}`;

		result += ` ${this.operation} ${this.d}`;

		return result;
	}
}
/* harmony export (immutable) */ __webpack_exports__["Equation"] = Equation;



/***/ })
/******/ ]);