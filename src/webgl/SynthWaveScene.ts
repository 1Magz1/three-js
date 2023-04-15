import {
  DirectionalLight,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  Clock, Color, TextureLoader, Texture, Mesh,
} from 'three';
import * as THREE from 'three';
// @ts-ignore
import { GUI } from 'dat.gui';
// @ts-ignore
import vertexShader from '../glsl/sun/vertexShader.glsl';
// @ts-ignore
import fragmentShader from '../glsl/sun/fragmentShader.glsl';
import AbstractWebgl from './AbstractWebgl';
import { hexToRgb } from '../utils/constants';
import background from '../assets/images/space.jpg';

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
    color_main: {
      value: hexToRgb('#ff0000', true),
    },
    color_accent: {
      value: hexToRgb('#f1ff51', true),
    },
  };

  private params = {
    // sun params
    topColor: 0xffab00,
    bottomColor: 0xff51c8,
  };

  private textureLoader: TextureLoader | null;

  private backgroundSphereMesh: Mesh | null;

  private backgroundTexture: Texture | null;

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
    this.textureLoader = new THREE.TextureLoader();

    this.directionLight1 = null;
    this.directionLight2 = null;
    this.backgroundSphereMesh = null;
    this.backgroundTexture = null;
  }

  create(): void {
    this.initRender();
    this.addLight();
    this.addSun();
    this.addSceneBackground();

    this.initGui();
  }

  destroy(): void {
    this.canvas = null;
    this.render = null;
    this.scene = null;
    this.camera = null;
    this.directionLight1 = null;
    this.directionLight2 = null;
    this.textureLoader = null;
    this.backgroundTexture = null;

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

      this.animBackgroundSphere();
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

  // GUI controls
  private initGui(): void {
    const gui = new GUI();

    const sunFolder = gui.addFolder('Sun');

    sunFolder.addColor(this.params, 'topColor')
      .name('top color')
      .onChange((val: Color) => {
        const clr = new THREE.Color(val);
        this.uniforms.color_main.value = hexToRgb(clr.getHexString(), true);
      });

    sunFolder.addColor(this.params, 'bottomColor')
      .name('bottom color')
      .onChange((val: Color) => {
        const clr = new THREE.Color(val);
        this.uniforms.color_accent.value = hexToRgb(clr.getHexString(), true);
      });
  }

  private addBackgroundSphere(): void {
    const geometry = new THREE.SphereGeometry(300, 80, 80);
    const material = new THREE.MeshBasicMaterial({
      side: THREE.BackSide,
      map: this.backgroundTexture,
    });
    this.backgroundSphereMesh = new THREE.Mesh(geometry, material);
    this.scene?.add(this.backgroundSphereMesh);
  }

  private animBackgroundSphere(): void {
    if (this.backgroundSphereMesh) {
      this.backgroundSphereMesh.rotation.y += 0.0002;
    }
  }

  private addSceneBackground(): void {
    this.textureLoader?.load(
      background,
      (texture: Texture) => {
        this.backgroundTexture = texture;

        this.addBackgroundSphere();
      },
    );
  }
}
