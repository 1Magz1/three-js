<template>
  <canvas id="space-scene" />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import SpaceScene from '../webgl/SpaceScene';

onMounted(() => {
  const webgl = new SpaceScene();
  webgl.create();
});
</script>
