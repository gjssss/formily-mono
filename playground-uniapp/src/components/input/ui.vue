<script setup lang="ts">
const props = defineProps<{
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}>()
</script>

<template>
  <wd-input
    :model-value="props.value"
    :placeholder="props.placeholder"
    @update:model-value="props.onChange"
  />
</template>
