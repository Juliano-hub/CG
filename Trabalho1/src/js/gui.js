const loadGUI = (params, newDiffuseColor) => {

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

  params.gui.add(cam, "x", -20, 20, 0.1).name("CAM x")
  .onChange(                
    function(value) {
      params.cameraTarget[0] = value;          
    }
  );

  params.gui.add(cam, "y", -7.9, 7.9, 0.1).name("CAM y")
  .onChange(                
    function(value) {
      params.cameraTarget[1] = value;          
    }
  );

  params.gui.add(cam, "z", params.zNear + 1, params.zFar, 0.5).name("CAM z")
  .onChange(                
    function(value) {
      params.cameraPosition[2] = value;          
    }
  );

  params.gui.add(parameters, "Rotation", 0, 6.3, 0.1)
  .onChange(                
    function(value) {
      varRotation = value
    }
  );

  //console.log("Na func:" + parts)
  params.gui.addColor(palette, 'Color')
  .onChange(
    function(value) {
      newDiffuseColor[0] = value[0];
      newDiffuseColor[1] = value[1];
      newDiffuseColor[2] = value[2];
      newDiffuseColor[3] = value[3];
    }
  );
}