import * as THREE from 'three';

import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
  TextureLoader,
  Texture,
  Mesh,
} from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import AbstractWebgl from './AbstractWebgl';
import { SPACE_SCENE_TEXTURE_MAP } from './constants';

export default class SpaceScene implements AbstractWebgl {
  canvas: HTMLCanvasElement | null;

  camera: PerspectiveCamera | null;

  render: WebGLRenderer | null;

  scene: Scene | null;

  animId: number | null;

  private textureLoader: TextureLoader;

  private readonly textureMap: Texture[];

  private coreMesh: Mesh | null;

  private backgroundSphereMesh: Mesh | null;

  constructor(elementId: string) {
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

    this.animId = requestAnimationFrame(() => {
      this.update();
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
    this.coreMesh = null;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
    window.removeEventListener('resize', () => {
      this.onWindowResize();
    }, false);
  }

  update(): void {
    if (this.scene && this.camera) {
      this.render?.render(this.scene, this.camera);
    }
    requestAnimationFrame(() => this.update());
  }

  addLight() {
    const directionalLight = new THREE.DirectionalLight('#fff', 2);
    directionalLight.position.set(0, 50, -20);
    this.scene?.add(directionalLight);

    const ambientLight = new THREE.AmbientLight('#fff', 1);
    ambientLight.position.set(0, 20, 20);
    this.scene?.add(ambientLight);
  }

  onWindowResize(): void {
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
      this.textureLoader.load(item, (texture: Texture) => {
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

  private addBackgroundSphere() {
    const geometry = new THREE.SphereGeometry(150, 40, 40);
    const material = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      map: this.textureMap[1],
    });
    this.backgroundSphereMesh = new THREE.Mesh(geometry, material);
    this.scene?.add(this.backgroundSphereMesh);
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
