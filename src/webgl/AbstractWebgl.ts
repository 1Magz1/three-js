import {
  Camera,
  Scene,
  WebGLRenderer,
} from 'three';

export default abstract class AbstractWebgl {
  abstract canvas: HTMLCanvasElement | null

  abstract camera: Camera | null

  abstract scene: Scene | null

  abstract render: WebGLRenderer | null

  abstract animId: number | null;

  abstract create(): void

  abstract destroy(): void

  abstract update(): void

  abstract onWindowResize(): void
}
