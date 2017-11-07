/**
 * Inspired by 
 *    https://developer.mozilla.org/de/docs/Web/API/WebGL_API/Tutorial/Hinzuf%C3%BCgen_von_2D_Inhalten_in_einen_WebGL-Kontext
 *  and by
 *    http://www.kamaron.me/webgl-tutorial/01-setup-and-triangle
 *
 * @author Ikaros Kappler
 * @date 2017-10-30
 **/


window.utils = {

// +---------------------------------------------------------------------------
// | Initialize the shaders.
// | This requires the getShader function (in utils.js) to be present.
    // +----------------------------------------------------------------
    /*
var initShaders = function(gl) {
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
    
    return shaderProgram;
};
*/

/*
function isPowerOf2(value) {
    return (value & (value - 1)) == 0;
}
*/

};
