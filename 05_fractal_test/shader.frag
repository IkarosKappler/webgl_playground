// Inspired by
//    https://www.ibiblio.org/e-notes/webgl/julia.html
precision highp float;

uniform vec2 uC;
uniform vec2 uCanvasSize;
uniform bool uGreyscale;

const int iterationCount = 255;

void main(void) {
  float R = (gl_FragCoord.x - uCanvasSize.x) / uCanvasSize.y*1.5;
  float I = (gl_FragCoord.y - uCanvasSize.y) / uCanvasSize.y*1.5;
  float R2 = R*R, I2 = I*I;
  int mm;
  for(int m = 0; m < iterationCount; m++) {
    I=(R+R)*I + uC.y;
    R=R2-I2 + uC.x;
    R2=R*R;
    I2=I*I;
    mm = m;
    if( R2 + I2 > 4. )
      break;
  } // END for

  if (mm == iterationCount-1) {
    gl_FragColor = vec4(0., 0., 0., 1.);	
  } else {
    float a = float(mm);
    a = mod(a, 30.) / 10.;
    gl_FragColor = vec4(
			max(0., abs(a - 1.5) - .5),
			max(0., 1. - abs(a - 1.)),
			max(0., 1. - abs(a - 2.)),
			1.);
    if( uGreyscale ) {
      gl_FragColor = vec4(
			  max(0., abs(a - 1.5) - .5),
			  max(0., abs(a - 1.5) - .5), // max(0., 1. - abs(a - 1.)),
			  max(0., abs(a - 1.5) - .5), // max(0., 1. - abs(a - 2.)),
			  1.);

    } else {
      gl_FragColor = vec4(
			  1.0, // max(0., abs(a - 1.5) - .5),
			  1.0, // max(0., 1. - abs(a - 1.)),
			  1.0, // max(0., 1. - abs(a - 2.)),
			  1.);
    }
  }
} // END main
