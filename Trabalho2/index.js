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
const blueCubeColor = gl.getUniformLocation(program, 'u_blueCubeColor');

gl.uniform3f(sphereColor, 1.0, 0.0, 0.0);
gl.uniform3f(blueCubeColor, 0.0, 1.0, 10);

const u_y = gl.getUniformLocation(program, 'u_y');
const u_x = gl.getUniformLocation(program, 'u_x');

const u_xPlataform = gl.getUniformLocation(program, 'u_xPlataform');

const u_yblueCube = gl.getUniformLocation(program, 'u_yblueCube');
const u_xblueCube =  gl.getUniformLocation(program, 'u_xblueCube');

const u_yRing = gl.getUniformLocation(program, 'u_yRing');
const u_xRing =  gl.getUniformLocation(program, 'u_xRing');

function fract(x) {
    return x - Math.floor(x);
}

var jumping = false;
var left = false;
var right = false;
var increment = false;

const timeUniformLocation = gl.getUniformLocation(program, 'u_time');
const random = gl.getUniformLocation(program, 'u_random');
var time = 0;
var time_jump = 0;
var move = 0;
var vel = 0.2;
var time = 0;
var outplataformY = 0;
var blueCubeDownY = 7.0;
var ringMoveX = -2.0;
var sum = 0;
const countElement = document.querySelector(".count");

document.addEventListener("keydown", function (event) {
    //console.log(event.key)
    if (event.key === ' ' && gl.getUniform(program, u_y) >= 0.0) { // Tecla espaço
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
    // se o obstaculo cair para baixo da tela ele é colocado para cima
    if(blueCubeDownY < -12){
        blueCubeDownY = 7.0;
        gl.uniform1f(u_xblueCube,  Math.floor(Math.random() * 9) - 1);
    }

    if(ringMoveX >= 7){
        ringMoveX = -2;
        gl.uniform1f(u_yRing,  Math.min(Math.floor(Math.random() * 6), 5));
    }


    // condições para a plataforma andar para os lados
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

    gl.uniform3f(cubeColor, time, 1.0, 1.0);

    time_jump += 0.015;

    gl.uniform1f(u_xPlataform, time);

    // movimentação do teclado
    if(left){
        move -= 0.1;
        gl.uniform1f(u_x, move);
    }else if(right){
        move += 0.1;
        gl.uniform1f(u_x, move);
    }

    // cálculo da altura do pulo
    if (jumping) {
        gl.uniform1f(u_y, -10.0 * fract(time_jump*3) * (fract(time_jump*3) - 1.0) );
    }

    // cálculo para fazer a esfera cair caso sair da plataforma
    if(gl.getUniform(program, u_x) > (gl.getUniform(program, u_xPlataform) + 2.0) || gl.getUniform(program, u_y) < 0){
       gl.uniform1f(u_y, gl.getUniform(program, u_y) - 0.1);
    }else if(gl.getUniform(program, u_x) < (gl.getUniform(program, u_xPlataform) -2.0) || gl.getUniform(program, u_y) < 0){
        gl.uniform1f(u_y, gl.getUniform(program, u_y) - 0.1);
    }

    // para fazer parar de pular
    if (gl.getUniform(program, u_y) < 0.1) {
        jumping = false
    }

    gl.uniform1f(timeUniformLocation, time);

    // se caiu p fora de tela reseta o contador e move o obj para 
    //cima da plataforma
    if (gl.getUniform(program, u_y) < -8) {
        lostGame();
    }

    if( checkHit(u_xblueCube, u_yblueCube) ){
        // se acertou o OBJ ele volta para cima o Y e randomiza o X
        blueCubeDownY = 7.0;
        gl.uniform1f(u_xblueCube,  Math.floor(Math.random() * 9) - 1);
        countElement.innerHTML = sum;
    }else{
        // se não acertou o OBJ só desce ele para baixo
        blueCubeDownY -= 0.1; 
        gl.uniform1f(u_yblueCube, blueCubeDownY);
    }


    if( checkHit(u_xRing, u_yRing) ){
        // se acertou o OBJ ele volta para o canto da tela o X e randomiza o Y
        ringMoveX = -2.0;
        gl.uniform1f(u_yRing,  Math.floor(Math.random() * 9) - 1);
        lostGame();
    }else{
        // se não acertou o OBJ só desce ele para baixo
        ringMoveX += 0.05; 
        gl.uniform1f(u_xRing, ringMoveX);
    }


    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    requestAnimationFrame(render);
}

function checkHit(objX, objY){

    //console.log((gl.getUniform(program, u_y)-6.0), gl.getUniform(program, objY),(gl.getUniform(program, u_y)-6.5))
    //cálculos da hitbox do círculo
    //console.log('x','[', (gl.getUniform(program, u_x)-0.999),gl.getUniform(program, objX),(gl.getUniform(program, u_x)+0.999),']')
    //console.log('y','[', (gl.getUniform(program, u_y)-6.6999),gl.getUniform(program, objY),(gl.getUniform(program, u_y)+6.6999),']')
    //console.log(gl.getUniform(program, objX), gl.getUniform(program, objY))

    if( hitOBJ(gl.getUniform(program, objY), (gl.getUniform(program, u_y) - 7.0), 0.699)
    && hitOBJ(gl.getUniform(program, objX), gl.getUniform(program, u_x), 0.7) ){
        console.log('bingo!!!!')
        sum += 1;
        return true;
    }
    return false;
}

function hitOBJ(limA, limB, ray) {
    //console.log('[',limA, limB, ray,']')
    //return Math.abs(limA - limB) <= ray;
    //console.log('-------------------------------')
    //console.log('[', limB-ray,limA, limB+ray,']')
    if(limA < limB+ray && limA > limB-ray) {
        return true;
    }
}

function lostGame(){
    left = false;
    right = false;
    jumping = false;
    move = gl.getUniform(program, u_xPlataform);
    gl.uniform1f(u_y, 0.0);    
    sum = 0;
    countElement.innerHTML = sum;
    gl.uniform1f(u_x, gl.getUniform(program, u_xPlataform) );
}

requestAnimationFrame(render);