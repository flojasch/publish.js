var axiom = "F";
var sentence = axiom;
var len;
let dropdown;
let angle;
let factor;
let rule = [];
let selection = 'none';
let strokeColor;

function generate() {
  if (dropdown.selected() != selection) {
    selection = dropdown.selected();
    len = 400;

    if (selection === 'Sierpinsky') {
      rule = [];
      rule[0] = {
        a: "F",
        b: "G-F-G"
      };
      rule[1] = {
        a: "G",
        b: "F+G+F"
      };
      angle = 60;
      factor = 0.5;
      sentence = "F";
      len = 800;
      stroke(255);
    }
    if (selection === 'Kochkurve') {
      rule = [];
      rule[0] = {
        a: "F",
        b: "-G++G-"
      };
      rule[1] = {
        a: "G",
        b: "+F--F+"
      };
      angle = 30;
      factor = 1 / sqrt(3);
      sentence = "F";
      len = 800;
      stroke(255);
    }
    if (selection === 'Plant') {
      rule = [];
      rule[0] = {
        a: "F",
        b: "FF"
      };
      rule[1] = {
        a: "X",
        b: "F+[[X]-X]-F[-FX]+X"
      };
      angle = -25;
      factor = 0.5;
      sentence = "++X";
      len = 300;
      stroke(108, 188, 22, 100);      
    }
  }
  len *= factor;
  var nextSentence = "";
  for (var i = 0; i < sentence.length; i++) {
    var current = sentence.charAt(i);
    var found = false;
    for (var j = 0; j < rule.length; j++) {
      if (current == rule[j].a) {
        found = true;
        nextSentence += rule[j].b;
        break;
      }
    }
    if (!found) {
      nextSentence += current;
    }
  }

  sentence = nextSentence;
  text.html(sentence);
  turtle();
}

function setup() {
  createCanvas(800, 800);
  startpos();
  turtle();
  var button = createButton("generate");
  button.mousePressed(generate);
  dropdown = createSelect();
  dropdown.option('Sierpinsky');
  dropdown.option('Kochkurve');
  dropdown.option('Plant');
  text = createP(axiom);

}

function turtle() {
  resetMatrix();
  background(0);
  startpos();
  for (var i = 0; i < sentence.length; ++i) {
    var current = sentence.charAt(i);

    if (current == "F") {
      line(0, 0, len, 0);
      translate(len, 0);
    } else if (current == "+") {
      rotate(radians(angle));
    } else if (current == "-") {
      rotate(-radians(angle));
    } else if (current == "[") {
      push();
    } else if (current == "]") {
      pop();
    } else if (current == "G") {
      line(0, 0, len, 0);
      translate(len, 0);
    }
  }
}

function startpos() {
  translate(0, height - 2);
}