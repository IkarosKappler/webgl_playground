/**
 * A helper function to initialize WebGL.
 *
 * @author  Ikaros Kappler
 * @date    2017-11-01
 * @version 1.0.0
 **/


function initWebGL(canvas,success,failure) {
    var gl = null;
    
    try {
	gl = canvas.getContext('webgl', { preserveDrawingBuffer : true }) || canvas.getContext('experimental-webgl', { preserveDrawingBuffer : true });
	//gl = canvas.getContext('webgl', {}) || canvas.getContext('experimental-webgl', {});
    }
    catch(e) { }
    
    if( gl ) success(gl);
    else     failure( 'Failed to initialize WebGL.' );
}
