import {
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Clock,
} from 'three';
import * as THREE from 'three';
// @ts-ignore
import vertexShader from '../glsl/sun/vertexShader.glsl';
// @ts-ignore
import fragmentShader from '../glsl/sun/fragmentShader.glsl';
import AbstractWebgl from './AbstractWebgl';
import { hexToRgb } from '../utils/constants';

export default class SynthWaveScene extends AbstractWebgl {
  protected animId: number | null;

  protected camera: PerspectiveCamera | null;

  protected canvas: HTMLCanvasElement | null;

  protected render: WebGLRenderer | null;

  protected scene: Scene | null;

  private directionLight1: DirectionalLight | null;

  private directionLight2: DirectionalLight | null;

  private clock: Clock;

  private uniforms = {
    u_time: { value: 0.0 },
    u_mouse: {
      value: {
        x: 0.0,
        y: 0.0,
      },
    },
    u_resolution: {
      value: {
        x: window.innerWidth * window.devicePixelRatio,
        y: window.innerHeight * window.devicePixelRatio,
      },
    },
  }

  constructor(elementId: string) {
    super();

    this.canvas = document.getElementById(elementId) as HTMLCanvasElement;
    this.render = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
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
    this.clock = new THREE.Clock();

    this.directionLight1 = null;
    this.directionLight2 = null;
  }

  create(): void {
    this.initRender();
    this.addLight();
    this.addSun();
  }

  destroy(): void {
    this.canvas = null;
    this.render = null;
    this.scene = null;
    this.camera = null;
    this.directionLight1 = null;
    this.directionLight2 = null;

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
    this.directionLight1 = new THREE.DirectionalLight(
      0x2dd7ff,
      0.85,
    );
    this.directionLight1.position.set(15, 1, 5);

    this.directionLight2 = new THREE.DirectionalLight(
      0x2dd7ff,
      0.85,
    );
    this.directionLight1.position.set(-15, 1, 5);

    this.scene?.add(this.directionLight1);
    this.scene?.add(this.directionLight2);
  }

  protected update(time: number): void {
    if (this.scene && this.camera) {
      this.render?.render(this.scene, this.camera);
      this.uniforms.u_time.value = this.clock.getElapsedTime();
    }
    requestAnimationFrame((currentTime: number) => this.update(currentTime));
  }

  private initRender(): void {
    this.render?.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.render?.setSize(window.innerWidth, window.innerHeight);

    this.camera?.position.set(0, 0, 5);

    window.addEventListener('resize', () => {
      this.onWindowResize();
    }, false);
  }

  // Sun
  private addSun(): void {
    const uniforms = {
      ...this.uniforms,
      color_main: {
        value: hexToRgb('#ffab00', true),
      },
      color_accent: {
        value: hexToRgb('#ff51c8', true),
      },
    };
    const geometry = new THREE.SphereGeometry(30, 64, 64);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    const sun = new THREE.Mesh(geometry, material);
    sun.position.set(0, 16, -100);

    this.scene?.add(sun);
  }
}
