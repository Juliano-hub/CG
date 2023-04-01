// WebGL2 - Textures - Texture Atlas
// from https://webgl2fundamentals.org/webgl/webgl-3d-textures-texture-atlas.html


"use strict";

var vertexShaderSource = `#version 300 es
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec2 a_texcoord;

// A matrix to transform the positions by
uniform mat4 u_matrix;

// The amount of translation to apply to the position
uniform vec3 u_translation;

// a varying to pass the texture coordinates to the fragment shader
out vec2 v_texcoord;

// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position + vec4(u_translation, 0.0);

  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
`;

var fragmentShaderSource = `#version 300 es

precision highp float;

// Passed in from the vertex shader.
in vec2 v_texcoord;

// The texture.
uniform sampler2D u_texture;
// we need to declare an output for the fragment shader
out vec4 outColor;

void main() {
  outColor = texture(u_texture, v_texcoord);
}
`;

function mainTexture(canvasNUM = "#canvas2") {
  const image = new Image();
  image.src = "obj/TNT_Block.png";
  const image2 = new Image();
  image2.src = "obj/Exodius.png";

  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector(canvasNUM);

  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  var texture2 = gl.createTexture();
  var texture = gl.createTexture();

  // Use our boilerplate utils to compile the shaders and link into a program
  var program = webglUtils.createProgramFromSources(gl,
      [vertexShaderSource, fragmentShaderSource]);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");
  var translationLocation = gl.getUniformLocation(program, "u_translation");
  var translation = []

  if(canvasNUM === "#canvas3"){
    translation = [0.8, -numShopT, 1];
  }else{
    translation = [0.0, 0.0, 0.0];
  }

  // look up uniform locations
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");
  // Create a vertex array object (attribute state)
  var vao = gl.createVertexArray();
  vaoArray.push(vao);

  // and make it the one we're currently working with
  gl.bindVertexArray(vaoArray[(numShopT+2)]);

  // Create a buffer
  var positionBuffer = gl.createBuffer();
  positionBufferVector.push(positionBuffer);
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferVector[(numShopT+2)]);
  //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Set Geometry.
  setGeometry(gl);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

    gl.activeTexture(gl.TEXTURE1);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    image2.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture2);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);
      gl.generateMipmap(gl.TEXTURE_2D);
    });

    // Asynchronously load an image
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    image.addEventListener('load', function() {
      // Now that the image has loaded make copy it to the texture.
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
    });

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3;          // 3 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

  // create the texcoord buffer, make it the current ARRAY_BUFFER
  // and copy in the texcoord values
  var texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  setTexcoords(gl);

  // Turn on the attribute
  gl.enableVertexAttribArray(texcoordAttributeLocation);

  // Tell the attribute how to get data out of texcoordBuffer (ARRAY_BUFFER)
  var size = 2;          // 2 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floating point values
  var normalize = true;  // convert from 0-255 to 0.0-1.0
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next color
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      texcoordAttributeLocation, size, type, normalize, stride, offset);

  if(canvasNUM === "#canvas3"){
    if(textureValue == true){
      textureList.push(texture);
    }else{
      textureList.push(texture2);
    }
  }

  // Fill the texture with a 1x1 blue pixel.
  //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
  //              new Uint8Array([0, 0, 255, 255]));
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var fieldOfViewRadians = degToRad(60);
  var modelXRotationRadians = degToRad(0);
  var modelYRotationRadians = degToRad(0);

  if(canvasNUM === "#canvas3")
    fieldOfViewRadians = degToRad(120);
    modelYRotationRadians = degToRad(-5);

  var zNear = 1;
  var zFar = 3;

  var cameraPosition = [0, 0, 2];
  var up = [0, 1, 0];
  var target = [0, 0, 0];

  var params = {
    gui: gui,
    x: modelXRotationRadians,
    y: modelYRotationRadians,
    fieldOfViewRadians: fieldOfViewRadians,
    Near: zNear,
    Far: zFar,
  }
  if(canvasNUM === "#canvas2")
    loadGUI(params);

  var numObjectsInCanvas3 = 0;

  function render() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // turn on depth testing
    gl.enable(gl.DEPTH_TEST);

    // tell webgl to cull faces
    gl.enable(gl.CULL_FACE);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);
    

    // Compute the matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    var projectionMatrix = m4.perspective(params.fieldOfViewRadians, aspect, zNear, zFar);

    // Compute the camera's matrix using look at.
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    var matrix = m4.xRotate(viewProjectionMatrix, params.x);
    matrix = m4.yRotate(matrix, params.y);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6 * 6;

    if (canvasNUM == '#canvas2') {
      if (textureValue == true) {
        //gl.activeTexture(gl.TEXTURE0);
        //texture3 = texture;
        gl.bindTexture(gl.TEXTURE_2D, texture);
        //console.log(gl.getParameter(gl.ACTIVE_TEXTURE))
      } else {
        //gl.activeTexture(gl.TEXTURE1);
        //texture3 = texture2;
        gl.bindTexture(gl.TEXTURE_2D, texture2);
        //console.log(gl.getParameter(gl.ACTIVE_TEXTURE))
      }
    }

    /*
    if (canvasNUM == '#canvas3') {
      console.log('comeco loop----------------------')
        if (numObjectsInCanvas3 < textureList.length) {
          console.log('Atual:' + numObjectsInCanvas3)
          gl.bindTexture(gl.TEXTURE_2D, textureList[numObjectsInCanvas3]);
          numObjectsInCanvas3++;
        } else if (numObjectsInCanvas3 == textureList.length){
          numObjectsInCanvas3 = 0;
        }
    }
    */
    /*
    if (canvasNUM == '#canvas3') {
        if (numObjectsInCanvas3 === textureList.length) {
          
          //gl.bindTexture(gl.TEXTURE_2D, textureList[numObjectsInCanvas3-1]);

        } else if (numObjectsInCanvas3 > textureList.length){
          numObjectsInCanvas3 = 0;
        } else if(numObjectsInCanvas3 < textureList.length){
          numObjectsInCanvas3++;
        }
    }
    */

    gl.drawArrays(primitiveType, offset, count);

    gl.uniform3f(translationLocation, translation[0], translation[1], translation[2]);

    // Call render again next frame
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

