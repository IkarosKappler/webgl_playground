/**
 * This example is based on the tutorial at
 *    http://www.kamaron.me/webgl-tutorial/02-rotating-cube
 *
 * @author  Ikaros Kappler
 * @date    2017-10-30
 * @version 1.0.0
 **/

// Don't spoil the environment: use an anonymous closure.
(function() {
    
    var gl;
    var canvas;
    var viewMatrix, projMatrix;
    
    var init = function() {
	canvas = document.getElementById('canvas');
	initWebGL( canvas,
		   function(_gl) {
		       console.log( 'WebGL initialized.' );
		       gl = _gl;
		       gl.clearColor(0.75, 0.85, 0.8, 1.0);
		       gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		       // Let OpenGL manage the depth :)
		       gl.enable(gl.DEPTH_TEST);
		       gl.enable(gl.CULL_FACE);
		       gl.frontFace(gl.CCW);
		       gl.cullFace(gl.BACK);

		       initShaders();
 
		       start();

		       canvasFullpage( canvas,
				       function( _canvas, _w, _h ) {
					   console.log('updating viewport');
					   // Update the perspective if the canvas size changed!
					   //mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
					   //mat4.perspective(projMatrix, glMatrix.toRadian(45), _w/_h, 0.1, 1000.0);
					   mat4.perspective(projMatrix, glMatrix.toRadian(45), 640.0/480.0, 0.1, 1000.0);
					   //mat4.lookAt(viewMatrix, vec3.fromValues(0, 0, -8), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
					   gl.viewport(0,0,640,480); //canvas.width,canvas.height);
					   //gl.viewport(0,0,canvas.width,canvas.height);
				       }
				     );
		   },
		   function(errmsg) {
		       console.warn( errmsg );
		   }
		 );
    }; // END function init


    // +---------------------------------------------------------------------------
    // | Initialize the shaders.
    // | This requires the getShader function (in utils.js) to be present.
    // +----------------------------------------------------------------
    var initShaders = function() {
	fragmentShader = getShader(gl, 'shader-fs');
	vertexShader = getShader(gl, 'shader-vs');
	
	// Erzeuge Shader
	
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	
	
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	    alert("Failed to initialize shaders.");
	}
	
	gl.useProgram(shaderProgram);
	
	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'vertPosition' ); // 'aVertexPosition');
	gl.enableVertexAttribArray(vertexPositionAttribute);
    };


    
    // +---------------------------------------------------------------------------
    // | Initialize the scene and start the animation. 
    // +----------------------------------------------------------------
    var start = function() {

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
	    console.error('ERROR linking program!', gl.getProgramInfoLog(program));
	    return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
	    console.error('ERROR validating program!', gl.getProgramInfoLog(program));
	    return;
	}
	
	//
	// Create buffer
	//
	/*
	var boxVertices = 
	    [ // X, Y, Z           R, G, B
		    // Top
		    -1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		    -1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5,
		
		// Left
		    -1.0, 1.0, 1.0,    0.75, 0.25, 0.5,
		    -1.0, -1.0, 1.0,   0.75, 0.25, 0.5,
		    -1.0, -1.0, -1.0,  0.75, 0.25, 0.5,
		    -1.0, 1.0, -1.0,   0.75, 0.25, 0.5,
		
		// Right
		1.0, 1.0, 1.0,    0.25, 0.25, 0.75,
		1.0, -1.0, 1.0,   0.25, 0.25, 0.75,
		1.0, -1.0, -1.0,  0.25, 0.25, 0.75,
		1.0, 1.0, -1.0,   0.25, 0.25, 0.75,
		
		// Front
		1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		    -1.0, -1.0, 1.0,    1.0, 0.0, 0.15,
		    -1.0, 1.0, 1.0,    1.0, 0.0, 0.15,
		
		// Back
		1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		    -1.0, -1.0, -1.0,    0.0, 1.0, 0.15,
		    -1.0, 1.0, -1.0,    0.0, 1.0, 0.15,
		
		// Bottom
		    -1.0, -1.0, -1.0,   0.5, 0.5, 1.0,
		    -1.0, -1.0, 1.0,    0.5, 0.5, 1.0,
		1.0, -1.0, 1.0,     0.5, 0.5, 1.0,
		1.0, -1.0, -1.0,    0.5, 0.5, 1.0,
	    ];
	*/
	var boxVertices = [
	    // vordere Fläche
		-1.0, -1.0,  1.0, 0.5, 0.5, 0.5,
	    1.0, -1.0,  1.0, 0.5, 0.5, 0.5,
	    1.0,  1.0,  1.0, 0.5, 0.5, 0.5,
		-1.0,  1.0,  1.0, 0.5, 0.5, 0.5,
	    
	    // hintere Fläche
		-1.0, -1.0, -1.0, 0.75, 0.25, 0.5,
		-1.0,  1.0, -1.0, 0.75, 0.25, 0.5,
	    1.0,  1.0, -1.0, 0.75, 0.25, 0.5,
	    1.0, -1.0, -1.0, 0.75, 0.25, 0.5,
	    
	    // obere Fläche
		-1.0,  1.0, -1.0,  0.25, 0.25, 0.75,
		-1.0,  1.0,  1.0,  0.25, 0.25, 0.75,
	    1.0,  1.0,  1.0,  0.25, 0.25, 0.75,
	    1.0,  1.0, -1.0,  0.25, 0.25, 0.75,
	    
	    // untere Fläche
		-1.0, -1.0, -1.0,  1.0, 0.0, 0.15,
	    1.0, -1.0, -1.0,  1.0, 0.0, 0.15,
	    1.0, -1.0,  1.0,  1.0, 0.0, 0.15,
		-1.0, -1.0,  1.0,  1.0, 0.0, 0.15,
	    
	    // rechte Fläche
	    1.0, -1.0, -1.0, 0.0, 1.0, 0.15,
	    1.0,  1.0, -1.0, 0.0, 1.0, 0.15,
	    1.0,  1.0,  1.0, 0.0, 1.0, 0.15,
	    1.0, -1.0,  1.0, 0.0, 1.0, 0.15,
	    
	    // linke Fläche
		-1.0, -1.0, -1.0, 0.5, 0.5, 1.0,
		-1.0, -1.0,  1.0, 0.5, 0.5, 1.0,
		-1.0,  1.0,  1.0, 0.5, 0.5, 1.0,
		-1.0,  1.0, -1.0, 0.5, 0.5, 1.0
	];
	makeRandomVertexColors(boxVertices);
	/*
	var boxIndices =
	    [
		// Top
		0, 1, 2,
		0, 2, 3,
		
		// Left
		5, 4, 6,
		6, 4, 7,
		
		// Right
		8, 9, 10,
		8, 10, 11,
		
		// Front
		13, 12, 14,
		15, 14, 12,
		
		// Back
		16, 17, 18,
		16, 18, 19,
		
		// Bottom
		21, 20, 22,
		22, 20, 23
	    ];
	*/
	var boxIndices = [
	    0,  1,  2,      0,  2,  3,    // vorne
	    4,  5,  6,      4,  6,  7,    // hinten
	    8,  9,  10,     8,  10, 11,   // oben
	    12, 13, 14,     12, 14, 15,   // unten
	    16, 17, 18,     16, 18, 19,   // rechts
	    20, 21, 22,     20, 22, 23    // links
	];

	// --- TEST: MAKE NORMALS FOR VERTICES
	
	var cubeVerticesNormalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);

	var vertexNormals = [
	    // vorne
	    0.0,  0.0,  1.0,
	    0.0,  0.0,  1.0,
	    0.0,  0.0,  1.0,
	    0.0,  0.0,  1.0,
	    
	    // hinten
	    0.0,  0.0, -1.0,
	    0.0,  0.0, -1.0,
	    0.0,  0.0, -1.0,
	    0.0,  0.0, -1.0,
	    
	    // oben
	    0.0,  1.0,  0.0,
	    0.0,  1.0,  0.0,
	    0.0,  1.0,  0.0,
	    0.0,  1.0,  0.0,
	    
	    // unten
	    0.0, -1.0,  0.0,
	    0.0, -1.0,  0.0,
	    0.0, -1.0,  0.0,
	    0.0, -1.0,  0.0,
	    
	    // rechts
	    1.0,  0.0,  0.0,
	    1.0,  0.0,  0.0,
	    1.0,  0.0,  0.0,
	    1.0,  0.0,  0.0,
	    
	    // links
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0
	];
	
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);
	var vertexNormalAttribute = 0; // START INDEX IN ARRAY???
	gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
	// --- END TEST: MAKE NORMALS FOR VERTICES

	var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
	

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);
	
	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);
	
	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	var normalAttribLocation = gl.getAttribLocation(program, 'vertNormal');
	gl.vertexAttribPointer(
	    positionAttribLocation, // Attribute location
	    3, // Number of elements per attribute
	    gl.FLOAT, // Type of elements
	    gl.FALSE,
	    6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	    0 // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
	    colorAttribLocation, // Attribute location
	    3, // Number of elements per attribute
	    gl.FLOAT, // Type of elements
	    gl.FALSE,
	    6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	    3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);
	gl.vertexAttribPointer(
	    normalAttribLocation, // Attribute location
	    3, // Number of elements per attribute
	    gl.FLOAT, // Type of elements
	    gl.FALSE,
	    6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	    0 // Offset from the beginning of a single vertex to this attribute
	);
	
	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	// Tell OpenGL state machine which program should be active.
	gl.useProgram(program);
	
	var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program, 'mView');
	var matProjUniformLocation = gl.getUniformLocation(program, 'mProj');
		
	var worldMatrix = mat4.create();
	viewMatrix = mat4.create();
	projMatrix = mat4.create();
	mat4.identity(worldMatrix);
	mat4.lookAt(viewMatrix, vec3.fromValues(0, 0, -8), vec3.fromValues(0, 0, 0), vec3.fromValues(0, 1, 0));
	mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

 
	gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation, gl.FALSE, viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation, gl.FALSE, projMatrix);
 
	var xRotationMatrix = new Float32Array(16);
	var yRotationMatrix = new Float32Array(16);
	
	//
	// Main render loop
	//
	var identityMatrix = new Float32Array(16);
	mat4.identity(identityMatrix);
	var angle = 0;
	var loop = function () {
            angle = performance.now() / 1000 / 6 * 2 * Math.PI;
            mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
            mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
            mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
            gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);

	    // Update the perspective if the canvas size changed!
	    //mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);

	    // --- LIGHTING
	    /*
	    var normalMatrix = mvMatrix.inverse();
	    normalMatrix = normalMatrix.transpose();
	    var nUniform = gl.getUniformLocation(shaderProgram, "uNormalMatrix");
	    gl.uniformMatrix4fv(nUniform, false, new Float32Array(normalMatrix.flatten()));
	    */
	    // --- END LIGHTING
	    
	    
            gl.clearColor(0.0, 0.0, 0.0, 1.0); // 0.75, 0.85, 0.8, 1.0);
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT, 0);
	    
            requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
    }; // END function start
    
    window.addEventListener('load',init);

})();
