let tables = [];
let tableWidth = 100;
let tableHeight = 50;
let xAbstand = 50;
let yAbstand = 10;
let names = ['Tizian', 'Leonie', 'Jana', 'Anton', 'Anna',
  'Smilla', 'Felix', 'Amelie', 'Artur', 'Matilda', 'Lucy', 'Mara', 'Lilian',
  'Ida', 'Isabel', 'Max', 'Noah', 'Paolo', 'Jan Luca', 'Meik', 'Jonas',
  'Dorentina', 'Alina', 'Darwin', 'Lennard', 'Medin'
];
let name = 'none';
let picked = 0;
let isPicked = false;
let noList = true;
let list;


function setup() {
  canvas = createCanvas(1500, 1000);
  canvas.position(50, 100);
  background(255);
  button = createButton('bestimme Sitzordnung');
  button.position(20, 20);
  button.mousePressed(erstelleSitzordnung);
  saveButton = createButton('save Image');
  saveButton.position(200,20);
  saveButton.mousePressed(saveOrdnung);
  tables = [];
  let x = 0;
  let y = 0;
  let k = 0;
  for (let i = 0; i < 4; i++) {
    x = 0;
    for (let j = 0; j < 7; j++) {
      if (k == names.length)
        break;
      tables.push(new Table(x, y, names[k], 0));
      x += tableWidth;
      k++;
    }
    if (k == names.length)
      break;
    y += 100;
  }
}

function saveOrdnung(){
  saveCanvas(canvas, 'myCanvas', 'jpg');
}
function mousePressed() {
  if (mouseY > 0) {
    for (let i = 0; i < names.length; i++) {
      if (abs(tables[i].x + tableWidth / 2 - mouseX) < tableWidth / 2 &&
        abs(tables[i].y + tableHeight / 2 - mouseY) < tableHeight / 2) {
        picked = i;
        isPicked = true;
      }
    }
  }
}

function mouseDragged() {
  if (isPicked) {
    tables[picked].x = mouseX;
    tables[picked].y = mouseY;
  }
}

function mouseReleased() {
  isPicked = false;
}

function createTable(x, y, orientation) {
  if (name == 'none') {
    let i = floor(random() * names.length / 2) * 2;
    name = names.splice(i, 1);
    tables.push(new Table(x, y, name, orientation));
    name = names.splice(i, 1);
  } else {
    tables.push(new Table(x, y, name, orientation));
    name = 'none';
  }
}

function createList() {
  list = [];
  for (let i = 0; i < tables.length / 2; i++) {
    list.push(tables[i].name);
    for (let j = tables.length / 2; j < tables.length; j++) {
      if (abs(tables[i].y - tables[j].y) < tableHeight + 10 &&
        abs(tables[i].x - tables[j].x) < 10) {
        list.push(tables[j].name);
      }
    }
  }
  noList = false;
}

function erstelleSitzordnung() {
  if (noList) {
    createList();
  }
  tables = [];
  names = [];
  for (let i = 0; i < list.length; i++) {
    names[i] = list[i];
  }
  //Mittelreihen
  let x = xAbstand + tableHeight;
  let y = yAbstand + tableHeight + 2 * tableWidth;
  for (let i = 0; i < 2; i++) {
    createTable(x, y, 0);
    x += tableWidth;
  }
  x = xAbstand + tableHeight;
  y = yAbstand + tableHeight + 4.5 * tableWidth;
  for (let i = 0; i < 2; i++) {
    createTable(x, y);
    x += tableWidth;
  }
  x = xAbstand + tableHeight + 5 * tableWidth;
  y = yAbstand + tableHeight + 2 * tableWidth;
  for (let i = 0; i < 2; i++) {
    createTable(x, y);
    x += tableWidth;
  }
  x = xAbstand + tableHeight + 5 * tableWidth;
  y = yAbstand + tableHeight + 4.5 * tableWidth;
  for (let i = 0; i < 2; i++) {
    createTable(x, y);
    x += tableWidth;
  }
  //Türreihe
  x = xAbstand + tableHeight;
  y = yAbstand + tableHeight + 4 * tableWidth;
  for (let i = 0; i < 5; i++) {
    createTable(x, y, 90);
    y -= tableWidth;
  }
  //hintere Reihe
  x = xAbstand;
  y = yAbstand;
  for (let i = 0; i < 8; i++) {
    createTable(x, y, 0);
    x += tableWidth;
  }
  //Fensterreihe
  x = xAbstand + 8 * tableWidth;
  y = yAbstand + tableHeight;
  for (let i = 0; i < 5; i++) {
    createTable(x, y, 90);
    y += tableWidth;
  }

}

function draw() {
  background(255);
  for (let i = 0; i < tables.length; i++) {
    tables[i].show();
  }
}

class Table {
  constructor(x, y, name, orientation) {
    this.x = x;
    this.y = y;
    this.name = name;
    this.orientation = orientation * PI / 180;
  }
  show() {
    push();
    translate(this.x, this.y);
    rotate(this.orientation);
    fill(200);
    rect(0, 0, tableWidth, tableHeight);
    fill(0);
    textSize(20);
    text(this.name, 10, tableHeight / 2);
    pop();
  }
}