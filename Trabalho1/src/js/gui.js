const loadGUI = (gui, m4, u_world, cameraPosition, zNear, zFar, cameraTarget, parts) => {

  var parameters = {
    Rotation: 0,
  };

  var cam = {
    x: 0,
    y: 0,
    z: 0,
  }

  var palette = {
    Color: [ 0, 128, 255, 0.3 ], // RGB with alpha
  };

  gui.add(cam, "x", -20, 20, 0.1).name("CAM x")
  .onChange(                
    function(value) {
      cameraTarget[0] = value;          
    }
  );

  gui.add(cam, "y", -7.9, 7.9, 0.1).name("CAM y")
  .onChange(                
    function(value) {
      cameraTarget[1] = value;          
    }
  );

  gui.add(cam, "z", zNear+1, zFar, 0.5).name("CAM z")
  .onChange(                
    function(value) {
      cameraPosition[2] = value;          
    }
  );

  gui.add(parameters, "Rotation", 0, 6.3, 0.1)
  .onChange(                
    function(value) {
      varRotation = value
    }
  );

  //console.log("Na func:" + parts)
  gui.addColor(palette, 'Color')
  .onChange(
    function(value) {
      for(var i = 0; i < 11; i++){
        //console.log(colorVector[i])
        //colorVector[i]= value;
        //console.log(colorVector[i])
        parts[i].bufferInfo.attribs.a_color = value;
        //obj.geometries[i].data.color = value
      }
    }
  );
}