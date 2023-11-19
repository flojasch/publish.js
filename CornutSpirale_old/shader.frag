#ifdef GL_ES
precision highp float;
#endif
#define TWO_PI 6.28
#define arrownum 500

uniform vec2 u_resolution;
uniform float lambda;
uniform float breite;
uniform vec2 mouse;

float line( vec2 p, vec2 a, vec2 b)
{
  vec2 pa = p - a, ba = b - a;
  float h = clamp( dot(pa,ba)/dot(ba,ba), 0.0, 1.0 );
  return length( pa - ba*h );
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  float d = breite / float(arrownum);
  float x = 0.;
  float y = 0.;
  for(int k = 0; k < arrownum; ++k) {
    vec2 z = uv - vec2(d * float(k) + (1. - breite) / 2.,1.);
    float alpha = length(z) / lambda * TWO_PI;
    x += cos(alpha);
    y += sin(alpha);
  }
  float value = 2.*sqrt(x * x + y * y)/float(arrownum);
  value=clamp(value,0.,1.);
  vec3 color = vec3(value, 0, 0);
  
  vec2 p=vec2(0);
  float R=1./float(arrownum);
  for (int k = 0; k < arrownum; k++) {
    vec2 z = mouse - vec2(d * float(k) + (1. - breite) / 2.,1.);
    float alpha = length(z) / lambda * TWO_PI;
    vec2 dz=R * vec2(cos(alpha),sin(alpha));
    p += dz;
  }
  float beta=acos(p.x/length(p));
  if (p.y < 0.) beta=TWO_PI-beta;
  p=vec2(length(p),0);
  if(line(uv,mouse-p/2.,mouse+p/2.) < .5/u_resolution.x) 
      color=vec3(1,0,0);
  p =mouse-p/2.;
  for (int k = 0; k < arrownum; k++) {
    vec2 z = mouse - vec2(d * float(k) + (1. - breite) / 2.,1.);
    float alpha = length(z) / lambda * TWO_PI-beta;
    vec2 dz=R * vec2(cos(alpha),sin(alpha));
    if(line(uv,p,p+dz) < .5/u_resolution.x) 
      color=vec3(1);
    p += dz;
  }
  
  gl_FragColor = vec4(color, 1.0);
}
