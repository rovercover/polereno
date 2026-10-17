type WaterPolygon = readonly [number, number, number, number, number, number, number, number];

// Normalized source-image coordinates, clockwise. Only water inside these edges ripples.
const waterAreas: Record<string, WaterPolygon> = {
  courtyard: [0.27, 0.48, 0.64, 0.51, 1.0, 0.74, 0.24, 1.0],
  'olive-pool': [0.10, 0.68, 0.85, 0.43, 1.0, 0.47, 0.34, 1.0],
  'coastal-pool': [0.09, 0.56, 0.61, 0.50, 0.94, 0.77, 0.33, 0.98],
  'evening-pool': [0.02, 0.68, 0.55, 0.54, 0.95, 0.94, 0.0, 1.0],
  'stone-detail': [0.48, 0.0, 1.0, 0.0, 1.0, 1.0, 0.10, 1.0],
  'garden-detail': [0.09, 0.65, 0.66, 0.59, 0.81, 0.72, 0.24, 0.77],
  'water-detail': [0.12, 0.0, 1.0, 0.0, 1.0, 1.0, 0.47, 1.0],
  interior: [0.43, 0.54, 0.69, 0.53, 0.78, 0.65, 0.37, 0.65],
};

const vertexSource = `
attribute vec2 aPosition;
varying vec2 vUv;
void main() {
  vUv = vec2(aPosition.x * 0.5 + 0.5, 0.5 - aPosition.y * 0.5);
  gl_Position = vec4(aPosition, 0.0, 1.0);
}`;

const fragmentSource = `
precision mediump float;
uniform sampler2D uImage;
uniform vec2 uResolution;
uniform vec2 uImageSize;
uniform vec2 uPosition;
uniform vec2 uWater[4];
uniform float uTime;
varying vec2 vUv;

float edge(vec2 a, vec2 b, vec2 p) {
  vec2 line = b - a;
  return (line.x * (p.y - a.y) - line.y * (p.x - a.x)) / length(line);
}

void main() {
  float aspect = uResolution.x / uResolution.y;
  float imageAspect = uImageSize.x / uImageSize.y;
  vec2 crop = aspect > imageAspect ? vec2(1.0, imageAspect / aspect) : vec2(aspect / imageAspect, 1.0);
  vec2 uv = vUv * crop + (1.0 - crop) * uPosition;

  // A slow, continuous camera move. The source edges never enter the frame.
  float zoom = 1.025 + 0.018 * sin(uTime * 0.09);
  uv = (uv - 0.5) / zoom + 0.5;
  uv.x += 0.003 * sin(uTime * 0.07);

  float distance = min(min(edge(uWater[0], uWater[1], uv), edge(uWater[1], uWater[2], uv)),
                       min(edge(uWater[2], uWater[3], uv), edge(uWater[3], uWater[0], uv)));
  float mask = smoothstep(0.0, 0.025, distance);
  float wave = sin(uv.y * 115.0 + uTime * 1.25 + sin(uv.x * 17.0 + uTime * 0.35));
  float secondary = sin(uv.y * 69.0 - uTime * 0.85 + uv.x * 22.0);
  vec2 ripple = vec2(wave * 0.0013, secondary * 0.0008) * mask;
  vec3 color = texture2D(uImage, clamp(uv + ripple, 0.0, 1.0)).rgb;
  color *= 1.0 + mask * 0.012 * wave * secondary;
  gl_FragColor = vec4(color, 1.0);
}`;

export interface WaterMotion {
  setPlaying: (playing: boolean) => void;
  updateImage: () => void;
  resize: () => void;
  dispose: () => void;
}

export function createWaterMotion(canvas: HTMLCanvasElement, image: HTMLImageElement, name: string): WaterMotion | null {
  const area = waterAreas[name];
  if (!area) return null;
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false, depth: false, stencil: false, powerPreference: 'low-power' });
  if (!gl) return null;

  const compile = (type: number, source: string) => {
    const shader = gl.createShader(type);
    if (!shader) return null;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) { gl.deleteShader(shader); return null; }
    return shader;
  };

  const vertex = compile(gl.VERTEX_SHADER, vertexSource);
  const fragment = compile(gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  const buffer = gl.createBuffer();
  const texture = gl.createTexture();
  const release = () => {
    if (texture) gl.deleteTexture(texture);
    if (buffer) gl.deleteBuffer(buffer);
    if (program) gl.deleteProgram(program);
    if (vertex) gl.deleteShader(vertex);
    if (fragment) gl.deleteShader(fragment);
  };
  if (!vertex || !fragment || !program || !buffer || !texture) { release(); return null; }
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) { release(); return null; }
  gl.useProgram(program);
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  const timeUniform = gl.getUniformLocation(program, 'uTime');
  const resolutionUniform = gl.getUniformLocation(program, 'uResolution');
  const imageSizeUniform = gl.getUniformLocation(program, 'uImageSize');
  const positionUniform = gl.getUniformLocation(program, 'uPosition');
  gl.uniform1i(gl.getUniformLocation(program, 'uImage'), 0);
  gl.uniform2fv(gl.getUniformLocation(program, 'uWater[0]'), new Float32Array(area));

  let playing = false;
  let frame = 0;
  let elapsed = 0;
  let lastFrame = 0;
  let lastDraw = 0;

  function draw() {
    gl!.uniform1f(timeUniform, elapsed / 1000);
    gl!.drawArrays(gl!.TRIANGLES, 0, 6);
  }

  function resize() {
    const bounds = canvas.getBoundingClientRect();
    // Cap the pixel budget rather than rendering full device resolution on large displays.
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5, 1600 / Math.max(bounds.width, 1));
    canvas.width = Math.max(1, Math.round(bounds.width * ratio));
    canvas.height = Math.max(1, Math.round(bounds.height * ratio));
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.uniform2f(resolutionUniform, canvas.width, canvas.height);
    const positions = getComputedStyle(image).objectPosition.split(' ');
    const coordinate = (value: string | undefined) => value?.endsWith('%') ? parseFloat(value) / 100 : 0.5;
    gl!.uniform2f(positionUniform, coordinate(positions[0]), coordinate(positions[1]));
    draw();
  }

  function updateImage() {
    gl!.bindTexture(gl!.TEXTURE_2D, texture);
    gl!.texImage2D(gl!.TEXTURE_2D, 0, gl!.RGBA, gl!.RGBA, gl!.UNSIGNED_BYTE, image);
    gl!.uniform2f(imageSizeUniform, image.naturalWidth, image.naturalHeight);
    resize();
  }

  function tick(now: number) {
    if (!playing) return;
    if (lastFrame) elapsed += Math.min(now - lastFrame, 100);
    lastFrame = now;
    // 24 frames per second gives film-like motion without a continuous 60 fps GPU load.
    if (now - lastDraw >= 1000 / 24) { draw(); lastDraw = now; }
    frame = requestAnimationFrame(tick);
  }

  try { updateImage(); } catch { release(); return null; }
  return {
    updateImage,
    resize,
    setPlaying(next) {
      if (next === playing) return;
      playing = next;
      if (playing) { lastFrame = 0; frame = requestAnimationFrame(tick); }
      else cancelAnimationFrame(frame);
    },
    dispose() { playing = false; cancelAnimationFrame(frame); release(); },
  };
}
