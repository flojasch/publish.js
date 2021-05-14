let zn = [];

function minimandel() {
  let c = new Complex(mx, my);
  let period;
  for (let p = 1; p < 1000; p++) {
    setzn(c, p);
    zn[0].div(zn[1]);
    let r = Complex.abs(zn[0]);
    if(r < ex/2){
      period=p;
      console.log(p);
      break;
    }
  }
  for (let k = 0; k < 10; ++k) {
    setzn(c,period);
    zn[0].div(zn[1]);
    c.sub(zn[0]);
  }
  // let z = new Complex(c.x, c.y);
  // for (let k = 1; k < period; k++) {
  //   zn[1].mult(z);
  //   zn[1].mult(2);
  //   z.mult(z);
  //   z.add(c);
  // }
  mxneu=c.x;
  myneu=c.y;
  // ex=4/Complex.abs(zn[1]);
  // ey=ex;
  action=true;
  ismini=true;
}

function setzn(c, P) {
  let N = 2;
  for (let k = 0; k < N; ++k)
    zn[k] = new Complex(0, 0);

  for (n = 0; n < P; n++) {
    for (let k = N - 1; k >= 0; k--) {
      let dz = new Complex(0, 0);
      for (let l = 0; l <= k; ++l) {
        dz.add(Complex.mult(zn[l], zn[k - l]));
      }
      zn[k].set(dz);
    }
    zn[1].add(1);
    zn[0].add(c);
  }
}