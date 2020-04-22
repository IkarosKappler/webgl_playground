'use strict';

/**
 * This is an attempt to write a simple cube class to avoid storing
 * the vertices, faces, and normals in global attributes.
 *
 * I like the naming convention from three.js so I decided to use 
 * it here, too.
 *
 * @author  Ikaros Kappler
 * @date    2017-11-06
 * @version 1.0.0
 **/


window.CubeGeometry = (function() {

    var constructor = function() {

	this.scale    = new Vector3(1,1,1);
	this.rotation = new Vector3();
	
	// Note that this cube uses 6*4=24 vertices instead of 8.
	// Each face has four vertices and their normals are perpendicular on _each_ face!
	
	// Now create an array of positions for the cube.
	this.vertices = [
	    // Front face
		-1.0, -1.0,  1.0,
	    1.0, -1.0,  1.0,
	    1.0,  1.0,  1.0,
		-1.0,  1.0,  1.0,

	    // Back face
		-1.0, -1.0, -1.0,
		-1.0,  1.0, -1.0,
	    1.0,  1.0, -1.0,
	    1.0, -1.0, -1.0,

	    // Top face
		-1.0,  1.0, -1.0,
		-1.0,  1.0,  1.0,
	    1.0,  1.0,  1.0,
	    1.0,  1.0, -1.0,

	    // Bottom face
		-1.0, -1.0, -1.0,
	    1.0, -1.0, -1.0,
	    1.0, -1.0,  1.0,
		-1.0, -1.0,  1.0,

	    // Right face
	    1.0, -1.0, -1.0,
	    1.0,  1.0, -1.0,
	    1.0,  1.0,  1.0,
	    1.0, -1.0,  1.0,

	    // Left face
		-1.0, -1.0, -1.0,
		-1.0, -1.0,  1.0,
		-1.0,  1.0,  1.0,
		-1.0,  1.0, -1.0,
	];

	this.vertexNormals = [
	    // Front
	    0.0,  0.0,  1.0,
	    0.0,  0.0,  1.0,
	    0.0,  0.0,  1.0,
	    0.0,  0.0,  1.0,

	    // Back
	    0.0,  0.0, -1.0,
	    0.0,  0.0, -1.0,
	    0.0,  0.0, -1.0,
	    0.0,  0.0, -1.0,

	    // Top
	    0.0,  1.0,  0.0,
	    0.0,  1.0,  0.0,
	    0.0,  1.0,  0.0,
	    0.0,  1.0,  0.0,

	    // Bottom
	    0.0, -1.0,  0.0,
	    0.0, -1.0,  0.0,
	    0.0, -1.0,  0.0,
	    0.0, -1.0,  0.0,

	    // Right
	    1.0,  0.0,  0.0,
	    1.0,  0.0,  0.0,
	    1.0,  0.0,  0.0,
	    1.0,  0.0,  0.0,

	    // Left
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0,
		-1.0,  0.0,  0.0
	];

	this.textureCoordinates = [
	    // Front
	    0.0,  0.0,
	    1.0,  0.0,
	    1.0,  1.0,
	    0.0,  1.0,
	    // Back
	    0.0,  0.0,
	    1.0,  0.0,
	    1.0,  1.0,
	    0.0,  1.0,
	    // Top
	    0.0,  0.0,
	    1.0,  0.0,
	    1.0,  1.0,
	    0.0,  1.0,
	    // Bottom
	    0.0,  0.0,
	    1.0,  0.0,
	    1.0,  1.0,
	    0.0,  1.0,
	    // Right
	    0.0,  0.0,
	    1.0,  0.0,
	    1.0,  1.0,
	    0.0,  1.0,
	    // Left
	    0.0,  0.0,
	    1.0,  0.0,
	    1.0,  1.0,
	    0.0,  1.0,
	];

	// This array defines each face as two triangles, using the
	// indices into the vertex array to specify each triangle's
	// position.
	this.faces = [
	    0,  1,  2,      0,  2,  3,    // front
	    4,  5,  6,      4,  6,  7,    // back
	    8,  9,  10,     8,  10, 11,   // top
	    12, 13, 14,     12, 14, 15,   // bottom
	    16, 17, 18,     16, 18, 19,   // right
	    20, 21, 22,     20, 22, 23,   // left
	];


	
	// +---------------------------------------------------------------------------
	// | Invert the faces.
	// |
	// | This will turn the geometry inside out.
	// +----------------------------------------------------------------
	this.invertFaces = function() {
	    // Invert faces (turn inside out)
	    for( var i = 0; i < this.faces.length; i+=3 ) {
		var tmp = this.faces[i];
		this.faces[i] = this.faces[i+1];
		this.faces[i+1] = tmp;
	    }
	    return this;
	};

	/*
	this.copy = function( geom ) {
	    // Copy positions
	    this.vertices = geom.vertices.slice(0);
	    this.vertexNormals = geom.vertexNormals.slice(0);
	    this.textureCoordinates = geom.textureCoordinates.slice(0);
	    this.faces = geom.faces.slice(0);
	};
	*/

	// +---------------------------------------------------------------------------
	// | Create a clone of this cube (just creates a new cube).
	// +----------------------------------------------------------------
	this.clone = function() {
	    var geom = new CubeGeometry();
	    geom.scale.set( this.scale );
	    geom.rotation.set( this.rotation );
	    return geom;
	}
	
    }; // END function constructor

    return constructor;

})();
