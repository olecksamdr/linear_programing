// import { Transform, Equation, Point, CoordinateSystem, Exis } from './geometry.js';

window.addEventListener('load', documentLoaded);

let allEquetions = [];

function documentLoaded() {
	document.forms[0].onsubmit = () => false;

	let canvas = document.getElementById('cnv');
	// console.log(canvas);

	let ctx = canvas.getContext('2d');

	let graph = new CoordinateSystem({
		minX: 0,
		maxX: 10,
		minY: 0,
		maxY: 10,
		offset: 30,
		color: '#000',
		width: canvas.width,
		height: canvas.height,
		ctx: ctx
	});

	graph.draw(ctx);


	let addEquationBtn = document.getElementById('add-equation');
	addEquationBtn.addEventListener('click', addEquetion);

	let x1Inp = document.getElementById('x1-inp');
	let x2Inp = document.getElementById('x2-inp');
	let x0Inp = document.getElementById('x0-inp');
	let operationInp = document.getElementById('operation-select');
	let equalsInp = document.getElementById('equals-inp');

	let outputElem = document.getElementById('output');

	function readEquation() {
		let 
			a = x1Inp.value,
			b = x2Inp.value,
			c = x0Inp.value,
			operation = operationInp.value,
			d = equalsInp.value;

		// console.log(ctx);
		let equation = new Equation(a, b, c, operation, d);
		graph.pushEq(equation);


		let li = document.createElement('li');
		li.innerHTML = `<li> ${equation} </li>`;
		outputElem.appendChild(li);
	}

	function addEquetion(e) {
		e.preventDefault();
		readEquation();
		
		return false;
	}

	// let test = new Exis({
	// 		start: new Point(10, 10),
	// 		end: new Point(canvas.width - 10, 10),
	// 		minVal: -2,
	// 		maxVal: 2,
	// 		type: 'x'
	// 	});

	// new Exis({
	// 		start: new Point(10, trf.y(10)),
	// 		end: new Point(10, trf.y(canvas.height - 10)),
	// 		minVal: -2,
	// 		maxVal: 2,
	// 		type: 'y'
	// 	}).draw(ctx);

	// test.draw(ctx);

	// graph.draw(ctx);
}

