<script setup lang="ts">
import { provide } from 'vue'
import { ArrayItemKey } from '@/shared'

const props = defineProps<{
  index?: number
}>()

provide(ArrayItemKey, props)
</script>

<template>
  <slot />
</template>

<style>

</style>
