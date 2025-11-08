<script setup lang="ts">
defineOptions({
  name: 'InputComponent',
  inheritAttrs: false,
})
const props = defineProps<{
  title?: string
  value?: string
  onChange?: (value: string) => void
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
    :model-value="props.value"
    @update:model-value="props.onChange"
  />
</template>
