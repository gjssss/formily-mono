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
  showWordLimit?: boolean
  clearable?: boolean
  prefixIcon?: string
  suffixIcon?: string
}>()
</script>

<template>
  <div>
    <div v-if="props.title">
      input title: {{ props.title }}
    </div>
    <ElInput
      :placeholder="props.placeholder"
      :maxlength="props.maxlength"
      :show-word-limit="props.showWordLimit"
      :clearable="props.clearable"
      :prefix-icon="props.prefixIcon"
      :suffix-icon="props.suffixIcon"
      :model-value="props.value"
      @update:model-value="props.onChange"
    />
  </div>
</template>
