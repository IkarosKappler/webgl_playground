function getShader ( gl, id ){
    var shaderScript = document.getElementById ( id );
    var str = "";
    var k = shaderScript.firstChild;
    while ( k ){
	if ( k.nodeType == 3 ) str += k.textContent;
	k = k.nextSibling;
    }
    var shader;
    if ( shaderScript.type == "x-shader/x-fragment" )
        shader = gl.createShader ( gl.FRAGMENT_SHADER );
    else if ( shaderScript.type == "x-shader/x-vertex" )
        shader = gl.createShader(gl.VERTEX_SHADER);
    else return null;
    gl.shaderSource(shader, str);
    gl.compileShader(shader);
    if (gl.getShaderParameter(shader, gl.COMPILE_STATUS) == 0)
	alert(gl.getShaderInfoLog(shader));
    return shader;
}

var gl, canvas;
var cLoc, size, frames = 0, timer_fr, time,
    n = 8, k, To = 30, T, Tp, animation = true;
var orb = [
    [.248, 0, .15],
    [.27, 0, .2],
    [.33, .033, .1],
    [.42, .228, .1],
    [.27, .564, .1],
    [-.162, .78, .1],
    [-.534, .612, .1],
    [-.726, .3, .1],
    [-.75, .0, .05],
    [.248, 0, .15]];

function webGLStart() {
    canvas = document.getElementById("canvas");
    size = Math.min(window.innerWidth, window.innerHeight) - 35;
    canvas.width =  size;   canvas.height = size;
    if (!window.WebGLRenderingContext){
	alert("Your browser does not support WebGL. See http://get.webgl.org");
	return;}
    try { gl = canvas.getContext("experimental-webgl");
	} catch(e) {}
    if ( !gl ) {alert("Can't get WebGL"); return;}
    gl.viewport(0, 0, size, size);

    var prog  = gl.createProgram();
    gl.attachShader(prog, getShader( gl, "shader-vs" ));
    gl.attachShader(prog, getShader( gl, "shader-fs" ));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    var posAtrLoc = gl.getAttribLocation(prog, "vPos");
    gl.enableVertexAttribArray( posAtrLoc );
    var posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    var vertices = new Float32Array([
	-1,-1, 0,   1,-1, 0,   -1, 1, 0,  1, 1, 0 ]);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
    gl.vertexAttribPointer(posAtrLoc, 3, gl.FLOAT, false, 0, 0);
    cLoc = gl.getUniformLocation(prog,"c");
    gl.uniform2f( gl.getUniformLocation(prog,"scale"), size/2, size/3 );
    time = new Date().getTime();
    k = 0;  Tp = -1;
    T = time/1000 + orb[k][2]*To;
    timer_fr = setInterval(fr, 500);
    anim();

    canvas.resize = function (){
	var size = Math.min(window.innerWidth, window.innerHeight) - 35;
	canvas.width =  size;   canvas.height = size;
	gl.uniform2f( gl.getUniformLocation(prog,"scale"), size/2, size/3 );
	gl.viewport(0, 0, size, size);
	draw();
    }
}

function anim(){
    var tim = new Date().getTime()/1000;
    var a = (T - tim)/(To*orb[k][2]);
    gl.uniform2f( cLoc, orb[k][0]*a + orb[k+1][0]*(1-a),
		  orb[k][1]*a + orb[k+1][1]*(1-a) );
    draw();
    if (tim > T){
	k++;  if (k > n) k = 0;
	T += orb[k][2]*To;
    }
    frames++;
    if ( animation ) requestAnimationFrame(anim);
}
function draw() {
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}
function setT(v) {
    To = v.valueOf();
}
function run(v) {
    if( animation ){
	animation = false;
	Tp = new Date().getTime()/1000;
	document.getElementById('runBtn').value = "Run ";}
    else{
	animation = true;
	if (Tp > 0){
	    T += new Date().getTime()/1000 - Tp;
	    Tp = -1;
	}
	anim();
	document.getElementById('runBtn').value = "Stop";
    }
}
function fr(){
    var ti = new Date().getTime();
    var fps = Math.round(1000*frames/(ti - time));
    document.getElementById("framerate").value = fps;
    frames = 0;  time = ti;
}
