# My WebGL Playground

My playground for raw WebGL coding.

![Screenshot](20171107_webgl_playground_0.png)


### Known Issues (yet to be solved)
* Changing viewport size causes warning: "Drawing to a destination rect smaller than the viewport rect."
* The viewport has a strange clipping area after resizing.


### Todos
* Add 'rotation' to the (Cube)Geometry class.
* Create a generic Geometry super class.


### Changelog
* [2020-04-22]
    * Added a webGL Julia set example.
* [2017-11-09]
    * Renamed the geometry's 'position' array  to 'vertices'.
    * Rename dthe geometry's 'indices' array to 'faces'.
    * Added a basic scene array (containg one element at the moment).
    * Created a new sub project: 04_multiple_meshes.
    * Added a new uniform the the fragment shader program: uDrawTexture (bool).
    * Added a function 'set' to the Vector3 class.

* [2017-11-08]
    * Added a 'scale' attribute to the CubeGeometry.
    * Added a 'rotation' attribute to the CubeGeometry.
        * Added a simple Vector3 class.	  

* [2017-11-07]
    * Added a scaling vector (x,y,z) to the cube on shader level.
    * Added dat.GUI for controlling settings.

* [2017-11-06]
    * Wrapped the data, positioning, normals and texture arrays into a CubeGeometry class.

* [2017-11-04]
    * Added textures and light.
    * Flicker on redraw fixed (Internet Explorer only).

* [2017-11-03]
    * Changed implementation for a basic scene with a spinning cube.

* [2017-10-30]
    * Basic WebGL tests.


