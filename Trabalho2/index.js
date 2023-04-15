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
const u_yObstacle = gl.getUniformLocation(program, 'u_yObstacle');
const u_xObstacle =  gl.getUniformLocation(program, 'u_xObstacle');

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
var obstacleDownY = 7.0;

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
    obstacleDownY -= 0.1; 

    gl.uniform1f(u_yObstacle, obstacleDownY);
    gl.uniform1f(u_xPlataform, time);

    if(obstacleDownY < -10.6){
        obstacleDownY = 7.0;
    }

    // movimentação do teclado
    if(left){
        move -= 0.1;
    }else if(right){
        move += 0.1;
    }
    gl.uniform1f(u_x, move);

    // cálculo da altura do pulo
    let y = -10.0 * fract(time_jump*3) * (fract(time_jump*3) - 1.0);

    if (jumping) {
        gl.uniform1f(u_y, y);
    }

    // cálculo para fazer a esfera cair caso sair da plataforma
    if(move > time + 2.2 || outplataformY < 0){
        outplataformY = outplataformY - 0.1;
        gl.uniform1f(u_y, outplataformY);
        //console.log('tá fora pela direita')
    }else if(move < time -2.2 || outplataformY < 0){
        //console.log('tá fora pela esq')
        outplataformY = outplataformY - 0.1;
        gl.uniform1f(u_y, outplataformY);
    }
    
    if (y <= 0.1) {
        jumping = false
    }

     //console.log(gl.getUniform(program, u_yObstacle))
    //console.log(gl.getUniform(program, u_y)-6.5)
    if( gl.getUniform(program, u_yObstacle) > (gl.getUniform(program, u_y)-6.7) && gl.getUniform(program, u_yObstacle) < (gl.getUniform(program, u_y)-6.5) )
        console.log('encostou');

    gl.uniform1f(timeUniformLocation, time);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(render);
}

requestAnimationFrame(render);