/**
 * Inspired by 
 *    https://developer.mozilla.org/de/docs/Web/API/WebGL_API/Tutorial/Hinzuf%C3%BCgen_von_2D_Inhalten_in_einen_WebGL-Kontext
 *  and by
 *    http://www.kamaron.me/webgl-tutorial/01-setup-and-triangle
 *
 * @author Ikaros Kappler
 * @date 2017-10-30
 **/


// +---------------------------------------------------------------------------
// | Load shader from DOM.
// +----------------------------------------------------------------
function getShader(gl, id) {
    var shaderScript = document.getElementById(id);   
    if (!shaderScript) 
	return null;  
    var theSource = "";
    var currentChild = shaderScript.firstChild;
    // Concatenate all text elements.
    while(currentChild) {
	if (currentChild.nodeType == 3) {
	    theSource += currentChild.textContent;
	}
	currentChild = currentChild.nextSibling;
    }
    return compileShader( gl, theSource, shaderScript.type );
}

function compileShader(gl, shaderScriptSource, shaderScriptType) {
    var shader;
    if (shaderScriptType == "x-shader/x-fragment") {
	shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScriptType == "x-shader/x-vertex") {
	shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
	console.warn( "Unknown shader type: " + shaderScriptType );
	return null;  // Unknown shader type
    }
    gl.shaderSource(shader, shaderScriptSource);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	console.warn("Failed to compile shader: " + gl.getShaderInfoLog(shader));
	return null;
    }  
    return shader;
}

var getExternalShader = function(gl, path, type, success) {
    requestResource( path,
		     function(scriptSource) { success(compileShader(gl, scriptSource, type)) },
		     function() { }
		   );
};


/**
 * Request to load the given resource (specified by 'path', relative or absolute)
 * with an asynchronous XHR request.
 *
 * @param {string} path - The resoruce's path. Should be a text file.
 * @param {function(string)} success - A success callback (accepting the file contents as a string).
 * @param {function(number)} reject - A failure callback (accepting the error code).
 * @return {void}
 **/
var requestResource = function(path,success,reject) {
    // console.log('Requesting path', path );
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path);
    xhr.onload = function() {
	if (xhr.status === 200) 
	    success(xhr.responseText);
	else 
	    reject(xhr.status);
    };
    xhr.send();
};
