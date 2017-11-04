// This example is based in the tutorial at
//    https://developer.mozilla.org/de/docs/Web/API/WebGL_API/Tutorial/3D-Objekte_mit_WebGL_erstellen

// Don't spoil the environment: use an anonymous closure.
(function() {
    
    var gl;
    var canvas;
    var shaderProgram;
    var perspectiveMatrix; // = mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, perspectiveMatrix);
    var mvMatrix;
    
    var init = function() {
	canvas = document.getElementById('canvas');
	initWebGL( canvas,
		   function(_gl) {
		       console.log( 'WebGL initialized.' );
		       gl = _gl;
		       gl.clearColor(0.0, 0.0, 0.0, 1.0);                // Setzt die Farbe auf Schwarz, vollstaendig sichtbar
		       gl.enable(gl.DEPTH_TEST);                         // Aktiviere Tiefentest
		       gl.depthFunc(gl.LEQUAL);                          // Naehere Objekte verdecken entferntere Objekte
		       gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT) // Loesche alles, um die neue Farbe sichtbar zu machen
		       perspectiveMatrix = mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, perspectiveMatrix); // makePerspective(45, 640.0/480.0, 0.1, 100.0);
		       loadIdentity();
		       initShaders();
		       start();
		   },
		   function(errmsg) {
		       console.warn( errmsg );
		   }
		 );		   
    }; // END function init


    // https://code.tutsplus.com/articles/webgl-essentials-part-i--net-25856
    /*function makePerspective(FOV, AspectRatio, Closest, Farest){
	var YLimit = Closest * Math.tan(FOV * Math.PI / 360);
	var A = -( Farest + Closest ) / ( Farest - Closest );
	var B = -2 * Farest * Closest / ( Farest - Closest );
	var C = (2 * Closest) / ( (YLimit * AspectRatio) * 2 );
	var D = (2 * Closest) / ( YLimit * 2 );
	return [
            C, 0, 0, 0,
            0, D, 0, 0,
            0, 0, A, -1,
            0, 0, B, 0
	];
    }
    function makeTransform(Object){
	return [
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, -6, 1
	];
    }
    */
    
    
    
    function loadIdentity() {
	mvMatrix = Matrix.I(4);
    }

    function multMatrix(m) {
	mvMatrix = mvMatrix.x(m);
    }

    function mvTranslate(v) {
	multMatrix(Matrix.Translation($V([v[0], v[1], v[2]])).ensure4x4());
    }

    function setMatrixUniforms() {
	console.log( perspectiveMatrix );
	var pUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
	gl.uniformMatrix4fv(pUniform, false, new Float32Array(perspectiveMatrix)); //.flatten()));

	var mvUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(mvUniform, false, new Float32Array(mvMatrix)); //.flatten()));
    }
    
    function getShader(gl, id) {
	var shaderScript = document.getElementById(id);
	
	if (!shaderScript) {
	    return null;
	}
	
	var theSource = "";
	var currentChild = shaderScript.firstChild;
	
	while(currentChild) {
	    if (currentChild.nodeType == 3) {
		theSource += currentChild.textContent;
	    }
	    
	    currentChild = currentChild.nextSibling;
	}

	var shader;
	
	if (shaderScript.type == "x-shader/x-fragment") {
	    shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (shaderScript.type == "x-shader/x-vertex") {
	    shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
	    return null;  // Unbekannter Shadertyp
	}

	gl.shaderSource(shader, theSource);
	
	// Kompiliere das Shaderprogramm
	
	gl.compileShader(shader);
	
	// Überprüfe, ob die Kompilierung erfolgreich war
	
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	    alert("Es ist ein Fehler beim Kompilieren der Shader aufgetaucht: " + gl.getShaderInfoLog(shader));
	    return null;
	}
	
	return shader;
    }
    
    function initShaders() {
	var fragmentShader = getShader(gl, "shader-fs");
	var vertexShader = getShader(gl, "shader-vs");
	
	// Erzeuge Shader
	
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader);
	gl.linkProgram(shaderProgram);
	
	// Wenn die das Aufrufen der Shader fehlschlägt,
	// gib eine Fehlermeldung aus:
	
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	    alert("Initialisierung des Shaderprogramms nicht möglich.");
	}
	
	gl.useProgram(shaderProgram);
	
	vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
	gl.enableVertexAttribArray(vertexPositionAttribute);
    }

    // --- The cube's vertices -------------------------------
    var start = function() {
	var vertices = [
	    // vordere Fläche
		-1.0, -1.0,  1.0,
	    1.0, -1.0,  1.0,
	    1.0,  1.0,  1.0,
		-1.0,  1.0,  1.0,
	    
	    // hintere Fläche
		-1.0, -1.0, -1.0,
		-1.0,  1.0, -1.0,
	    1.0,  1.0, -1.0,
	    1.0, -1.0, -1.0,
	    
	    // obere Fläche
		-1.0,  1.0, -1.0,
		-1.0,  1.0,  1.0,
	    1.0,  1.0,  1.0,
	    1.0,  1.0, -1.0,
	    
	    // untere Fläche
		-1.0, -1.0, -1.0,
	    1.0, -1.0, -1.0,
	    1.0, -1.0,  1.0,
		-1.0, -1.0,  1.0,
	    
	    // rechte Fläche
	    1.0, -1.0, -1.0,
	    1.0,  1.0, -1.0,
	    1.0,  1.0,  1.0,
	    1.0, -1.0,  1.0,
	    
	    // linke Fläche
		-1.0, -1.0, -1.0,
		-1.0, -1.0,  1.0,
		-1.0,  1.0,  1.0,
		-1.0,  1.0, -1.0
	];


	// --- The colors -------------------------------
	var colors = [
	    [1.0,  1.0,  1.0,  1.0],    // vordere Fläche: weiß
	    [1.0,  0.0,  0.0,  1.0],    // hintere Fläche: rot
	    [0.0,  1.0,  0.0,  1.0],    // obere Fläche: grün
	    [0.0,  0.0,  1.0,  1.0],    // untere Fläche: blau
	    [1.0,  1.0,  0.0,  1.0],    // rechte Fläche: gelb
	    [1.0,  0.0,  1.0,  1.0]     // linke Fläche: violett
	];
	
	var generatedColors = [];
	
	for (j=0; j<6; j++) {
	    var c = colors[j];
	    
	    for (var i=0; i<4; i++) {
		generatedColors = generatedColors.concat(c);
	    }
	}

	cubeVerticesColorBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, cubeVerticesColorBuffer);
	// This was WebGLFloatArray
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(generatedColors), gl.STATIC_DRAW);


	// --- Elements-array -------------------------------
	cubeVerticesIndexBuffer = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);

	// Dieser Array definiert jede Fläche als zwei Dreiecke über die Indizes
	// im Vertex-Array, um die Position jedes Dreiecks festzulegen.

	var cubeVertexIndices = [
	    0,  1,  2,      0,  2,  3,    // vorne
	    4,  5,  6,      4,  6,  7,    // hinten
	    8,  9,  10,     8,  10, 11,   // oben
	    12, 13, 14,     12, 14, 15,   // unten
	    16, 17, 18,     16, 18, 19,   // rechts
	    20, 21, 22,     20, 22, 23    // links
	]

	// Sende nun das Element-Array zum GL
	// This was WebGLUnsignedShortArray
	gl.bufferData( gl.ELEMENT_ARRAY_BUFFER,
		       new Uint16Array(cubeVertexIndices), gl.STATIC_DRAW);



	// --- Draw the cube -------------------------------
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeVerticesIndexBuffer);
	setMatrixUniforms();
	gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);


    }; // END function init
    
    window.addEventListener('load',init);

})();
