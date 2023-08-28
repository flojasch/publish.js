import * as THREE from "https://cdn.skypack.dev/three@0.146.0";

const scene = new THREE.Scene();
const bufferScene = new THREE.Scene();
const canvas = document.querySelector('#c');
const renderer = new THREE.WebGLRenderer({
  canvas
});
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
const geometry = new THREE.PlaneGeometry(2, 2);

const pixelRatio = window.devicePixelRatio;
let width = canvas.clientWidth  * pixelRatio | 0;
let height = canvas.clientHeight * pixelRatio | 0;
  
const resolution = new THREE.Vector3(
  width,
  height,
  pixelRatio
);
let frame=0;
let slider = document.getElementById("Betaslider");
slider.oninput = function() {
  uniforms.uBeta.value = this.value*.001;
}

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  const width  = canvas.clientWidth  * pixelRatio | 0;
  const height = canvas.clientHeight * pixelRatio | 0;
  const needResize = canvas.width !== width || canvas.height !== height;
  if (needResize) {
    renderer.setSize(width, height, false);
  }
  return needResize;
}

const fragmentShaderBuffer=`
uniform sampler2D uTexture; 
uniform vec2 uResolution;
uniform int uFrame;
uniform float uBeta;

#define BETA 0.44068679351 

uint seed = 0u;
void hash(){
    seed ^= 2747636419u;
    seed *= 2654435769u;
    seed ^= seed >> 16;
    seed *= 2654435769u;
    seed ^= seed >> 16;
    seed *= 2654435769u;
}

float noise(vec2 fragCoord, int t){
    seed = uint(fragCoord.y*uResolution.x + 
    fragCoord.x)+uint(t)*uint(uResolution.x)*uint(uResolution.y);
    hash();
    return float(seed)/4294967295.0;
}

ivec2 p(ivec2 site){
  return site%ivec2(uResolution.xy);
}

void main() {
    ivec2 site = ivec2(gl_FragCoord.xy);
    vec3 col=texelFetch(uTexture,site,0).rgb;
    
    ivec2 dx=ivec2(1,0);
    ivec2 dy=ivec2(0,1);
    
    float rand=noise(gl_FragCoord.xy,uFrame);
    
    if(uFrame == 0){ 
        if(rand<0.5)
            col = vec3(1);
        else
            col = vec3(-1);
    } else if((site.x+site.y+uFrame)%2==0){
        float sum = texelFetch(uTexture,p(site-dx),0).x
                    +texelFetch(uTexture,p(site+dx),0).x
                    +texelFetch(uTexture,p(site-dy),0).x
                    +texelFetch(uTexture,p(site+dy),0).x;
        if(rand < exp(-2.*uBeta*sum*col.r))
            col *=-1.;
    }
    gl_FragColor= vec4(col,1.0);
}
`;
const fragmentShaderScreen=`
uniform sampler2D uTexture; 

void main() {
    ivec2 site= ivec2(gl_FragCoord.xy);
    vec3 color = texelFetch(uTexture, site,0).rgb;
    gl_FragColor = vec4(0.5*color+.5, 1.0);
}
`;
let bufferA = new THREE.WebGLRenderTarget(
  width,
  height,
   {
    minFilter: THREE.NearestFilter,
    magFilter: THREE.NearestFilter,
    format: THREE.RGBAFormat,
    type: THREE.FloatType,
    stencilBuffer: false
  }
);
let bufferB = bufferA.clone();

const uniforms={
  uTexture: {
    value: null
  },
  uResolution: {
    value: resolution
  },
  uFrame: {
    value: frame
  },
  uBeta: {
    value: 0.44068679351
  },
};
const bufferMaterial = new THREE.ShaderMaterial({
  uniforms,
  fragmentShader: fragmentShaderBuffer,
});

const screenMaterial = new THREE.ShaderMaterial({
  uniforms,
  fragmentShader: fragmentShaderScreen,
});

const screenMesh = new THREE.Mesh(geometry, screenMaterial);
const bufferMesh = new THREE.Mesh(geometry, bufferMaterial);
bufferScene.add(bufferMesh);
scene.add(screenMesh);

function render(time){
  frame +=1;
  if(resizeRendererToDisplaySize(renderer)){
    width = canvas.clientWidth  * pixelRatio | 0;
    height = canvas.clientHeight * pixelRatio | 0;
  }
  
  renderer.setRenderTarget(bufferA)
  renderer.render(bufferScene, camera)

  renderer.setRenderTarget(null);
  renderer.render(scene, camera);

  const temp = bufferB;
  bufferB = bufferA;
  bufferA = temp;
  uniforms.uTexture.value = bufferB.texture;
  uniforms.uFrame.value = frame;
  requestAnimationFrame(render);
}
requestAnimationFrame(render);
