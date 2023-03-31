import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';
import * as THREE from 'three';
import AbstractWebgl from './AbstractWebgl';

export default class SynthWaveScene extends AbstractWebgl {
  protected animId: number | null;

  protected camera: PerspectiveCamera | null;

  protected canvas: HTMLCanvasElement | null;

  protected render: WebGLRenderer | null;

  protected scene: Scene | null;

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
    this.animId = requestAnimationFrame((time: number) => {
      this.update(time);
    });
  }

  create(): void {
    this.initRender();
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

    window.removeEventListener('resize', () => {
      this.onWindowResize();
    }, false);
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

  protected addLight(): void {
  }

  protected update(time: number): void {
    console.log(time);
  }

  private initRender(): void {
    this.render?.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.render?.setSize(window.innerWidth, window.innerHeight);

    this.camera?.position.set(0, 0, 100);

    window.addEventListener('resize', () => {
      this.onWindowResize();
    }, false);
  }
}
