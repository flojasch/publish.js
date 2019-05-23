
var axiom = "F";
var sentence = axiom;
var len=400;
let textpos=50;

var rule=[];
//rule[0] ={
//a: "F",
//b: "FF+[+F-F-F]-[-F+F+F]"
//}
rule[0] ={
  a: "F",
  b: "G-F-G"
}

rule[1] ={
  a: "G",
  b: "F+G+F"
}


function generate(){
  len *=0.5;
 var nextSentence="";
 for(var i=0;i < sentence.length ;i++){
   var current = sentence.charAt(i);
   var found=false;
     for( var j=0;j<rule.length; j++){
       if(current==rule[j].a){
         found=true;
         nextSentence += rule[j].b;
         break;
       }
     }
   if(!found){
     nextSentence += current;
   }
  }


 sentence = nextSentence;
 let text=createP(sentence);
 textpos +=50;
 text.position(450,textpos);
 turtle();
}

function setup(){
  createCanvas(400,800);
  startpos();
  background(200);
  stroke(0);
  let text=createP(axiom);
  text.position(450,textpos);
  turtle();
  var button = createButton("generate");
  button.position(450,20);
  button.mousePressed(generate);
}

function turtle() {
  resetMatrix();
  background(200);
  startpos();
  for(var i=0; i< sentence.length; ++i){
    var current = sentence.charAt(i);

    if (current =="F"){
      line(0,0,len,0);
      translate(len,0);
    } else if(current == "+"){
      rotate(radians(60));
    } else if(current== "-"){
      rotate(-radians(60));
    } else if(current=="["){
      push();
    } else if (current =="]"){
      pop();
    } else if (current=="G"){
      line(0,0,len,0);
      translate(len,0);
    }

  }

}

function startpos(){
  translate(0,height/2);
}
