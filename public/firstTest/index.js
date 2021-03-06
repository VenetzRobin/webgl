const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if(!gl) {
    throw new Error('WebGL not supported');
}


const vertexData = [
    //front
    .5, .5, .5,
    .5, -.5, .5,
    -.5, .5, .5,
    -.5, .5, .5,
    .5, -.5, .5,
    -.5, -.5, .5,

    //left
    -.5, .5, .5,
    -.5, -.5, .5,
    -.5, .5, -.5,
    -.5, .5, -.5,
    -.5, -.5, .5,
    -.5, -.5, -.5,

    //back
    -.5, .5, -.5,
    -.5, -.5, -.5,
    .5, .5, -.5,
    .5, .5, -.5,
    -.5, -.5, -.5,
    .5, -.5, -.5,

    //right
    .5, .5, -.5,
    .5, -.5, -.5,
    .5, .5, .5,
    .5, .5, .5,
    .5, -.5, .5,
    .5, -.5, -.5,

    //top
    .5, .5, .5,
    .5, .5, -.5,
    -.5, .5, .5,
    -.5, .5, .5,
    .5, .5, -.5,
    -.5, .5, -.5,

    //bottom
    .5, -.5, .5,
    .5, -.5, -.5,
    -.5, -.5, .5,
    -.5, -.5, .5,
    .5, -.5, -.5,
    -.5, -.5, -.5
];

//const colorData = [
//1, 0, 0,    //v1.color
//    0, 1, 0,    //v2.color
//    0, 0, 1     //v3.color
//];

//let colorData = [
//    ...randomColor(),
//    ...randomColor(),
//    ...randomColor()
//];

let colorData = [];
for(let face = 0; face < 6; face++) {
    let faceColor = randomColor();
    for(let vertex = 0; vertex < 6; vertex++) {
        colorData.push(...faceColor);
    }
}

function randomColor() {
    return [Math.random(), Math.random(), Math.random()];
}

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;

varying vec3 vColor;

uniform mat4 matrix;

void main() {
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;
varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1);
}
`);

gl.compileShader(fragmentShader);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
    matrix: gl.getUniformLocation(program, `matrix`)
};

const matrix = glMatrix.mat4.create();
glMatrix.mat4.translate(matrix, matrix, [.2, .5, 0]);
glMatrix.mat4.scale(matrix, matrix, [.25, .25, .25]);

function animate() {
    requestAnimationFrame(animate);
    
    glMatrix.mat4.rotateZ(matrix, matrix, Math.PI / 2 / 120); 
    glMatrix.mat4.rotateX(matrix, matrix, Math.PI / 2 / 190); 
    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}

canvas.addEventListener('click', function(e) {
    glMatrix.mat4.translate(matrix, matrix, [-.2, 0, 0]);
    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
});

animate();