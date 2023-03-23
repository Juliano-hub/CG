const loadGUI = (params) => {

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
    params.TextureValue = !params.TextureValue;
    console.log('aqq')
    console.log(params.TextureValue)
    if(params.TextureValue == true){
      image.src = "obj/Exodius.png";
    }else{
      image.src = "obj/TNT_BLOCK_Edited.png";
    }


  }};

  params.gui.add(textureChange,'ChangeTexture').name('Change Texture');


  var objj = { add:function(){ 

    console.log("clicked") 
    //console.log(params.obj)

    const fs = require('fs');

    fs.writeFile('arquivo.txt', params.obj, (err) => {
      if (err) throw err;
      console.log('As informações foram salvas no arquivo!');
    });


  }};

  params.gui.add(objj,'add').name('Save Obj');
}