<script setup lang="ts">
const props = defineProps<{
  title: string
  placeholder: string
  maxlength: string
}>()
</script>

<template>
  <ElInput
    :placeholder="props.placeholder"
    :maxlength="props.maxlength"
    :disabled="Number(props.maxlength) < 100"
  />
</template>
