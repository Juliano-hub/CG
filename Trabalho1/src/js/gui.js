//var cameraTarget = { radius: degToRad(20) };

const loadGUI = (cameraPosition, zNear, zFar) => {
  const gui = new dat.GUI();

  //console.log("Na func:")
  //console.log(cameraPosition[2])
  //console.log(cameraPosition)
  //const zNear = cameraTarget.radius / 100;
  //const zFar = cameraTarget.radius * 3;
  //console.log("Na func:" + cameraPosition[2])
  //console.log(m4)
  
  console.log("aq" + cameraPosition)
  //console.log("aq" + sharedUniforms.u_view[14])

  cameraPosition[2] = 16
  console.log("aq" + cameraPosition)
  //gui.add( sharedUniforms, "u_view[14]", zNear, zFar, 0.5)
}