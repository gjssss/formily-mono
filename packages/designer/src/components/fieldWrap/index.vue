<script setup lang="ts">
const props = defineProps<{
  selectedKey: string
  fieldKey: string
}>()
const emit = defineEmits<{
  (e: 'update:selectedKey', value: string): void
}>()

function handleSelect() {
  console.log('handleSelect', props.fieldKey)
  emit('update:selectedKey', props.fieldKey)
}
</script>

<template>
  <div @click="handleSelect">
    <slot />
  </div>
</template>

<style></style>
