import * as THREE from 'three';

import {
  Scene,
  WebGLRenderer,
  PerspectiveCamera,
} from 'three';

import AbstractWebgl from './AbstractWebgl';

export default class SpaceScene extends AbstractWebgl {
  canvas: HTMLCanvasElement | null;

  camera: PerspectiveCamera | null;

  render: WebGLRenderer | null;

  scene: Scene | null;

  animId: number | null;

  constructor() {
    super();
    this.canvas = document.getElementById('space-scene') as HTMLCanvasElement;

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

    this.animId = requestAnimationFrame(() => {
      this.update();
    });
  }

  create(): void {
    this.render?.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.render?.setSize(window.innerWidth, window.innerHeight);

    this.camera?.position.set(0, 0, 150);
  }

  destroy(): void {
    this.canvas = null;
    this.render = null;
    this.scene = null;
    this.camera = null;
    if (this.animId) {
      cancelAnimationFrame(this.animId);
      this.animId = null;
    }
  }

  update(): void {
    requestAnimationFrame(() => this.update());
  }

  onWindowResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (this.camera) {
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
    }

    this.render?.setSize(width, height);
  }
}
