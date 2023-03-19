//var cameraTarget = { radius: degToRad(20) };

const loadGUI = (cameraPosition, zNear, zFar) => {
  const gui = new dat.GUI();

  var parameters = {Zoom:0};

  //console.log("Na func:")
  //console.log(cameraPosition[2])
  //console.log(cameraPosition)
  //const zNear = cameraTarget.radius / 100;
  //const zFar = cameraTarget.radius * 3;
  //console.log("Na func:" + cameraPosition[2])
  //console.log(m4)
  
  console.log("aq" + cameraPosition)

  cameraPosition[2] = 18
  console.log("aq" + cameraPosition)

  gui.add(parameters, "Zoom", zNear, zFar, 0.5)
  .onChange(                
    function(value) {
      cameraPosition[2] = value;          
    }
  );

}