function mainColor(canvasNUM = "#canvas"){
    // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");

  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // Use our boilerplate utils to compile the shaders and link into a program
  var program = webglUtils.createProgramFromSources(gl,
      [vertexShaderSource, fragmentShaderSource]);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");

  // look up uniform locations
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a vertex array object (attribute state)
  var vao = gl.createVertexArray();
  vaoArray2.push(vao);

  // and make it the one we're currently working with
  gl.bindVertexArray(vaoArray2[(numShop+4)]);

  // Create a buffer
  var positionBuffer = gl.createBuffer();
  positionBufferVector2.push(positionBuffer);
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferVector2[(numShop+4)]);
  // Set Geometry.
  setGeometry(gl);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

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

  // Create a texture.
  var texture = gl.createTexture();
  
  // use texture unit 0
  gl.activeTexture(gl.TEXTURE0);

  // bind to the TEXTURE_2D bind point of texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);

  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([0, 0, 255, 255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  // Now that the image has loaded make copy it to the texture.
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.generateMipmap(gl.TEXTURE_2D);

  textureColor.push(texture);

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var fieldOfViewRadians = degToRad(60);
  var modelXRotationRadians = degToRad(0);
  var modelYRotationRadians = degToRad(0);

  var params = {
    gui: gui,
    newColor:  palette.color,
  }

  loadGUIColor(params);

  requestAnimationFrame(render);

  // Draw the scene.
  function render(time) {
        time *= 0.001;  // convert to seconds

        time = time % 4;

        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        //modelYRotationRadians = funcReturn.x;
        //modelXRotationRadians = funcReturn.y;

        // turn on depth testing
        gl.enable(gl.DEPTH_TEST);

        // tell webgl to cull faces
        gl.enable(gl.CULL_FACE);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        // Compute the matrix
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        var zNear = 1;
        var zFar = 2000;
        var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

        var cameraPosition = [0, 0, 2];
        var funcReturn = curveCAM(p0, p1, p2, p3, time/2);
        cameraPosition[0] = funcReturn.x;
        cameraPosition[1] = funcReturn.y;

        var up = [0, 1, 0];
        var target = [0, 0, 0];

        // Compute the camera's matrix using look at.
        var cameraMatrix = m4.lookAt(cameraPosition, target, up);

        // Make a view matrix from the camera matrix.
        var viewMatrix = m4.inverse(cameraMatrix);

        var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

        var matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);
        matrix = m4.yRotate(matrix, modelYRotationRadians);

        // Set the matrix.
        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Fill the texture with new color
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
            new Uint8Array([params.newColor[0], params.newColor[1], params.newColor[2], 255]));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6 * 6;
        gl.drawArrays(primitiveType, offset, count);

        // Call drawScene again next frame
        requestAnimationFrame(render);
  }
    requestAnimationFrame(render);
}

var p0 = { x: 0, y: 0 };
var p1 = { x: 1, y: 0 };
var p2 = { x: 5, y: 0 };
var p3 = { x: 5, y: 0 };
  
function curveCAM(p0, p1, p2, p3, t) {
    var x = Math.pow(1 - t, 3) * p0.x + 3 * Math.pow(1 - t, 2) * t * p1.x + 3 * (1 - t) * Math.pow(t, 2) * p2.x + Math.pow(t, 3) * p3.x;
    var y = Math.pow(1 - t, 3) * p0.y + 3 * Math.pow(1 - t, 2) * t * p1.y + 3 * (1 - t) * Math.pow(t, 2) * p2.y + Math.pow(t, 3) * p3.y;
  
    return { x: x, y: y };
}

var numShop = -4;
var vaoArray2 = [];
var positionBufferVector2 = [];
var textureColor = [];
var vectorColor = [];

function buyColor() {
    numShop += 1;
    vectorColor.push({...palette.color})
    mainColor2("#canvas3");
}

