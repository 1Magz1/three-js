<template>
  <div class="page">
    <div class="page__header">
      <HeaderComponent @set-current-scene="setCurrentScene" />
    </div>
    <div class="page__content">
      <component :is="scene" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, markRaw } from 'vue';
import SynthWaveScene from './components/SynthWaveScene.vue';
import HeaderComponent from './components/HeaderComponent.vue';

const scene = ref('');
scene.value = markRaw(SynthWaveScene);

const setCurrentScene = (value: any) => {
  scene.value = markRaw(value);
};
</script>
