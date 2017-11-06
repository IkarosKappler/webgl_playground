var canvas;
var gl; // Globale Variable für den WebGl-Kontext

/*
function start() {
  canvas = document.getElementById("glcanvas");

  gl = initWebGL(canvas);      // Initialisierung des WebGL Kontextes
  
  // Es geht nur weiter, wenn WebGl verfügbar ist.
  
  if (gl) {
    gl.clearColor(0.0, 0.0, 0.0, 1.0);                // Setzt die Farbe auf Schwarz, vollständig sichtbar
    gl.enable(gl.DEPTH_TEST);                         // Aktiviere Tiefentest
    gl.depthFunc(gl.LEQUAL);                          // Nähere Objekte verdecken entferntere Objekte
    gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT) // Lösche alles, um die neue Farbe sichtbar zu machen
  }
}
*/


function initWebGL(canvas,success,failure) {
    gl = null;
    
    try {
	gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    }
    catch(e) {
    }
    
    if (!gl) {
	gl = null;
	failure( 'Failed to initialize WebGL.' );
    } else {
	success(gl);
    }
}
