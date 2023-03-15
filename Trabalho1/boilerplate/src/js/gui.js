var config = { rotate: degToRad(20) };

const loadGUI = () => {
  const gui = new dat.GUI();
  gui.add(config, "rotate", 0, 20, 0.5);
};
