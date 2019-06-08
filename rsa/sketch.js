let r = [];
let inputP;
let inputQ;
let inputA;

function setup() {
	inputP = createInput('first prime');
	inputP.position(20, 65);
	button = createButton('submit');
	button.position(inputP.x + inputP.width, 155);
	button.mousePressed(send);
	inputQ = createInput('second prime');
	inputQ.position(20, 95);
	inputA = createInput('public key a');
	inputA.position(20, 125);
	inputX = createInput('number to be encoded');
	inputX.position(20, 155);
}

function send() {
	let p = inputP.value();
	let q = inputQ.value();
	let a = inputA.value();
	let x = inputX.value();

	let m = (p - 1) * (q - 1);
	let k = p * q;
	let ex = modPow(x, a, k);
	pex = createP('encoded number is ' + ex);
	pex.position(300, 65);
	console.log(ex);
	let b = inv(m, a);
	pb = createP('decoding power is ' + b);
	pb.position(300, 95);
	console.log(b);
	let dx = modPow(ex, b, k);
	pdx = createP('decoded number is ' + dx);
	pdx.position(300, 125);
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