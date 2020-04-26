/**
 * Resizes the canvas on each window resize to full fit.
 *
 * @author  Ikaros Kappler
 * @date    2017-10-30
 * @version 1.0.0
 **/

var canvasFullpage = function( canvas, onChange ) {
    var fireEvent = function(_w,_h) {
	if( typeof onChange == 'function' )
	    onChange( canvas, _w, _h );
    };
    var handler = function(e) {
	var w = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
	var h = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
	canvas.width  = w;
	canvas.height = h;

	canvas.setAttribute('width',w);
	canvas.setAttribute('height',h);

	canvas.style.width = ''+w+'px';
	canvas.style.height = ''+h+'px';

	fireEvent(w,h);
    };
    this.triggerResize = function() { handler(null); };
    window.addEventListener('resize', handler );
    handler( null );
    return this;
};
