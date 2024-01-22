<template>
  <div class="scene">
    <canvas id="synth-wave-scene" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import AbstractWebgl from '../webgl/AbstractWebgl';
import SynthWaveScene from '../webgl/SynthWaveScene';

let webgl = null as AbstractWebgl | null;

onMounted(() => {
  webgl = new SynthWaveScene('synth-wave-scene');
  webgl.create();
});

onUnmounted(() => {
  webgl?.destroy();
});

</script>

<style scoped lang="scss">
.scene {
  width: 100vh;
  height: 100vh;
}
</style>
