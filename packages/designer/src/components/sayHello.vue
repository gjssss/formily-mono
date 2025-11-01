<script setup lang="ts">
import { ref } from 'vue'

const text = ref('say')
</script>

<template>
  <div>
    {{ text }}
    <button @click="text = 'say hello'">
      click
    </button>
  </div>
</template>

<style></style>
