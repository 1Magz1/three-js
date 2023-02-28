<template>
  <div class="scene">
    <canvas id="space-scene" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount } from 'vue';
import SpaceScene from '../webgl/SpaceScene';
import AbstractWebgl from '../webgl/AbstractWebgl';

let webgl = null as AbstractWebgl | null;

onMounted(() => {
  webgl = new SpaceScene('space-scene');
  webgl.create();
});

onBeforeUnmount(() => {
  webgl?.destroy();
});

</script>

<style lang="scss">
.scene {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}
</style>
