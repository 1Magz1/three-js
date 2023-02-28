<template>
  <header class="header">
    <div class="header__btn-wrap">
      <button
        class="btn"
        @click="prevScene"
      />
      <button
        class="btn"
        @click="nextScene"
      />
    </div>
  </header>
</template>

<script setup lang="ts">
import { defineEmits } from 'vue';
import { sceneList } from '../utils/constants';

const emit = defineEmits(['setCurrentScene']);
let sceneIndex = 0;

const prevScene = () => {
  sceneIndex = sceneIndex > 0 ? sceneIndex -= 1 : 0;
  emit('setCurrentScene', sceneList[sceneIndex]);
};

const nextScene = () => {
  sceneIndex = sceneList.length > sceneIndex + 1 ? sceneIndex += 1 : 0;
  emit('setCurrentScene', sceneList[sceneIndex]);
};

</script>

<style scoped lang="scss">
.header {
  width: 100%;
  padding: 12px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(90deg, rgba(9,74,121,0.8) 16%, rgba(0,212,255,0.8) 100%);
}
.btn {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 1px solid #000;
  margin-right: 10px;
  &:after {
    content: '<';
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    font-size: 20px;
    font-weight: 700;
    transform: translate(-50%, -50%);
  }
  &:last-child {
    margin-right: 0;
    &:after {
      content: '>';
    }
  }
}
</style>
