/**
 * Some GL helper functions.
 * 
 * The code was inspired by teh demo at 
 *    https://developer.mozilla.org/de/docs/Web/API/WebGL_API/Tutorial/3D-Objekte_mit_WebGL_erstellen
 *
 * @author  Ikaros Kappler
 * @date    2017-11-06
 * @version 1.0.0
 **/

var glhelper = {

    // +---------------------------------------------------------------------------
    // | Load shader from DOM.
    // +----------------------------------------------------------------
    getShader : function (gl, id) {
	var shaderScript = document.getElementById(id);
	
	if (!shaderScript) 
	    return null;
	
	var theSource = "";
	var currentChild = shaderScript.firstChild;

	// Concatenate all text elements.
	while( currentChild ) {
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
	    console.warn( "Unknown shader type: " + shaderScript.type );
	    return null;  // Unknown shader type
	}

	gl.shaderSource(shader, theSource);
	gl.compileShader(shader);
	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	    console.warn("Failed to compile shader: " + gl.getShaderInfoLog(shader));
	    return null;
	}
	
	return shader;
    },


    // +---------------------------------------------------------------------------
    // | Initialize the shaders.
    // | This requires the getShader function (in utils.js) to be present.
    // +----------------------------------------------------------------
    initShaders : function(gl) {
	fragmentShader = glhelper.getShader(gl, 'shader-fs');
	vertexShader   = glhelper.getShader(gl, 'shader-vs');
	
	// Erzeuge Shader
	shaderProgram = gl.createProgram();
	gl.attachShader(shaderProgram, vertexShader);
	gl.attachShader(shaderProgram, fragmentShader); 
	gl.linkProgram(shaderProgram);
	
	
	if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
	    alert("Failed to initialize shaders.");
	}
	
	gl.useProgram(shaderProgram);
	
	return shaderProgram;
    },


    isPowerOf2 : function (value) {
	return (value & (value - 1)) == 0;
    },


    // +---------------------------------------------------------------------------
    // | Initialize a texture and load an image.
    // | When the image finished loading copy it into the texture.
    // +----------------------------------------------------------------
    loadTexture : function(gl, url) {
	const texture = gl.createTexture();
	gl.bindTexture(gl.TEXTURE_2D, texture);

	// Because images have to be download over the internet
	// they might take a moment until they are ready.
	// Until then put a single pixel in the texture so we can
	// use it immediately. When the image has finished downloading
	// we'll update the texture with the contents of the image.
	const level = 0;
	const internalFormat = gl.RGBA;
	const width = 1;
	const height = 1;
	const border = 0;
	const srcFormat = gl.RGBA;
	const srcType = gl.UNSIGNED_BYTE;
	const pixel = new Uint8Array([0, 0, 255, 255]);  // opaque blue
	gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
                      width, height, border, srcFormat, srcType,
                      pixel);

	const image = new Image();
	image.onload = function() {
	    gl.bindTexture(gl.TEXTURE_2D, texture);
	    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat,
			  srcFormat, srcType, image);

	    // WebGL1 has different requirements for power of 2 images
	    // vs non power of 2 images so check if the image is a
	    // power of 2 in both dimensions.
	    if (glhelper.isPowerOf2(image.width) && glhelper.isPowerOf2(image.height)) {
		// Yes, it's a power of 2. Generate mips.
		gl.generateMipmap(gl.TEXTURE_2D);
	    } else {
		// No, it's not a power of 2. Turn of mips and set
		// wrapping to clamp to edge
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
	    }
	};
	image.src = url;

	return texture;
    },


    // +---------------------------------------------------------------------------
    // | Bind the mesh's positions into the GL buffer.
    // +----------------------------------------------------------------
    bindVertexBuffer : function(gl, buffers, programInfo) {
	// Tell WebGL how to pull out the positions from the position
	// buffer into the vertexPosition attribute
	const numComponents = 3;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.vertex);
	gl.vertexAttribPointer(
	    programInfo.attribLocations.vertexPosition,
	    numComponents,
	    type,
	    normalize,
	    stride,
	    offset);
	gl.enableVertexAttribArray(
	    programInfo.attribLocations.vertexPosition);
    },


    // +---------------------------------------------------------------------------
    // | Bind the mesh's texture coordinates into the GL buffer.
    // +----------------------------------------------------------------
    bindTextureCoordsBuffer : function(gl, buffers, programInfo) {
	// Tell WebGL how to pull out the texture coordinates from
	// the texture coordinate buffer into the textureCoord attribute.
	const numComponents = 2;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.textureCoord);
	gl.vertexAttribPointer(
	    programInfo.attribLocations.textureCoord,
	    numComponents,
	    type,
	    normalize,
	    stride,
	    offset);
	gl.enableVertexAttribArray(
	    programInfo.attribLocations.textureCoord);
	
    },


    // +---------------------------------------------------------------------------
    // | Bind the mesh's texture coordinates into the GL buffer.
    // +----------------------------------------------------------------
    bindVertexNormalsBuffer : function(gl, buffers, programInfo) {
	// Tell WebGL how to pull out the normals from
	// the normal buffer into the vertexNormal attribute.
	const numComponents = 3;
	const type = gl.FLOAT;
	const normalize = false;
	const stride = 0;
	const offset = 0;
	gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
	gl.vertexAttribPointer(
	    programInfo.attribLocations.vertexNormal,
	    numComponents,
	    type,
	    normalize,
	    stride,
	    offset);
	gl.enableVertexAttribArray(
	    programInfo.attribLocations.vertexNormal);	
    }

}
