const canvas = document.getElementById('canvas');
const gl = canvas.getContext('webgl2');

const vertexShaderSource = document.getElementById('vertexShader').text;
const fragmentShaderSource = document.getElementById('fragmentShader').text;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

const devicePixelRatio = window.devicePixelRatio || 1;
canvas.width = canvas.clientWidth * devicePixelRatio;
canvas.height = canvas.clientHeight * devicePixelRatio;
gl.viewport(0, 0, canvas.width, canvas.height);

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);

const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
const positions = [
    -1.0, -1.0, 0.0,
    1.0, -1.0, 0.0,
    -1.0, 1.0, 0.0,
    1.0, 1.0, 0.0,
];
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionAttributeLocation);
gl.vertexAttribPointer(positionAttributeLocation, 3, gl.FLOAT, false, 0, 0);

const resolutionUniformLocation = gl.getUniformLocation(program, 'u_resolution');
gl.uniform2f(resolutionUniformLocation, canvas.width, canvas.height);


const sphereColor = gl.getUniformLocation(program, 'u_sphereColor');
const cubeColor = gl.getUniformLocation(program, 'u_cubeColor');

gl.uniform3f(sphereColor, 1.0, 0.0, 0.0); // vermelho
gl.uniform3f(cubeColor, 0.0, 0.0, 1.0); // azul

const u_y = gl.getUniformLocation(program, 'u_y');
const u_x = gl.getUniformLocation(program, 'u_x');
const u_xPlataform = gl.getUniformLocation(program, 'u_xPlataform');

function fract(x) {
    return x - Math.floor(x);
}

var jumping = false;
var left = false;
var right = false;
var increment = false;

const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
const random = gl.getUniformLocation(program, 'u_random');
var time = 0
var time_jump = 0
var move = 0
var vel = 0.2
var time = 0
var outplataformY = 0

document.addEventListener("keydown", function (event) {
    //console.log(event.key)
    if (event.key === ' ') { // Tecla espaço
        if (!jumping)
            time_jump = 0
        jumping = true
    }else if (event.key === 'a') {
        if (!left)
            //move = 0
        left = true
        right = false
    }else if (event.key === 'd') { 
        if (!right)
            //move = 0
        right = true
        left = false
    }
});

document.addEventListener("keyup", function (event) {
    //console.log(event.key)
    if (event.key === 'a' || event.key === 'd') {
        right = false
        left = false
    }
});



function render() {
    if (increment) {
        time += 0.01;
    if (time >= 7) {
        increment = false;
    }
    } else {
    time -= 0.01;
    if (time <= -1) {
        increment = true;
      }
    }

    time_jump += 0.015;
    
    gl.uniform1f(u_xPlataform, time);

    if(left){
        move -= 0.1;
    }else if(right){
        move += 0.1;
    }
    gl.uniform1f(u_x, move);
    
    let y = -10.0 * fract(time_jump*3) * (fract(time_jump*3) - 1.0);


    //console.log('move:' + move)
    //console.log('time:' + time)
    if (jumping) {
        gl.uniform1f(u_y, y);
    }
    
    
    if(move > time + 2.2 || outplataformY < 0){
        outplataformY = outplataformY - 0.1;
        gl.uniform1f(u_y, outplataformY);
        //console.log(move)
        //console.log(time)
        //console.log('tá fora pela direita')
    }else if(move < time -2.2 || outplataformY < 0){
        //console.log('tá fora pela esq')
        outplataformY = outplataformY - 0.1;
        gl.uniform1f(u_y, outplataformY);
    }
    
    if (y <= 0.1) {
        jumping = false
    }

    gl.uniform1f(timeUniformLocation, time);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);