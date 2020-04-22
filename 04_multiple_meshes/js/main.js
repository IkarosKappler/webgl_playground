/**
 * This example is based on the tutorial at
 *    http://www.kamaron.me/webgl-tutorial/02-rotating-cube
 *  and
 *    https://developer.mozilla.org/de/docs/Web/API/WebGL_API/Tutorial/3D-Objekte_mit_WebGL_erstellen
 *
 * @author  Ikaros Kappler
 * @date    2017-10-30
 * @version 1.0.0
 **/


// +---------------------------------------------------------------------------
// | Don't spoil the environment: use an anonymous closure.
// +----------------------------------------------------------------
(function() {

    var settings;
    var gl;
    var canvas;
    var shaderProgram;
    var cubeGeom;
    var scene;

    // +---------------------------------------------------------------------------
    // | Init will be called as soon as the page is loaded.
    // +----------------------------------------------------------------
    var init = function() {
	canvas = document.getElementById('canvas');
	scene  = [];
	initWebGL( canvas,
		   function(_gl) {
		       console.log( 'WebGL initialized.' );
		       gl = _gl;
		       gl.clearColor(0.75, 0.85, 0.8, 1.0);
		       gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		       // Let OpenGL manage the depth
		       gl.enable(gl.DEPTH_TEST);
		       gl.enable(gl.CULL_FACE);
		       gl.frontFace(gl.CCW);
		       gl.cullFace(gl.BACK);

		       // Endable transparency
		       gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
		       gl.enable(gl.BLEND);

		       shaderProgram = glhelper.initShaders( gl );
 
		       start();

		       installGUI();
		       
		       canvasFullpage( canvas,
				       function( _canvas, _w, _h ) {
					   console.log('updating viewport');
					   // Update the perspective if the canvas size changed!
					   gl.viewport((canvas.width-640)/2,(canvas.height-480)/2,640,480); 
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
    function start() {
	
	// Collect all the info needed to use the shader program.
	// Look up which attributes our shader program is using
	// for aVertexPosition, aVertexNormal, aTextureCoord,
	// and look up uniform locations.
	const programInfo = {
	    program: shaderProgram,
	    attribLocations: {
		vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
		vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
		textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
	    },
	    uniformLocations: {
		scaleVector : gl.getUniformLocation(shaderProgram, 'uScaleVector'),
		projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
		modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
		normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
		uSampler: gl.getUniformLocation(shaderProgram, 'uSampler'),
		bUseTexture: gl.getUniformLocation(shaderProgram, 'bUseTexture'),
	    },
	};

	// Here's where we call the routine that builds all the
	// objects we'll be drawing.
	//const buffers = initBuffers(gl);
	var c0, c1;
	//addToScene(c1 = new CubeGeometry().invertFaces());
	addToScene(c0 = new CubeGeometry());
	addToScene(c1 = new CubeGeometry());

	c0.rotation.x += Math.PI/4;

	//c0.vertices[0] = 0.5;
	//console.log( c1.vertices[0] );
	
	const texture = glhelper.loadTexture(gl, 'img/cubetexture.png');

	var then = 0;

	// Draw the scene repeatedly
	function render(now) {
	    now *= 0.001;  // convert to seconds
	    const deltaTime = now - then;
	    then = now;

	    //for( i in scene )
	    //	drawScene(gl, programInfo, scene[i].geometry, scene[i].buffers, texture, deltaTime);
	    drawScene(gl, programInfo, scene, texture, deltaTime);

	    requestAnimationFrame(render);
	}
	requestAnimationFrame(render);
    } // END function start


    
    
    // +---------------------------------------------------------------------------
    // | Add geometry to the scene.
    // +----------------------------------------------------------------
    function addToScene( geom ) {
	var buffers = initBuffers(gl,geom);
	scene.push( { geometry : geom, buffers : buffers } );
    }; // END function addToScene
    


    
    // +---------------------------------------------------------------------------
    // | Initialize the buffers we'll need. For this demo, we just
    // | have one object -- a simple three-dimensional cube.
    // +----------------------------------------------------------------
    function initBuffers(gl,geom) {

	//cubeGeom = new CubeGeometry();
	
	// Create a buffer for the cube's vertex positions.
	const vertexBuffer = gl.createBuffer();

	// Select the positionBuffer as the one to apply buffer
	// operations to from here out.
	gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
	// Now pass the list of positions into WebGL to build the
	// shape. We do this by creating a Float32Array from the
	// JavaScript array, then use it to fill the current buffer.
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geom.vertices), gl.STATIC_DRAW);

	// Set up the normals for the vertices, so that we can compute lighting.
	const normalBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geom.vertexNormals),
                      gl.STATIC_DRAW);

	// Now set up the texture coordinates for the faces.
	const textureCoordBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, textureCoordBuffer);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(geom.textureCoordinates),
                      gl.STATIC_DRAW);

	// Build the element array buffer; this specifies the indices
	// into the vertex arrays for each face's vertices.
	const facesBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, facesBuffer);
	// Now send the element array to GL
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
		      new Uint16Array(geom.faces), gl.STATIC_DRAW);

	return {
	    vertex: vertexBuffer,
	    normal: normalBuffer,
	    textureCoord: textureCoordBuffer,
	    faces: facesBuffer,
	};
    } // END function initBuffers



    // +---------------------------------------------------------------------------
    // | Draw the scene.
    // +----------------------------------------------------------------
    function drawScene(gl, programInfo, scene, texture, deltaTime) {
	
	gl.clearColor(0.0, 0.0, 0.0, 1.0);  // Clear to black, fully opaque
	gl.clearDepth(1.0);                 // Clear everything
	gl.enable(gl.DEPTH_TEST);           // Enable depth testing
	gl.depthFunc(gl.LEQUAL);            // Near things obscure far things

	// Clear the canvas before we start drawing on it.
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	
	for( i in scene ) {
	    drawGeometry(gl, programInfo, scene[i].geometry, scene[i].buffers, texture, deltaTime);

	    // Update the rotation for the next draw
	    scene[i].geometry.rotation.x += deltaTime;
	    scene[i].geometry.rotation.y += deltaTime/3;
	    scene[i].geometry.rotation.z += deltaTime/2;
	}
    };
    
    
    // +---------------------------------------------------------------------------
    // | Draw the given geometry.
    // +----------------------------------------------------------------
    function drawGeometry(gl, programInfo, geom, buffers, texture, deltaTime) {

	// Create a perspective matrix, a special matrix that is
	// used to simulate the distortion of perspective in a camera.
	// Our field of view is 45 degrees, with a width/height
	// ratio that matches the display size of the canvas
	// and we only want to see objects between 0.1 units
	// and 100 units away from the camera.

	const fieldOfView      = 45 * Math.PI / 180;   // in radians
	const aspect           = 640 / 480; // gl.canvas.clientWidth / gl.canvas.clientHeight;
	const zNear            = 0.1;
	const zFar             = 100.0;
	const projectionMatrix = mat4.create();

	// note: glmatrix.js always has the first argument
	// as the destination to receive the result.
	mat4.perspective( projectionMatrix,
			  fieldOfView,
			  aspect,
			  zNear,
			  zFar );

	// Set the drawing position to the "identity" point, which is
	// the center of the scene.
	const modelViewMatrix = mat4.create();

	// Now move the drawing position a bit to where we want to
	// start drawing the square.

	mat4.translate(modelViewMatrix,     // destination matrix
                       modelViewMatrix,     // matrix to translate
                       [-0.0, 0.0, -6.0]);  // amount to translate
	mat4.rotate(modelViewMatrix,        // destination matrix
		    modelViewMatrix,        // matrix to rotate
		    geom.rotation.z,        // amount to rotate in radians
		    [0, 0, 1]);             // axis to rotate around (Z)
	mat4.rotate(modelViewMatrix,        // destination matrix
		    modelViewMatrix,        // matrix to rotate
		    geom.rotation.y,        // * .7,    // amount to rotate in radians
		    [1, 0, 0]);             // axis to rotate around (Y)
	mat4.rotate(modelViewMatrix,        // destination matrix
		    modelViewMatrix,        // matrix to rotate
		    geom.rotation.x,        //  * .7,    // amount to rotate in radians
		    [0, 1, 0]);             // axis to rotate around (X)

	const normalMatrix = mat4.create();
	mat4.invert(normalMatrix, modelViewMatrix);
	mat4.transpose(normalMatrix, normalMatrix);

	// The buffers
	glhelper.bindVertexBuffer( gl, buffers, programInfo );
	glhelper.bindTextureCoordsBuffer( gl, buffers, programInfo );
	glhelper.bindVertexNormalsBuffer( gl, buffers, programInfo );

	// Tell WebGL which indices to use to index the vertices
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.faces);

	// Tell WebGL to use our program when drawing
	gl.useProgram(programInfo.program);

	// Set the shader uniforms
	gl.uniformMatrix4fv(
	    programInfo.uniformLocations.projectionMatrix,
	    false,
	    projectionMatrix );
	gl.uniformMatrix4fv(
	    programInfo.uniformLocations.modelViewMatrix,
	    false,
	    modelViewMatrix );
	gl.uniformMatrix4fv(
	    programInfo.uniformLocations.normalMatrix,
	    false,
	    normalMatrix );

	//var scale = new Float32Array([1.0,1.0,1.0], gl.STATIC_DRAW);
	gl.uniform3f(  // Bind a 3-component-vector:float
	    programInfo.uniformLocations.scaleVector,
	    geom.scale.x, geom.scale.y, geom.scale.z ); 

	// Specify the texture to map onto the faces.
	// Tell WebGL we want to affect texture unit 0
	gl.activeTexture(gl.TEXTURE0);

	// Bind the texture to texture unit 0
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Tell the shader we bound the texture to texture unit 0
	gl.uniform1i(programInfo.uniformLocations.uSampler, 0);

	// Draw texture?
	gl.uniform1i(  // Bind a 3-component-vector:float
	    programInfo.uniformLocations.bUseTexture,
	    1 ); // 0=>false, 1=>true 
	
	{
	    const vertexCount = 36;
	    const type = gl.UNSIGNED_SHORT;
	    const offset = 0;
	    gl.drawElements(gl.TRIANGLES, vertexCount, type, offset);
	}

    }


    // +---------------------------------------------------------------------------
    // | Install a small controller GUI panel.
    // +----------------------------------------------------------------
    var installGUI = function() {
	var GLSettings = function() {
	    this.scaleX = 1.0;
	    this.scaleY = 1.0;
	    this.scaleZ = 1.0;
	};

	settings = new GLSettings();
	var gui      = new dat.GUI();
	gui.add(settings, 'scaleX', 0.0, 5.0).onChange( function(val) { scene[0].geometry.scale.x = val; } );
	gui.add(settings, 'scaleY', 0.0, 5.0).onChange( function(val) { scene[0].geometry.scale.y = val; } );
	gui.add(settings, 'scaleZ', 0.0, 5.0).onChange( function(val) { scene[0].geometry.scale.z = val; } );
    };
    
    
    
    window.addEventListener('load',init);

})();