function mainColor2(canvasNUM = "#canvas3"){
    // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas3");

  var gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }

  // Use our boilerplate utils to compile the shaders and link into a program
  var program = webglUtils.createProgramFromSources(gl,
      [vertexShaderSource, fragmentShaderSource]);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  var texcoordAttributeLocation = gl.getAttribLocation(program, "a_texcoord");
  var translationLocation2 = gl.getUniformLocation(program, "u_translation");
  var translation2 = [-0.4, -numShop-2, 1];

  // look up uniform locations
  var matrixLocation = gl.getUniformLocation(program, "u_matrix");

  // Create a vertex array object (attribute state)
  var vao = gl.createVertexArray();
  vaoArray2.push(vao);

  // and make it the one we're currently working with
  gl.bindVertexArray(vaoArray2[(numShop+4)]);

  // Create a buffer
  var positionBuffer = gl.createBuffer();
  positionBufferVector2.push(positionBuffer);
  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBufferVector2[(numShop+4)]);
  // Set Geometry.
  setGeometry(gl);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

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

  // Create a texture.
  var texture = gl.createTexture();
  
  // use texture unit 0
  gl.activeTexture(gl.TEXTURE0);

  // bind to the TEXTURE_2D bind point of texture unit 0
  gl.bindTexture(gl.TEXTURE_2D, texture);

  var calc = (numShop+3);
  // Fill the texture with a 1x1 blue pixel.
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
                new Uint8Array([vectorColor[calc][0], vectorColor[calc][1], vectorColor[calc][2], 255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);

  // Now that the image has loaded make copy it to the texture.
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.generateMipmap(gl.TEXTURE_2D);

  textureColor.push(texture);

  function degToRad(d) {
    return d * Math.PI / 180;
  }

  var fieldOfViewRadians = degToRad(120);
  var modelXRotationRadians = degToRad(0);
  var modelYRotationRadians = degToRad(0);

  requestAnimationFrame(render);

  // Draw the scene.
  function render(time) {
    time *= 0.001;  // convert to seconds

        webglUtils.resizeCanvasToDisplaySize(gl.canvas);

        // Tell WebGL how to convert from clip space to pixels
        gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

        modelYRotationRadians = time;

        // turn on depth testing
        gl.enable(gl.DEPTH_TEST);

        // tell webgl to cull faces
        gl.enable(gl.CULL_FACE);

        // Tell it to use our program (pair of shaders)
        gl.useProgram(program);

        // Bind the attribute/buffer set we want.
        gl.bindVertexArray(vao);

        // Compute the matrix
        var aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
        var zNear = 1;
        var zFar = 2000;
        var projectionMatrix = m4.perspective(fieldOfViewRadians, aspect, zNear, zFar);

        var cameraPosition = [0, 0, 2];
        var up = [0, 1, 0];
        var target = [0, 0, 0];

        // Compute the camera's matrix using look at.
        var cameraMatrix = m4.lookAt(cameraPosition, target, up);

        // Make a view matrix from the camera matrix.
        var viewMatrix = m4.inverse(cameraMatrix);

        var viewProjectionMatrix = m4.multiply(projectionMatrix, viewMatrix);

        var matrix = m4.xRotate(viewProjectionMatrix, modelXRotationRadians);
        matrix = m4.yRotate(matrix, modelYRotationRadians);

        // Set the matrix.
        gl.uniformMatrix4fv(matrixLocation, false, matrix);

        gl.bindTexture(gl.TEXTURE_2D, texture);

        // Draw the geometry.
        var primitiveType = gl.TRIANGLES;
        var offset = 0;
        var count = 6 * 6;
        gl.drawArrays(primitiveType, offset, count);

        gl.uniform3f(translationLocation2, translation2[0], translation2[1], translation2[2]);

        // Call drawScene again next frame
        requestAnimationFrame(render);
  }
    requestAnimationFrame(render);
}
  
mainColor();