"use strict";

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

class Line {
	constructor (point1, point2) {
		this.start = point1;
		this.end = point2;
		this.width = point2.x - point1.x;
		this.height = point2.y - point1.y;
	}
}

class Exis extends Line {
	constructor(options) {
		super(options);
		this.minVal = options.minVal;
		this.maxVal = options.maxVal;
		this.type = options.type; // x, y

		// кількість поділок які треба поставити на вісі Х
		// 1 додаємо щоб врахувати 0
		this.exisPointsCount = Math.abs(this.minVal) + Math.abs(this.maxVal) + 1;

		// відступи між поділками
		if (this.type == 'x') {
			this.margin = Math.floor( this.width / this.exisPointsCount);
		} else {
			this.margin = Math.floor( this.height / this.exisPointsCount);
		}

	}

	draw(ctx) {
		this.drawLine(ctx);
		this.drawArrow(ctx);
		this.drawGraduations(ctx)
	}

	drawLine(ctx) {
		ctx.moveTo(this.startPoint.x, this.startPoint.y);
		ctx.lineTo(this.endPoint.x, this.endPoint.y);
		ctx.stroke();
	}

	drawArrow(ctx) {
		if (this.type == 'x') {
			// x exis
			new Arrow({
				startX: this.end.x - 10,
				startY: this.end.y,
				width: 20,
				height: 20,
				arcR: 10
			}).draw(ctx);
		} else {
			// y exis
			new Arrow({
				startX: this.zero.x - 10,
				startY: cnvHeight - this.offset,
				width: 20,
				height: 20,
				arcR: 10,
				rotate: 90
			}).draw(ctx);
		}
	}

