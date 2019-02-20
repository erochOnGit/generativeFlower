class Petal {
  constructor(position, rotation) {
    this.position = position;

    this.geometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);

    this.shape = new THREE.Shape();
    this.vert = [];
    let r = 0.1; //radius
    let h = 0; //x of the center
    let k = 0; //x of the center

    for (let i = 0; i < 4; i += 0.05) {
      let x = r * Math.cos(i) + h;
      let y = r * Math.sin(i) + k;
      this.vert.push(x);
      this.vert.push(y);
      this.vert.push(0);
    }

    this.shape.moveTo(this.vert[0], this.vert[1]);
    for (let s = 0; s < this.vert.length; s += 3) {
      this.shape.lineTo(this.vert[s], this.vert[s + 1]);
    }
    this.shape.lineTo(this.vert[0], this.vert[1]);
    this.extrudeSettings = {
      steps: 2,
      depth: 0.005,
      bevelEnabled: true,
      bevelThickness: 0.008,
      bevelSize: 0.5,
      bevelSegments: 8
    };
    this.geometry2 = new THREE.ExtrudeGeometry(
      this.shape,
      this.extrudeSettings
    );
    // this.geometry2.mergeVertices();

    this.material = new THREE.MeshStandardMaterial({
      color: 0xffff00,
      roughness: 0.4,
      metalness: 0,
      emissive: 0x0
      // flatShading: true
    });
    this.mesh = new THREE.Mesh(this.geometry2, this.material);
    this.mesh.position.set(position.x, position.y, position.z);
    this.mesh.rotation.set(rotation.x, rotation.y, rotation.z);
    this.mesh.recieveShadow = true;
    this.mesh.castShadow = true;

    this.mesh.geometry.vertices.forEach(vertice => {
      let distance = vertice.distanceTo(new THREE.Vector3(0, 0, 0));
      if (distance > 0.01) {
        vertice.z = -Math.sin(distance) + 1.4;
      }
    });
    this.geometry2.computeVertexNormals();
  }

  update(scene, time) {
    // this.mesh.geometry.verticesNeedUpdate = true;
  }
}
export default Petal;
