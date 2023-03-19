const loadGUI = (gui, m4, u_world, cameraPosition, zNear, zFar) => {

  var parameters = {
    Zoom: 0,
    Rotation: 0,
    x: 0,
  };

  gui.add(parameters, "Zoom", zNear+1, zFar, 0.5)
  .onChange(                
    function(value) {
      cameraPosition[2] = value;          
    }
  );

  gui.add(parameters, "Rotation", 0, 360, 1)
  .onChange(                
    function(value) {
      u_world = m4.yRotation(value);
    }
  );

}