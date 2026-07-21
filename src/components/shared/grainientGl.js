/**
 * Grainient WebGL helpers — port of H5 `Grainient.jsx` (ogl + WebGL2)
 * for WeChat mini-program `canvas type="webgl"` (WebGL1 / GLSL ES 1.00).
 */

export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (!result) return [1, 1, 1]
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ]
}

const VERTEX = `
attribute vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`

const FRAGMENT = `
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;

#define S(a,b,t) smoothstep(a,b,t)

mat2 Rot(float a){
  float s=sin(a),c=cos(a);
  return mat2(c,-s,s,c);
}

vec2 hash(vec2 p){
  p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));
  return fract(sin(p)*43758.5453);
}

float noise(vec2 p){
  vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);
  float n=mix(
    mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),
        dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),
    mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),
        dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),
    u.y);
  return 0.5+0.5*n;
}

void main(){
  float t=iTime*uTimeSpeed;
  vec2 C=gl_FragCoord.xy;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);

  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;

  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);

  vec3 colLav=uColor1;
  vec3 colOrg=uColor2;
  vec3 colDark=uColor3;
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));

  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;

  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);

  gl_FragColor=vec4(col,1.0);
}
`

function compileShader(gl, type, source) {
  const shader = gl.createShader(type)
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader)
    gl.deleteShader(shader)
    throw new Error(log || 'shader compile failed')
  }
  return shader
}

/**
 * @param {WebGLRenderingContext} gl
 * @returns {{ program: WebGLProgram, uniforms: Record<string, WebGLUniformLocation|null>, setSize: (w:number,h:number)=>void, draw: (timeSec:number)=>void, destroy: ()=>void }}
 */
export function createGrainientRenderer(gl) {
  const vs = compileShader(gl, gl.VERTEX_SHADER, VERTEX)
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAGMENT)
  const program = gl.createProgram()
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || 'program link failed')
  }
  gl.deleteShader(vs)
  gl.deleteShader(fs)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  // Fullscreen triangle
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)

  const positionLoc = gl.getAttribLocation(program, 'position')
  const uniformNames = [
    'iResolution',
    'iTime',
    'uTimeSpeed',
    'uColorBalance',
    'uWarpStrength',
    'uWarpFrequency',
    'uWarpSpeed',
    'uWarpAmplitude',
    'uBlendAngle',
    'uBlendSoftness',
    'uRotationAmount',
    'uNoiseScale',
    'uGrainAmount',
    'uGrainScale',
    'uGrainAnimated',
    'uContrast',
    'uGamma',
    'uSaturation',
    'uCenterOffset',
    'uZoom',
    'uColor1',
    'uColor2',
    'uColor3',
  ]
  /** @type {Record<string, WebGLUniformLocation|null>} */
  const uniforms = {}
  for (const name of uniformNames) {
    uniforms[name] = gl.getUniformLocation(program, name)
  }

  let width = 1
  let height = 1

  const setSize = (w, h) => {
    width = Math.max(1, Math.floor(w))
    height = Math.max(1, Math.floor(h))
    gl.viewport(0, 0, width, height)
  }

  /** @param {Record<string, any>} props */
  const applyProps = (props) => {
    gl.useProgram(program)
    gl.uniform1f(uniforms.uTimeSpeed, props.timeSpeed)
    gl.uniform1f(uniforms.uColorBalance, props.colorBalance)
    gl.uniform1f(uniforms.uWarpStrength, props.warpStrength)
    gl.uniform1f(uniforms.uWarpFrequency, props.warpFrequency)
    gl.uniform1f(uniforms.uWarpSpeed, props.warpSpeed)
    gl.uniform1f(uniforms.uWarpAmplitude, props.warpAmplitude)
    gl.uniform1f(uniforms.uBlendAngle, props.blendAngle)
    gl.uniform1f(uniforms.uBlendSoftness, props.blendSoftness)
    gl.uniform1f(uniforms.uRotationAmount, props.rotationAmount)
    gl.uniform1f(uniforms.uNoiseScale, props.noiseScale)
    gl.uniform1f(uniforms.uGrainAmount, props.grainAmount)
    gl.uniform1f(uniforms.uGrainScale, props.grainScale)
    gl.uniform1f(uniforms.uGrainAnimated, props.grainAnimated ? 1 : 0)
    gl.uniform1f(uniforms.uContrast, props.contrast)
    gl.uniform1f(uniforms.uGamma, props.gamma)
    gl.uniform1f(uniforms.uSaturation, props.saturation)
    gl.uniform2f(uniforms.uCenterOffset, props.centerX, props.centerY)
    gl.uniform1f(uniforms.uZoom, props.zoom)
    const c1 = hexToRgb(props.color1)
    const c2 = hexToRgb(props.color2)
    const c3 = hexToRgb(props.color3)
    gl.uniform3f(uniforms.uColor1, c1[0], c1[1], c1[2])
    gl.uniform3f(uniforms.uColor2, c2[0], c2[1], c2[2])
    gl.uniform3f(uniforms.uColor3, c3[0], c3[1], c3[2])
  }

  const draw = (timeSec) => {
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.enableVertexAttribArray(positionLoc)
    gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)
    gl.uniform2f(uniforms.iResolution, width, height)
    gl.uniform1f(uniforms.iTime, timeSec)
    gl.drawArrays(gl.TRIANGLES, 0, 3)
  }

  const destroy = () => {
    gl.deleteBuffer(buffer)
    gl.deleteProgram(program)
  }

  return { program, uniforms, setSize, applyProps, draw, destroy }
}
