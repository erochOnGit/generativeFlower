// example import asset
// import imgPath from './assets/img.jpg';

// TODO : add Dat.GUI
// TODO : add Stats

var OrbitControls = require("three-orbit-controls")(THREE);
import * as dat from "dat.gui";
import Petal from "./Petal";

export default class App {
  constructor() {
    // this.container = document.querySelector("#main");
    this.container = document.createElement("div");
    this.container.id = "main";
    document.body.appendChild(this.container);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 10;

    this.controls = new OrbitControls(this.camera);

    var size = 10;
    var divisions = 10;

    var gridHelper = new THREE.GridHelper(size, divisions);
    // DAT.GUI Related Stuff

    var gui = new dat.GUI();

    // var cam = gui.addFolder("Camera");
    // cam.add(this.camera.position, "y", 0.1, 10).listen();
    // cam.open();

    this.scene = new THREE.Scene();

    this.scene.add(gridHelper);

    this.petals = [];
    let r = 1.7; //radius
    let h = 0; //x of the center
    let k = 0; //x of the center
    for (let i = 0; i < 6; i += 1) {
      let x = r * Math.cos(i) + h;
      let y = r * Math.sin(i) + k;
      let z = 0;

      let petal = new Petal(
        new THREE.Vector3(x, z, y),
        new THREE.Vector3(1.5, 0, i + 4)
      );

      this.scene.add(petal.mesh);
      this.petals.push(petal);
    }

    // let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    // let material = new THREE.MeshNormalMaterial();
    // this.mesh = new THREE.Mesh(geometry, material);
    // this.scene.add(this.mesh);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.container.appendChild(this.renderer.domElement);

    window.addEventListener("resize", this.onWindowResize.bind(this), false);
    this.onWindowResize();
    this.clock = new THREE.Clock();
    this.clock.start();
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  render() {
    this.petals.forEach(petal => {
      petal.update(this.scene, this.clock.getElapsedTime());
    });
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
