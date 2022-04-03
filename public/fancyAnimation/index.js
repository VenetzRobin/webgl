const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if(!gl) {
    throw new Error('WebGL not supported');
}

const width = canvas.clientWidth;
const height = canvas.clientHeight;

function randomColor() {
    return [Math.random(), Math.random(), Math.random()];
}

let points = [];
let colors = [];
for(let x = 0; x <= width; x = x + 20) {
    for(let y = 0; y <= height; y = y + 20) {
        points.push(...[1 * x / width, 1 * y / height, 1]);
        colors.push(...randomColor());
    }
}

points.push(0, .9, 1);
colors.push(1, 0, 0);

const pointBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;

void main() {
    gl_Position = vec4(position, 1);
    gl_PointSize = 5.0;
    vColor = color;
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;

varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor,  1);
}
`);

gl.compileShader(fragmentShader);
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const locations = {
    position: gl.getAttribLocation(program, 'position'),
    color: gl.getAttribLocation(program, 'color')
};

gl.enableVertexAttribArray(locations.position);
gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
gl.vertexAttribPointer(locations.position, 3, gl.FLOAT, false, 0, 0);

gl.enableVertexAttribArray(locations.color);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(locations.color, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
//gl.enable(gl.DEPTH_TEST);

gl.drawArrays(gl.POINTS, 0, points.length / 3);