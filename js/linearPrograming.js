window.addEventListener('load', documentLoaded);

let allEquetions = [];

function documentLoaded() {
	document.forms[0].onsubmit = () => false;

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

		let equation = new Equation(a, b, c, operation, d);
		allEquetions.push(equation);

		let li = document.createElement('li');
		li.innerHTML = `<li> ${equation} </li>`;
		outputElem.appendChild(li);
	}

	function addEquetion(e) {
		e.preventDefault();
		readEquation();
		
		return false;	
	}

	let canvas = document.getElementById('cnv');
	console.log(canvas);
	let ctx = canvas.getContext('2d');

	let graph = new CoordinateSystem({
		minX: -2,
		maxX: 2,
		minY: -2,
		maxY: 4,
		offset: 50,
		color: '#000',
		width: canvas.innerWidth,
		height: canvas.innerHeight
	});

	graph.draw(ctx);
}