// Fill the current ARRAY_BUFFER buffer
// with the positions that define a cube.
function setGeometry(gl) {
  var positions = new Float32Array(
    [
    -0.5, -0.5,  -0.5,
    -0.5,  0.5,  -0.5,
     0.5, -0.5,  -0.5,
    -0.5,  0.5,  -0.5,
     0.5,  0.5,  -0.5,
     0.5, -0.5,  -0.5,

    -0.5, -0.5,   0.5,
     0.5, -0.5,   0.5,
    -0.5,  0.5,   0.5,
    -0.5,  0.5,   0.5,
     0.5, -0.5,   0.5,
     0.5,  0.5,   0.5,

    -0.5,   0.5, -0.5,
    -0.5,   0.5,  0.5,
     0.5,   0.5, -0.5,
    -0.5,   0.5,  0.5,
     0.5,   0.5,  0.5,
     0.5,   0.5, -0.5,

    -0.5,  -0.5, -0.5,
     0.5,  -0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,  -0.5,  0.5,
     0.5,  -0.5, -0.5,
     0.5,  -0.5,  0.5,

    -0.5,  -0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,   0.5, -0.5,
    -0.5,  -0.5,  0.5,
    -0.5,   0.5,  0.5,
    -0.5,   0.5, -0.5,

     0.5,  -0.5, -0.5,
     0.5,   0.5, -0.5,
     0.5,  -0.5,  0.5,
     0.5,  -0.5,  0.5,
     0.5,   0.5, -0.5,
     0.5,   0.5,  0.5,

    ]);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

// Fill the current ARRAY_BUFFER buffer
// with texture coordinates for a cube.
function setTexcoords(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(
        [
        // select the top left image
        0   , 0  ,
        0   , 0.5,
        0.25, 0  ,
        0   , 0.5,
        0.25, 0.5,
        0.25, 0  ,
        // select the top middle image
        0.25, 0  ,
        0.5 , 0  ,
        0.25, 0.5,
        0.25, 0.5,
        0.5 , 0  ,
        0.5 , 0.5,
        // select to top right image
        0.5 , 0  ,
        0.5 , 0.5,
        0.75, 0  ,
        0.5 , 0.5,
        0.75, 0.5,
        0.75, 0  ,
        // select the bottom left image
        0   , 0.5,
        0.25, 0.5,
        0   , 1  ,
        0   , 1  ,
        0.25, 0.5,
        0.25, 1  ,
        // select the bottom middle image
        0.25, 0.5,
        0.25, 1  ,
        0.5 , 0.5,
        0.25, 1  ,
        0.5 , 1  ,
        0.5 , 0.5,
        // select the bottom right image
        0.5 , 0.5,
        0.75, 0.5,
        0.5 , 1  ,
        0.5 , 1  ,
        0.75, 0.5,
        0.75, 1  ,

      ]),
      gl.STATIC_DRAW);
}

var gui = new dat.GUI();
var numShopT = -2;
var textureValue = true;
var textureList = [];
var activateList = [];
var vaoArray = [];
var positionBufferVector = [];

function buyTexture() {
  numShopT += 1;
  if(textureValue == true){
    mainTexture2();
  }else{
    mainTexture3();
  }
}

