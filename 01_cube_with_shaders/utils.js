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
    gl.compileShader(shader);    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
	console.warn("Failed to compile shader: " + gl.getShaderInfoLog(shader));
	return null;
    }
    
    return shader;
}



// +---------------------------------------------------------------------------
// | Set random colors to the passed vertex/color buffer (array).
// +----------------------------------------------------------------
var makeRandomVertexColors = function( buffer ) {
    for( var i = 0; i < buffer.length; i+=6 ) {
	buffer[i+3] = Math.random();
	buffer[i+4] = Math.random();
	buffer[i+5] = Math.random();
    }
};

// +---------------------------------------------------------------------------
// | Get a random integer in the range [min,max).
// +----------------------------------------------------------------
//var randomInt = function( min, max ) {
//    return min + Math.floor( Math.random()*(max-min) );
//};
