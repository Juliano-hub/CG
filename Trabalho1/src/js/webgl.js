var vs = `#version 300 es
// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec4 a_position;
in vec2 a_texcoord;

// A matrix to transform the positions by
uniform mat4 u_matrix;

// a varying to pass the texture coordinates to the fragment shader
out vec2 v_texcoord;

// all shaders have a main function
void main() {
  // Multiply the position by the matrix.
  gl_Position = u_matrix * a_position;

  // Pass the texcoord to the fragment shader.
  v_texcoord = a_texcoord;
}
`;

var fs = `#version 300 es

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

const initializeWorld = () => {
  const canvas = document.querySelector("#canvas");
  const gl = canvas.getContext("webgl2");
  if (!gl) {
    return;
  }
  twgl.setAttributePrefix("a_");
  const meshProgramInfo = twgl.createProgramInfo(gl, [
    vertexShaderSource,
    fragmentShaderSource,
  ]);

  return {
    gl,
    meshProgramInfo,
  };
};
