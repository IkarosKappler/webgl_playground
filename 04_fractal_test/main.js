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
					   // mat4.perspective(projMatrix, glMatrix.toRadian(45), canvas.width / canvas.height, 0.1, 1000.0);
					   // gl.viewport(0,0,640,480);
					   gl.viewport(0,0,canvas.width,canvas.height);
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
	
	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'position' ); // 'aVertexPosition');
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
	var planeVertices = 
	    [
		// X, Y, Z           R, G, B
		// Top
		-1.0, 1.0, -1.0,   0.5, 0.5, 0.5,
		-1.0, 1.0, 1.0,    0.5, 0.5, 0.5,
		1.0, 1.0, 1.0,     0.5, 0.5, 0.5,
		1.0, 1.0, -1.0,    0.5, 0.5, 0.5	
	    ];
	makeRandomVertexColors(planeVertices);
	 
	var planeIndices =
	    [
		// Top
		0, 1, 2,
		0, 2, 3		
	    ];

	// --- TEST: MAKE NORMALS FOR VERTICES
	
	// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

	// gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesNormalBuffer);
	//gl.vertexAttribPointer(vertexNormalAttribute, 3, gl.FLOAT, false, 0, 0);
	
	// --- END TEST: MAKE NORMALS FOR VERTICES

	var planeVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, planeVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeVertices), gl.STATIC_DRAW);
	
	var planeIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, planeIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(planeIndices), gl.STATIC_DRAW);
	
	var positionAttribLocation = gl.getAttribLocation(program, 'position');

	
	//var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
	    positionAttribLocation, // Attribute location
	    3, // Number of elements per attribute
	    gl.FLOAT, // Type of elements
	    gl.FALSE,
	    6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	    0 // Offset from the beginning of a single vertex to this attribute
	);
	/*
	gl.vertexAttribPointer(
	    colorAttribLocation, // Attribute location
	    3, // Number of elements per attribute
	    gl.FLOAT, // Type of elements
	    gl.FALSE,
	    6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	    3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	); */
	
	gl.enableVertexAttribArray(positionAttribLocation);
	// gl.enableVertexAttribArray(colorAttribLocation);

	// Tell OpenGL state machine which program should be active.
	gl.useProgram(program);
	
	/* var matWorldUniformLocation = gl.getUniformLocation(program, 'mWorld');
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
	*/
	var angle = 0;
	var loop = function () {
            /*angle = performance.now() / 1000 / 6 * 2 * Math.PI;
            mat4.rotate(yRotationMatrix, identityMatrix, angle, [0, 1, 0]);
            mat4.rotate(xRotationMatrix, identityMatrix, angle / 4, [1, 0, 0]);
            mat4.mul(worldMatrix, yRotationMatrix, xRotationMatrix);
            gl.uniformMatrix4fv(matWorldUniformLocation, gl.FALSE, worldMatrix);
	    */
	    
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
	    
	    
            gl.clearColor(0.75, 0.85, 0.8, 1.0);
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
            gl.drawElements(gl.TRIANGLES, planeIndices.length, gl.UNSIGNED_SHORT, 0);
	    
            requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
    }; // END function start
    
    window.addEventListener('load',init);

})();
