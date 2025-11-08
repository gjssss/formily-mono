<script setup lang="ts">
import { useField } from '@formily/vue'
import { provide } from 'vue'
import { ArrayFieldKey } from '@/shared'

defineOptions({
  name: 'ArrayInner',
  inheritAttrs: false,
})
const field = useField()
provide(ArrayFieldKey, field)
</script>

<template>
  <slot />
</template>

<style>

</style>
