let r = [];
let inputP;
let inputQ;
let inputA;

function setup() {
	createCanvas(800,400);
	reset();
	inputP = createInput(11);
	inputP.position(150, 65);
	button = createButton('submit');
	button.position(300, 175);
	button.mousePressed(send);	
	inputQ = createInput(13);
	inputQ.position(150, 95);	
	inputA = createInput(73);
	inputA.position(150, 125);
	inputX = createInput(100);
	inputX.position(150, 175);
}

function reset(){
	background(200);
	textSize(20);
	text('first prime:',20,80);
	text('second prime:',20,110);
	text('public key a:',20,140);
	text('number to be encoded:',20,170);
}

function send() {
	reset();
	let p = inputP.value();
	let q = inputQ.value();
	let a = inputA.value();
	let x = inputX.value();

	let m = (p - 1) * (q - 1);
	let k = p * q;
	let ex = modPow(x, a, k);
	text('encoded number is ' + ex,350, 80);
	console.log(ex);
	let b = inv(m, a);
	text('decoding power is ' + b,350, 110);
	console.log(b);
	let dx = modPow(ex, b, k);
	text('decoded number is ' + dx,350, 140);
	console.log(dx);
}


function modPow(b, a, p) {
	let res = 1;
	for (let i = 0; i < a; i++) {
		res = (res * b) % p;
	}
	return res;
}

function inv(m, n) {
	r = [];
	let i = 0;
	let mh = m;
	while (n != 0) {
		r[i] = floor(m / n);
		let mh = m;
		m = n;
		n = mh % n;
		i++;
	}
	let b = 1;
	let N = r.length - 1;
	let a = -r[N - 1];
	for (let i = 2; i <= N; i++) {
		let bh = b;
		b = a;
		a = bh - r[N - i] * a;
		// console.log(a);
	}
	if (a < 0) {
		a += mh;
	}
	return a;
}