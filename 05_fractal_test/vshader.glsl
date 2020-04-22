precision mediump float;

      attribute vec3 aPosition;

      uniform vec2 uRotationVector;

      void main(void) {
	vec2 rotatedPosition = vec2(
	    aPosition.x * uRotationVector.y +
		aPosition.y * uRotationVector.x,
	    aPosition.y * uRotationVector.y -
		aPosition.x * uRotationVector.x
	);

	gl_Position = vec4(rotatedPosition, aPosition.z, 1.0);
      }