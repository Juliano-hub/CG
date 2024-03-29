var guiTexture = {
  TextureValue: "obj/TNT_Block.png",
};

const loadGUI = (params) => {

  var parameters = {
    Rotation: 0,
  };

  var cam = {
    x: 0,
    y: 0,
    z: 0,
  }

  params.gui.add(cam, "x", -7.9, 7.9, 0.1).name("x")
  .onChange(                
    function(value) {
      params.x = value;          
    }
  );
  
  /*
  params.gui.add(cam, "y", -7.9, 7.9, 0.1).name("y")
  .onChange(                
    function(value) {
      params.y = value;          
    }
  );
  */
 
  params.gui.add(cam, "z", params.Near, params.Far, 0.1).name("z")
  .onChange(                
    function(value) {
      params.fieldOfViewRadians = value;          
    }
  );

  params.gui.add(parameters, "Rotation", 0, 6.3, 0.1)
  .onChange(                
    function(value) {
      params.y = value
    }
  );

  var textureChange = { ChangeTexture:function(){ 
    console.log(textureValue)
    if(textureValue == numTotalTexture){
      textureValue = 0;
    }else{
      textureValue += 1;
    }

    }
  }

  params.gui.add(textureChange,'ChangeTexture').name('Change Texture');
}