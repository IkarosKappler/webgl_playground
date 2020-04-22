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
    "use strict";
    
    var gl;
    var canvas;
    var viewMatrix, projMatrix;
    var cUniformLocation;
    var uCanvasSizeUniformLocation;
    var iterationCountUniformLocation;
    var vertexShader;
    var fragmentShader;
    var shaderProgram;
    
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
					   // console.log('updating viewport');
					   gl.uniform2f( uCanvasSizeUniformLocation, canvas.width/2, canvas.height/2 ); 
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
	// Make shaders
	shaderProgram = gl.createProgram();

	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	    console.error('ERROR linking program!', gl.getProgramInfoLog(shaderProgram));
	    return;
	}
	gl.validateProgram(shaderProgram);
	if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS)) {
	    console.error('ERROR validating program!', gl.getProgramInfoLog(shaderProgram));
	    return;
	}
	
	gl.useProgram(shaderProgram);
	
	var vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aPosition' );
	gl.enableVertexAttribArray(vertexPositionAttribute);

	cUniformLocation = gl.getUniformLocation(shaderProgram, 'uC' );
	uCanvasSizeUniformLocation = gl.getUniformLocation(shaderProgram, 'uCanvasSize' );
	iterationCountUniformLocation = gl.getUniformLocation(shaderProgram, 'uIterationCount' );
    };


    
    // +---------------------------------------------------------------------------
    // | Initialize the scene and start the animation. 
    // +----------------------------------------------------------------
    var start = function() {	
	// Create buffer
	var planeVertices =  [
	    // X, Y, Z
	    -1, -1,  0,
	     1, -1,  0,
	    -1,  1,  0,
	     1,  1,  0
	];

	var planeVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, planeVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(planeVertices), gl.STATIC_DRAW);

	var positionAttribLocation = gl.getAttribLocation(shaderProgram, 'aPosition');

	gl.vertexAttribPointer(
	    positionAttribLocation,             // Attribute location
	    3,                                  // Number of elements per attribute
	    gl.FLOAT,                           // Type of elements
	    gl.FALSE,
	    3 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
	    0                                   // Offset from the beginning of a single vertex to this attribute
	);
	
	gl.enableVertexAttribArray(positionAttribLocation);

	// Tell OpenGL state machine which program should be active.
	gl.useProgram(shaderProgram);

	var loop = function (time) {

	    // Static color ...?
            // gl.clearColor(0.75, 0.85, 0.8, 1.0);
	    // ... or animate background color?
	    gl.clearColor(0.75, 0.85, Math.abs( (1000-time%2000)/1000 ), 1.0);
            gl.clear(gl.DEPTH_BUFFER_BIT | gl.COLOR_BUFFER_BIT);
  
	    var iterationCount = 255;
	    gl.uniform2f( cUniformLocation, config.re, config.im );
	    gl.uniform1i( iterationCountUniformLocation, iterationCount );
	    
            // gl.drawElements(gl.TRIANGLE_STRIP, planeIndices.length, gl.UNSIGNED_SHORT, 0);
	    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
	    
            requestAnimationFrame(loop);
	};
	requestAnimationFrame(loop);
    }; // END function start
    
    window.addEventListener('load',init);

})();
