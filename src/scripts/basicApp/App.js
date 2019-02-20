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
    this.camera.position.z = -5;
    this.camera.position.y = 5;
    this.camera.position.x = 5;
    // this.camera.lookAt(0, 0, 0);
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

    /**
     * geometries
     */
    this.petals = [];
    let r = 1.3; //radius
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

    var geometry = new THREE.TorusKnotGeometry(10, 3, 100, 16);
    var material = new THREE.MeshStandardMaterial({ color: 0xffffff });
    var torusKnot = new THREE.Mesh(geometry, material);
    torusKnot.position.set(0, 0, -10);
    this.scene.add(torusKnot);

    var geometry = new THREE.PlaneGeometry(5, 20, 32);
    var material = new THREE.MeshBasicMaterial({
      color: 0xeeeeee,
      side: THREE.DoubleSide
    });
    //Create a plane that receives shadows (but does not cast them)
    var planeGeometry = new THREE.PlaneBufferGeometry(20, 20, 32, 32);
    var planeMaterial = new THREE.MeshStandardMaterial({ color: 0x3f6ff2 });
    var plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.y = -3;
    plane.receiveShadow = true;
    plane.rotation.x -= 1.5;
    this.scene.add(plane);

    // let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    // let material = new THREE.MeshNormalMaterial();
    // this.mesh = new THREE.Mesh(geometry, material);
    // this.scene.add(this.mesh);

    /**
     * lights
     */

    var spotLight = new THREE.DirectionalLight(0xffffff, 0.1);
    spotLight.position.set(200, 200, 200);
    spotLight.castShadow = true;
    this.scene.add(spotLight);
    spotLight.shadow.mapSize.width = 1024; // default
    spotLight.shadow.mapSize.height = 1024;

    var spotLight2 = new THREE.DirectionalLight(0xff88ff, 0.3);
    spotLight2.position.set(-200, 200, 200);
    spotLight2.castShadow = true;
    this.scene.add(spotLight2);
    spotLight2.shadow.mapSize.width = 1024; // default
    spotLight2.shadow.mapSize.height = 1024;

    var spotLightHelper = new THREE.DirectionalLightHelper(spotLight);
    this.scene.add(spotLightHelper);

    var spotLightHelper2 = new THREE.DirectionalLightHelper(spotLight2);
    this.scene.add(spotLightHelper2);

    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
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
