import * as THREE from 'three';

import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  TextureLoader,
  Texture,
  Mesh,
  SphereGeometry,
  BufferAttribute,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SimplexNoise } from 'three/examples/jsm/math/SimplexNoise';
import AbstractWebgl from './AbstractWebgl';
import { SPACE_SCENE_TEXTURE_MAP } from './constants';

export default class SpaceScene extends AbstractWebgl {
  protected canvas: HTMLCanvasElement | null;

  protected camera: PerspectiveCamera | null;

  protected render: WebGLRenderer | null;

  protected scene: Scene | null;

  protected animId: number | null;

  private textureLoader: TextureLoader | null;

  private textureMap: Texture[];

  private coreMesh: Mesh | null;

  private backgroundSphereMesh: Mesh | null;

  private noise: SimplexNoise | null;

  constructor(elementId: string) {
    super();
    this.canvas = document.getElementById(elementId) as HTMLCanvasElement;
    this.render = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: false,
      alpha: false,
    });
    this.camera = new THREE.PerspectiveCamera(
      90,
      window.innerWidth / window.innerHeight,
      1,
      1000,
    );
    this.scene = new THREE.Scene();
    this.textureLoader = new THREE.TextureLoader();

    this.textureMap = [];
    this.coreMesh = null;
    this.backgroundSphereMesh = null;
    this.noise = new SimplexNoise();

    this.animId = requestAnimationFrame((time: number) => {
      this.update(time);
    });
  }

  create(): void {
    this.initRender();
    this.loadTextures();
    this.addLight();
    this.addControls();
  }

  destroy(): void {
    this.canvas = null;
    this.render = null;
    this.scene = null;
    this.camera = null;
    this.textureLoader = null;
    this.coreMesh = null;
    this.backgroundSphereMesh = null;
    this.noise = null;
    this.textureMap = [];
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    window.removeEventListener('resize', () => {
      this.onWindowResize();
    }, false);
  }

  protected update(time: number): void {
    this.animBackgroundSphere();
    if (this.scene && this.camera) {
      this.render?.render(this.scene, this.camera);
    }
    if (this.coreMesh) {
      this.animCore(time);
    }
    requestAnimationFrame((currentTime: number) => this.update(currentTime));
  }

  protected addLight() {
    const directionalLight = new THREE.DirectionalLight('#fff', 2);
    directionalLight.position.set(0, 50, -20);
    this.scene?.add(directionalLight);

    const ambientLight = new THREE.AmbientLight('#fff', 1);
    ambientLight.position.set(0, 20, 20);
    this.scene?.add(ambientLight);
  }

  protected onWindowResize(): void {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (this.camera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }

    this.render?.setSize(width, height);
  }

  private initRender(): void {
    this.render?.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.render?.setSize(window.innerWidth, window.innerHeight);

    this.camera?.position.set(0, 0, 150);

    window.addEventListener('resize', () => {
      this.onWindowResize();
    }, false);
  }

  private loadTextures():void {
    SPACE_SCENE_TEXTURE_MAP.forEach((item: string) => {
      this.textureLoader?.load(item, (texture: Texture) => {
        this.textureMap.push(texture);
        if (this.textureMap.length === SPACE_SCENE_TEXTURE_MAP.length) {
          this.addCore();
          this.addBackgroundSphere();
        }
      });
    });
  }

  private addCore(): void {
    const geometry = new THREE.SphereGeometry(30, 10);
    geometry.computeTangents();
    geometry.normalizeNormals();

    const material = new THREE.MeshPhongMaterial({ map: this.textureMap[0] });

    this.coreMesh = new THREE.Mesh(geometry, material);
    this.scene?.add(this.coreMesh);
  }

  private animCore(time: number): void {
    const geometry = this.coreMesh?.geometry as SphereGeometry;
    const position = geometry.getAttribute('position');
    const vector = new THREE.Vector3();

    const { count } = geometry.attributes.position;
    const { radius } = geometry.parameters;

    for (let index = 0; index < count; index++) {
      vector.fromBufferAttribute(position as BufferAttribute, index);
      vector.normalize();

      let length = 0;
      if (this.noise) {
        length = radius + this.noise.noise3d(
          vector.x + time * 0.0005,
          vector.y + time * 0.0003,
          vector.z + time * 0.0008,
        ) * 5;
      }

      vector.multiplyScalar(length);
      (geometry.attributes.position as BufferAttribute).setXYZ(
        index,
        vector.x,
        vector.y,
        vector.z,
      );
    }
    geometry.computeVertexNormals();
    geometry.attributes.position.needsUpdate = true;
  }

  private addBackgroundSphere(): void {
    const geometry = new THREE.SphereGeometry(150, 40, 40);
    const material = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      map: this.textureMap[1],
    });
    this.backgroundSphereMesh = new THREE.Mesh(geometry, material);
    this.scene?.add(this.backgroundSphereMesh);
  }

  private animBackgroundSphere(): void {
    if (this.backgroundSphereMesh) {
      this.backgroundSphereMesh.rotation.y += 0.0005;
    }
  }

  private addControls() {
    if (this.camera && this.render) {
      const controls = new OrbitControls(this.camera, this.render.domElement);
      controls.maxPolarAngle = Math.PI * 0.8;
      controls.minDistance = 1;
      controls.maxDistance = 150;
    }
  }
}
