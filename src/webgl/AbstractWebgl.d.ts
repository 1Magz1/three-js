import { Camera, Scene, WebGLRenderer } from 'three';
export default abstract class AbstractWebgl {
    protected abstract canvas: HTMLCanvasElement | null;
    protected abstract camera: Camera | null;
    protected abstract scene: Scene | null;
    protected abstract render: WebGLRenderer | null;
    protected abstract animId: number | null;
    abstract create(): void;
    abstract destroy(): void;
    protected abstract update(time: number): void;
    protected abstract addLight(): void;
    protected abstract onWindowResize(): void;
}
