/**
 * A simple 3d vector class.
 *
 * @author  Ikaros Kappler
 * @date    2017-11-09
 * @version 1.0.0
 **/

var Vector3 = function(x,y,z) {
    this.x = x | 0;
    this.y = y | 0;
    this.z = z | 0;
};

Vector3.prototype.set = function( v3 ) {
    this.x = v3.x;
    this.y = v3.y;
    this.z = v3.z;
};