	drawGraduations(ctx) {
		let textWidth, textHeight;

		if (this.type == 'x') {
			for(let i = 0; i < this.exisPointsCount - 1; i++) {
				let margin = i * this.margin;

				ctx.moveTo(margin, this.start.y - 5);
				ctx.lineTo(margin, this.start.y + 5);
				ctx.stroke();

				ctx.font = '16px arial';

				textWidth = ctx.measureText(this.minX + i).width,
				textHeight = parseInt(ctx.font);

				ctx.fillText(this.minVal + i, margin,  this.start.y + textHeight + textHeight / 2);
			}
		} else {
				// y exis
			for(let i = 0; i < this.exisPointsCount - 1; i++) {
				let margin = i * this.margin;

				ctx.moveTo(margin, this.start.x - 5);
				ctx.lineTo(margin, this.start.x + 5);
				ctx.stroke();

				ctx.font = '16px arial';

				textWidth = ctx.measureText(this.minX + i).width,
				textHeight = parseInt(ctx.font);

				ctx.fillText(this.minVal + i, margin,  this.start.x + textHeight + textHeight / 2);
			}
		}
	}
}

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
	constructor(option) {
		this.width = option.width;
		this.height = option.height;
		this.minX = option.minX || 0;
		this.maxX = option.maxX || 0;
		this.minY = option.minY || 0;
		this.maxY = option.maxY || 0;
		this.offset = option.offset || 0;
		// this.color = option.color || '#000';

		//  шукаємо позицію нуля на канвасі
		let 
			x = this.offset + (Math.abs(this.minX) + Math.abs(this.maxX)) / 2 * this.marginX,
			y = this.offset + (Math.abs(this.minY) + Math.abs(this.maxY)) / 2 * this.marginY;


		this.zero = new Point(x, y);

		this.xExis = new Exis({
			start: new Point(this.offset, this.zero.y),
			end: new Point(this.width - this.offset, this.zero.y),
			minVal: this.minX,
			maxVal: this.maxX,
			type: 'x'
		});

		this.yExis = new Exis({
			start: new Point(this.zero.x, this.offset),
			end: new Point(this.zero.x, this.height - this.offset),
			minVal: this.minX,
			maxVal: this.maxX,
			type: 'y'
		});

		// this.width = this.ctx.canvas.clientWidth;
		// this.height = this.ctx.canvas.clientHeight;

		// // кількість поділок які треба поставити на вісі Х
		// this.xExisPointsCount = Math.abs(this.minX) + Math.abs(this.maxX) + 1;
		// this.yExisPointsCount = Math.abs(this.minY) + Math.abs(this.maxY) + 1;

		// // відступи між поділками
		// this.marginX = Math.floor( this.width / this.xExisPointsCount);
		// this.marginY = Math.floor( this.height / this.yExisPointsCount);


		// //  шукаємо позицію нуля на канвасі
		// let 
		// 	x = this.offset + (Math.abs(this.minX) + Math.abs(this.maxX)) / 2 * this.marginX,
		// 	y = this.offset + (Math.abs(this.minY) + Math.abs(this.maxY)) / 2 * this.marginY;


		// this.zero = new Point(x, y);

		// let 
		// 	start = new Point(this.offset, this.zero.y),
		// 	end = new Point(this.width - this.offset, this.offset);

		// this.xExis = new Line(start, end);

		// start = new Point(this.zero.x, this.offset),
		// end = new Point(this.zero.x, this.height - this.offset);

		// this.yExis = new Line(start, end);
	}

	draw(ctx) {
		this.xExis.draw(ctx);
		this.yExis.draw(ctx);

		// let cnvWidth = ctx.canvas.clientWidth;
		// let cnvHeight = ctx.canvas.clientHeight;
		// // // кількість поділок які треба поставити на вісі Х
		// let xExisPointsCount = Math.abs(this.minX) + Math.abs(this.maxX) + 1;
		// let yExisPointsCount = Math.abs(this.minY) + Math.abs(this.maxY) + 1;
		// console.log(yExisPointsCount, Math.abs(this.minY), this.minY);

		// let width = ctx.canvas.clientWidth;
		// let height = ctx.canvas.clientHeight;

		// let marginX = Math.floor( width / xExisPointsCount);
		// let marginY = Math.floor( height / yExisPointsCount);

		// // draw x exis
		// ctx.save();

		// // перевертаємо систему координат
		// ctx.translate(0, cnvWidth);
		// ctx.scale(1, -1);

		// ctx.beginPath();

		// // draw x exis
		// ctx.moveTo(this.startXPos, this.startYPos);
		// ctx.lineTo(this.width - this.offset, this.offset);
		// ctx.stroke();

		// new Arrow({
		// 	startX: this.startXPos - 10,
		// 	startY: this.offset,
		// 	width: 20,
		// 	height: 20,
		// 	arcR: 10
		// }).draw(ctx);

		// // draw y exis
		// ctx.moveTo(this.zero.x, this.offset);
		// ctx.lineTo(this.zero.x, cnvHeight - this.offset);
		// ctx.stroke();

		// new Arrow({
		// 	startX: this.zero.x - 10,
		// 	startY: cnvHeight - this.offset,
		// 	width: 20,
		// 	height: 20,
		// 	arcR: 10,
		// 	rotateAngel: 90
		// }).draw(ctx);

		// ctx.closePath();
		// ctx.restore();

		// // малюємо поділки на осі X
		// for(let i = 0; i < this.xExisPointsCount - 1; i++) {
		// 	let margin = i * this.marginX;

		// 	ctx.moveTo(this.offset + margin, cnvHeight - this.offset - 5);
		// 	ctx.lineTo(this.offset + margin, cnvHeight - this.offset + 5);
		// 	ctx.stroke();

		// 	ctx.font = '16px arial';

		// 	let 
		// 		textWidth = ctx.measureText(this.minX + i).width,
		// 		textHeight = parseInt(ctx.font);

		// 	ctx.fillText(this.minX + i, this.offset + margin - 5,  cnvHeight - this.offset + textHeight + textHeight / 2);

		// }

		// // малюємо поділки на осі Y
		// for(let i = 0; i <= this.yExisPointsCount; i++) {
		// 	let margin = i * this.marginY;

		// 	ctx.moveTo(this.offset - 5, this.offset + this.margin);
		// 	ctx.lineTo(this.offset + 5, this.offset + this.margin);
		// 	ctx.stroke();
		// }
	}

	// _drawArrow() {}
}

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
	// "ax1 + ax2 + c = d"
	constructor(a, b, c, operation, d) {
		this.a = Number(a) || 0;
		this.b = Number(b) || 0;
		this.c = Number(c) || 0;
		this.operation = operation || '=';
		this.eq = Number(d) || 0;
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

		result += ` ${this.operation} ${this.eq}`;

		return result;
	}
}
