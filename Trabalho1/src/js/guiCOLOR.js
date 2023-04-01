var palette = {
  color: [1.0, 0.0, 0.0, 1.0], // RGB with alpha
};

const loadGUIColor = (params) => {
    palette.color = [1.0, 0.0, 0.0, 1.0]

    params.gui.addColor(palette, "color").name("Change Color")
    .onChange(                
        function(value) {
           //params.newColor[0] = colorCalculation(value[0])
           //params.newColor[1] = colorCalculation(value[1])
           //params.newColor[2] = colorCalculation(value[2])
            params.newColor[0] = value[0]
            params.newColor[1] = value[1]
            params.newColor[2] = value[2]
            params.newColor[3] = value[3]
        }
    );
  }

function colorCalculation(color){
  return color/255;
}