let tables = [];
let tableWidth = 100;
let tableHeight = 50;
let xAbstand = 50;
let yAbstand = 10;
let orientation;
let names = ['Tizian', 'Leonie', 'Jana', 'Anton', 'Anna',
  'Smilla', 'Felix', 'Amelie', 'Artur', 'Matilda', 'Lucy', 'Mara', 'Lilian',
  'Ida', 'Isabel', 'Max', 'Noah', 'Paolo', 'Jan Luca', 'Meik', 'Jonas',
  'Dorentina', 'Alina', 'Darwin', 'Lennard', 'Medin'
];
let drawline = false;

function setup() {
  canvas = createCanvas(1500, 1000);
  canvas.position(50, 100);
  background(255);
  button = createButton('bestimme Sitzordnung');
  button.position(900, 20);
  button.mousePressed(erstelleSitzordnung);
  tables = [];
  let x = 0;
  let y = 0;
  orientation = 0;
  for (let i = 0; i < 13; i++) {
    createTable(x, y);
    x += tableWidth;
  }
  y = 200;
  x = 0;
  for (let i = 0; i < 13; i++) {
    createTable(x, y);
    x += tableWidth;
  }
}

function mousePressed() {
  if (mouseX < 890) {
    
  }
}

function mouseDragged() {
  // drawline = true;
}

function createTable(x, y) {
  let i = floor(random() * names.length);
  let name = names.splice(i, 1);
  tables.push(new Table(x, y, name, orientation));
}

function erstelleSitzordnung() {
  names = ['Tizian', 'Leonie', 'Jana', 'Anton', 'Anna',
    'Smilla', 'Felix', 'Amelie', 'Artur', 'Matilda', 'Lucy', 'Mara', 'Lilian',
    'Ida', 'Isabel', 'Max', 'Noah', 'Paolo', 'Jan Luca', 'Meik', 'Jonas',
    'Dorentina', 'Alina', 'Darwin', 'Lennard', 'Medin'
  ];
  tables = [];
  let x = xAbstand;
  let y = yAbstand;
  orientation = 0;
  //hintere Reihe
  for (let i = 0; i < 8; i++) {
    createTable(x, y);
    x += tableWidth;
  }
  //Mittelreihen
  x = xAbstand + tableHeight;
  y = yAbstand + tableHeight + 2 * tableWidth;
  for (let i = 0; i < 3; i++) {
    createTable(x, y);
    x += tableWidth;
  }
  x = xAbstand + tableHeight;
  y = yAbstand + tableHeight + 4.5 * tableWidth;
  for (let i = 0; i < 3; i++) {
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
  //Fensterreihe
  x = xAbstand + 8 * tableWidth;
  y = yAbstand + tableHeight;
  orientation = 90;
  for (let i = 0; i < 5; i++) {
    createTable(x, y);
    y += tableWidth;
  }
  //Türreihe
  x = xAbstand + tableHeight;
  y = yAbstand + tableHeight;
  for (let i = 0; i < 5; i++) {
    createTable(x, y);
    y += tableWidth;
  }
}

function draw() {
  background(255);
  for (let i = 0; i < tables.length; i++) {
    tables[i].show();
  }
  // if (drawline) {
  //   line(startx, starty, mouseX, mouseY);
  // }
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