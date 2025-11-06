<script setup lang="ts">
const props = defineProps<{
  title?: string
  placeholder?: string
  maxlength?: string | number
}>()
</script>

<template>
  <div>
    <div>input title: {{ props.title }}</div>
  </div>
  <ElInput
    :placeholder="props.placeholder"
    :maxlength="props.maxlength"
    :disabled="Number(props.maxlength) < 100"
  />
</template>
