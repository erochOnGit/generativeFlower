// example import asset
// import imgPath from './assets/img.jpg';


// TODO : add Dat.GUI
// TODO : add Stats

var OrbitControls = require("three-orbit-controls")(THREE);
import * as dat from "dat.gui";
import Petal from "./Petal";

export default class App {
    constructor() {
        this.raycaster = new THREE.Raycaster();
        this.intersects = [];
        this.mouse = new THREE.Vector2()


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

        //this.scene.add(gridHelper);

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
        this.amb = new THREE.AmbientLight(0xffffff)
        this.scene.add(this.amb)

        this.dirLight = new THREE.DirectionalLight( 0xffffff, 1 );//Power light
        this.dirLight.castShadow = true;
        //console.log(this.dirLight.shadow.camera)
        this.dirLight.shadow.camera.near = 0.1;
        this.dirLight.shadow.camera.far = 25;
        this.dirLight.position.set(0,50,-20);
        this.scene.add(this.dirLight);

        this.dirLight.shadow.mapSize.width = 1024;  // default
        this.dirLight.shadow.mapSize.height = 1024; // default
        this.dirLight.shadow.camera.near = 0.5;       // default
        this.dirLight.shadow.camera.far = 500      // default

        this.dirLightHelper = new THREE.DirectionalLightHelper( this.dirLight, 2 );
        this.scene.add( this.dirLightHelper );

        this.secDirLight = new THREE.DirectionalLight( 0xffffff, 1 );//Power light
        this.scene.add(this.secDirLight)
        this.secDirLight.position.set(0,-10,-20);
        this.secDirLight.lookAt(40,40,40)

        this.secDirLightHelper = new THREE.DirectionalLightHelper( this.secDirLight, 2 );
        this.scene.add( this.secDirLightHelper );

        /*this.baseLight = new THREE.DirectionalLight( 0xffffff, 1 );//Power light
        this.baseLight.castShadow = true;
        console.log(this.baseLight)
        this.baseLight.shadow.camera.near = 0.1;
        this.baseLight.shadow.camera.far = 25;
        this.baseLight.position.set(50,0,-50);
        this.scene.add(this.baseLight);*/

        // let geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
        // let material = new THREE.MeshNormalMaterial();
        // this.mesh = new THREE.Mesh(geometry, material);
        // this.scene.add(this.mesh);

        //CUBE
        this.cgeometry = new THREE.SphereBufferGeometry( .7, 32, 32 );
        this.cmaterial = new THREE.MeshStandardMaterial( {color: 0xffff00} );
        this.cube = new THREE.Mesh( this.cgeometry, this.cmaterial );
        this.scene.add( this.cube );
        this.cube.castShadow = true;
        this.cube.position.y = 6;
        this.cube.rotation.x = 10;
        this.cube.rotation.y = 10;
        this.cube.receiveShadow = false;

        //PLANE
        this.planeGeometry = new THREE.PlaneBufferGeometry( 20, 20, 32 );
        this.planeMaterial = new THREE.MeshStandardMaterial( {color: 0xeeeeee, side: THREE.DoubleSide} );
        this.planeMesh = new THREE.Mesh( this.planeGeometry, this.planeMaterial );
        this.planeMesh.receiveShadow = true;
        this.planeMesh.rotation.x = 1.6;
        this.scene.add( this.planeMesh );

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

        document.querySelector('canvas').addEventListener( 'mousemove', this.onMouseMove.bind(this), false );

    }

    onMouseMove( event ) {
       this.mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
       this.mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
       //console.log(this.scene.children)
        for ( var i = 0; i < this.scene.children.length; i++ ) {
            //this.scene.children[ i ].material.color.set( 0x00ff00 );
        }
    }
    render() {

       this.raycaster.setFromCamera( this.mouse, this.camera );

        // calculate objects intersecting the picking ray
        this.intersects = this.raycaster.intersectObjects( this.scene.children );

          for ( var i = 0; i < this.intersects.length; i++ ) {
              //console.log(this.intersects)
              //this.intersects[ i ].object.material.color.set( 0xff0000 );
              console.log(this.intersects[i])
          }

        this.petals.forEach(petal => {
            petal.update(this.scene, this.clock.getElapsedTime());
        });
        let time = Date.now()/1000;// rayon
        this.cube.position.y = 6+  Math.sin(time);
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
