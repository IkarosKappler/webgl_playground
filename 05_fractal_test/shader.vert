precision mediump float;

attribute vec3 aPosition;

uniform vec2 uRotationVector;

void main(void) {
  gl_Position = vec4(aPosition, 1.);
}