function mainTexture3(canvasNUM = "#canvas3") {
  const image = new Image();
  image.src = "obj/Exodius.png";

  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector(canvasNUM);

  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  var texture = gl.createTexture();

  // Use our boilerplate utils to compile the shaders and link into a program
  var program = webglUtils.createProgramFromSources(gl,
      [vertexShaderSource, fragmentShaderSource]);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");
  var translationLocation = gl.getUniformLocation(program, "u_translation");
  var translation = [0.8, -numShopT, 1];

  // look up uniform locations
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");
  // Create a vertex array object (attribute state)
  var vao = gl.createVertexArray();
  vaoArray.push(vao);

  // and make it the one we're currently working with
  gl.bindVertexArray(vaoArray[(numShopT+2)]);

  // Create a buffer
  var positionBuffer = gl.createBuffer();
  positionBufferVector.push(positionBuffer);
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferVector[(numShopT+2)]);
  //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Set Geometry.
  setGeometry(gl);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Asynchronously load an image
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  image.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
  });

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3;          // 3 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

  // create the texcoord buffer, make it the current ARRAY_BUFFER
  // and copy in the texcoord values
  var texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  setTexcoords(gl);

  // Turn on the attribute
  gl.enableVertexAttribArray(texcoordAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  textureList.push(texture);

  // Fill the texture with a 1x1 blue pixel.
  //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
  //              new Uint8Array([0, 0, 255, 255]));
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var fieldOfViewRadians = degToRad(120);
  var modelXRotationRadians = degToRad(0);
  var modelYRotationRadians = degToRad(-5);

  var zNear = 1;
  var zFar = 3;

  var cameraPosition = [0, 0, 2];
  var up = [0, 1, 0];
  var target = [0, 0, 0];

  function render() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // turn on depth testing
    gl.enable(gl.DEPTH_TEST);

    // tell webgl to cull faces
    gl.enable(gl.CULL_FACE);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);
    

    // Compute the matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    // Compute the camera's matrix using look at.
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    var matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);
    matrix = m4.yRotate(matrix, modelYRotationRadians);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6 * 6;

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.drawArrays(primitiveType, offset, count);

    gl.uniform3f(translationLocation, translation[0], translation[1], translation[2]);

    // Call render again next frame
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

function mainTexture2(canvasNUM = "#canvas3") {
  const image = new Image();
  image.src = "obj/TNT_Block.png";

  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector(canvasNUM);

  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  var texture = gl.createTexture();

  // Use our boilerplate utils to compile the shaders and link into a program
  var program = webglUtils.createProgramFromSources(gl,
      [vertexShaderSource, fragmentShaderSource]);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");
  var translationLocation = gl.getUniformLocation(program, "u_translation");
  var translation = [0.8, -numShopT, 1];

  // look up uniform locations
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");
  // Create a vertex array object (attribute state)
  var vao = gl.createVertexArray();
  vaoArray.push(vao);

  // and make it the one we're currently working with
  gl.bindVertexArray(vaoArray[(numShopT+2)]);

  // Create a buffer
  var positionBuffer = gl.createBuffer();
  positionBufferVector.push(positionBuffer);
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferVector[(numShopT+2)]);
  //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Set Geometry.
  setGeometry(gl);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Asynchronously load an image
  gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  image.addEventListener('load', function() {
    // Now that the image has loaded make copy it to the texture.
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.generateMipmap(gl.TEXTURE_2D);
  });

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 3;          // 3 components per iteration
  var type = gl.FLOAT;   // the data is 32bit floats
  var normalize = false; // don't normalize the data
  var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
  var offset = 0;        // start at the beginning of the buffer
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

  // create the texcoord buffer, make it the current ARRAY_BUFFER
  // and copy in the texcoord values
  var texcoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  setTexcoords(gl);

  // Turn on the attribute
  gl.enableVertexAttribArray(texcoordAttributeLocation);
  gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
  gl.vertexAttribPointer(texcoordAttributeLocation, 2, gl.FLOAT, false, 0, 0);

  textureList.push(texture);

  // Fill the texture with a 1x1 blue pixel.
  //gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
  //              new Uint8Array([0, 0, 255, 255]));
  //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var fieldOfViewRadians = degToRad(120);
  var modelXRotationRadians = degToRad(0);
  var modelYRotationRadians = degToRad(-5);

  var zNear = 1;
  var zFar = 3;

  var cameraPosition = [0, 0, 2];
  var up = [0, 1, 0];
  var target = [0, 0, 0];

  function render() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // turn on depth testing
    gl.enable(gl.DEPTH_TEST);

    // tell webgl to cull faces
    gl.enable(gl.CULL_FACE);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);
    

    // Compute the matrix
    var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;

    var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

    // Compute the camera's matrix using look at.
    var cameraMatrix = m4.lookAt(cameraPosition, target, up);

    // Make a view matrix from the camera matrix.
    var viewMatrix = m4.inverse(cameraMatrix);

    var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

    var matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);
    matrix = m4.yRotate(matrix, modelYRotationRadians);

    // Set the matrix.
    gl.uniformMatrix4fv(matrixLocation, false, matrix);

    // Draw the geometry.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6 * 6;

    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.drawArrays(primitiveType, offset, count);

    gl.uniform3f(translationLocation, translation[0], translation[1], translation[2]);

    // Call render again next frame
    requestAnimationFrame(render);
  }
  requestAnimationFrame(render);
}

mainTexture();