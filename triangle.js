const vertexShaderText = `
    precision mediump float;

    attribute vec2 vertPosition;
    attribute vec3 vertColor;
    varying vec3 fragColor;

    void main()
    {
        fragColor = vertColor;
        gl_Position = vec4(vertPosition, 0.0, 1.0);
    }`;

const fragmentShaderText = `
    precision mediump float;

    varying vec3 fragColor;
    void main()
    {
        gl_FragColor = vec4(fragColor, 1.0);
    }`;

const debug = true;

const StartGL = function () {
  const canvas = document.getElementById("canvas");
  const gl = canvas.getContext("webgl");

  if (!gl) gl = canvas.getContext("experimental-webgl");

  if (!gl) alert("WebGL not enabled");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  gl.viewport(0, 0, window.innerWidth, window.innerHeight);

  gl.clearColor(0.1, 0.1, 0.1, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const vertexShader = gl.createShader(gl.VERTEX_SHADER);
  const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

  gl.shaderSource(vertexShader, vertexShaderText);
  gl.shaderSource(fragmentShader, fragmentShaderText);

  gl.compileShader(vertexShader);
  if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS))
    console.error("WebGL compile failed", gl.getShaderInfoLog(vertexShader));

  gl.compileShader(fragmentShader);
  if (!gl.getShaderInfoLog(vertexShader))
    console.error("WebGL compile failed", gl.getShaderInfoLog(fragmentShader));

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);

  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS))
    console.error("WebGL link failed", gl.getProgramInfoLog(program));

  gl.validateProgram(program);
  if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS))
    console.error("WebGL validate failed", gl.getProgramInfoLog(program));

  // prettier-ignore
  const triangleVertices =
  [//x,    y     r     g     b
    0.0,  0.5,  1.0,  0.0,  0.0,
   -0.5, -0.5,  0.0,  1.0,  0.0, 
    0.5, -0.5,  0.0,  0.0,  1.0,
  ];

  const triangleVertexBufferObject = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, triangleVertexBufferObject);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array(triangleVertices),
    gl.STATIC_DRAW
  );

  const positionAttribLocation = gl.getAttribLocation(program, "vertPosition");
  const colorAttribLocation = gl.getAttribLocation(program, "vertColor");
  gl.vertexAttribPointer(
    positionAttribLocation,
    2, // number of attributes
    gl.FLOAT, // type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
    0 // offset from the begining of a single vertex to this attribute
  );
  gl.vertexAttribPointer(
    colorAttribLocation,
    3, // number of attributes
    gl.FLOAT, // type of elements
    gl.FALSE,
    5 * Float32Array.BYTES_PER_ELEMENT, // size of individual vertex
    2 * Float32Array.BYTES_PER_ELEMENT // offset from the begining of a single vertex to this attribute
  );

  gl.enableVertexAttribArray(positionAttribLocation);
  gl.enableVertexAttribArray(colorAttribLocation);

  gl.useProgram(program);
  gl.drawArrays(gl.TRIANGLES, 0, 3);
};
