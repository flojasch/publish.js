import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import {
  GUI
} from 'https://cdn.jsdelivr.net/npm/three@0.112.1/examples/jsm/libs/dat.gui.module.js';

let fog=0;

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

function main() {
  const canvas = document.querySelector('#c');
  const renderer = new THREE.WebGLRenderer({
    canvas
  });
  renderer.autoClearColor = false;

  const camera = new THREE.OrthographicCamera(
    -1, //left
    1, //right
    1, //top
    -1, //bottom
    -1, //near,
    1, //far
  );
  
  const scene = new THREE.Scene();
  const plane = new THREE.PlaneGeometry(2, 2);
  const fragmentShader = `
#include <common>
#define MAX_STEPS 100
#define MAX_DIST 100.
#define MIN_DIST 1e-7

uniform vec3 iResolution;
uniform float iTime;
uniform vec3 az;
uniform vec3 ay;
uniform vec3 ax;
uniform vec3 ro;
uniform float scale;
uniform int MAX_ITER; 
uniform float rotx;
uniform float rotz;
uniform float roty;
uniform float fog;

float colorind;
float surfDist= .01;

void rotX(inout vec3 p, float alpha){
    float c=cos(alpha), s=sin(alpha);
    p.yz = mat2(c,-s,s,c)*p.yz; 
}
void rotZ(inout vec3 p, float alpha){
    float c=cos(alpha), s=sin(alpha);
    p.xy = mat2(c,-s,s,c)*p.xy; 
}

void rotY(inout vec3 p, float alpha){
  float c=cos(alpha), s=sin(alpha);
  p.xz = mat2(c,-s,s,c)*p.xz; 
}

float getDist(vec3 p){
  colorind=0.;
  float dp=1.;
  for(int n=0;n<MAX_ITER;++n){       
      rotX(p,rotx);
      
      p=abs(p);
      if(p.y > p.x) p.yx = p.xy;
      if(p.z > p.y) p.zy = p.yz;
      p *=scale;
      dp= dp*scale;
      rotZ(p,rotz);
      rotY(p,roty);
      p.xy -= scale-1.;
      if(p.z > .5*(scale-1.)){
           p.z -= scale-1.;
           colorind +=1.;
      }
  }
  return length(p)/dp;
}

float RayMarch(vec3 ro,vec3 rd){
  float dO=getDist(ro);
  surfDist=dO*.1;
  for(int i=0; i< MAX_STEPS; i++){
    float dist=getDist(ro+rd*dO);
    if(dist < surfDist){
      surfDist=clamp(.002*dO,MIN_DIST,0.01);
      break;
    } 
    dO += dist;
    if(dO > MAX_DIST ) return MAX_DIST;        
  }

  for(int i=0; i< MAX_STEPS; i++){
    float dS = getDist(ro+rd*dO)-surfDist*.5;
    dO += dS;
    if(dO > MAX_DIST || abs(dS) < surfDist*.5) break;        
  }
  return dO;
}
    
vec3 GetNormal(vec3 p){
	float d=getDist(p);
    vec2 e=vec2(surfDist*.5,0);
    
    vec3 n= d-vec3(
        getDist(p-e.xyy),
        getDist(p-e.yxy),
        getDist(p-e.yyx));   
	return normalize(n);
}

float shadow( in vec3 p, in vec3 lightDir, float lightDist, float sharpness )
{
    float res = 1.0;
    for( float t=2.*surfDist; t < lightDist; )
    {
        float h = getDist(p + lightDir*t);
        if( h < surfDist*.5 )
            return .2;
        res = min( res, sharpness*h/t );
        t += h;
    }
    return max(res,.2);
}

vec3 render(in vec3 ro, in vec3 rd){
    float dist=getDist(ro);
    
    float d=RayMarch(ro,rd);  
     
    vec3 p= ro+rd*d;  
    vec3 col= vec3(.5,.7,.9);
  
    float Max = min(100.*exp(-.1*fog),MAX_DIST);
    if(fog==0.) Max=MAX_DIST;

    if(d < Max){
      //light
      vec3 l=normalize(vec3(1,2,-2));
      vec3 n=GetNormal(p);
      float cosphi=dot(n,l);
      vec3 v=normalize(-l+2.*cosphi*n);
      
      //color
      float t=clamp(pow(colorind/float(MAX_ITER),1.5),0.,1.);  
      col=mix(vec3(1.0,0.55,0.0),vec3(1.),t);

      //directional and ambient light
      float amb=0.2;
      col=(amb+(1.-amb)*abs(cosphi))*col;

      //reflection
      float po=15.;
      t=pow(clamp(dot(v,-rd),0.,1.),po);
      col = (1.-t)*col+t*vec3(1.);
          
      //shadow
      t=shadow(p,l,dist,4.);
      col *=t;   
    
      //fog
      t=pow(min(d/Max,1.),.5);
      col=(1.-t)*col+t*vec3(.5,.7,.9);
    } 
    return col;
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv=fragCoord.xy/iResolution.x-.5;
    vec3 rd= normalize( uv.x*ax+uv.y*ay+az);
    vec3 col=render(ro,rd);
    
    fragColor = vec4(col,1.0);   
}

void main() {
  mainImage(gl_FragColor, gl_FragCoord.xy);
}
`;
  
  const uniforms = {
    iTime: {
      value: 0
    },
    iResolution: {
      value: new THREE.Vector3(),
    },
    az: {
      value: new THREE.Vector3(),
    },
    ay: {
      value: new THREE.Vector3(),
    },
    ax: {
      value: new THREE.Vector3(),
    },
    ro: {
      value: new THREE.Vector3(),
    },
    scale: {
      value: scale,
    },
    MAX_ITER:{
      value: maxIter,
    },
    rotx: {
      value: rotx,
    },
    rotz: {
      value: rotz,
    },
    roty: {
      value: roty,
    },
    fog: {
      value: fog,
    }
  };
  
  const material = new THREE.ShaderMaterial({
    fragmentShader,
    uniforms
  });
  scene.add(new THREE.Mesh(plane, material));

  const gui=new GUI();
  const fractalRollup = gui.addFolder('fractal');
  const environmentRollup = gui.addFolder('environment');
  const guiParams={};
  guiParams.fractal={
    stretch: 2,
    iternum: 30,
    rotx: 0,
    rotz: 0,
    roty: 0,
  };
  guiParams.environment={
    fog: 0,
  };
  fractalRollup.add(guiParams.fractal,"stretch",1,4).onChange(()=>{
    scale=guiParams.fractal.stretch;
  });
  fractalRollup.add(guiParams.fractal,"iternum",1,100).onChange(()=>{
    maxIter=guiParams.fractal.iternum;
  });
  fractalRollup.add(guiParams.fractal,"rotx",-3.141,3.141).onChange(()=>{
    rotx = guiParams.fractal.rotx;
  });
  fractalRollup.add(guiParams.fractal,"roty",-3.141,3.141).onChange(()=>{
    roty = guiParams.fractal.roty;
  });
  fractalRollup.add(guiParams.fractal,"rotz",-3.141,3.141).onChange(()=>{
    rotz=guiParams.fractal.rotz;
  });
  environmentRollup.add(guiParams.environment,"fog",0,100).onChange(()=>{
    fog=guiParams.environment.fog;
  });
  function render(time) {
    time *= .001;
    movePlayer(mov);
    resizeRendererToDisplaySize(renderer);

    const canvas = renderer.domElement;
    uniforms.iResolution.value.set(canvas.width, canvas.height, 1);
    uniforms.iTime.value = time;
    uniforms.ax.value.set(p.X.x, p.X.y, p.X.z);
    uniforms.ay.value.set(p.Y.x, p.Y.y, p.Y.z);
    uniforms.az.value.set(p.Z.x, p.Z.y, p.Z.z);
    uniforms.ro.value.set(p.x, p.y, p.z);
    uniforms.scale.value = scale;
    uniforms.rotx.value = rotx;
    uniforms.rotz.value = rotz;
    uniforms.roty.value = roty;
    uniforms.fog.value = fog;
    uniforms.MAX_ITER.value = maxIter;
    renderer.render(scene, camera);

    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}


main();