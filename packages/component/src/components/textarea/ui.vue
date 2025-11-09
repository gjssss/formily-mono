<script setup lang="ts">
defineOptions({
  name: 'TextAreaComponent',
  inheritAttrs: false,
})

const props = defineProps<{
  title?: string
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  rows?: number
  maxlength?: string | number
  showWordLimit?: boolean
  autosize?: boolean | { minRows?: number, maxRows?: number }
  resize?: 'none' | 'vertical' | 'horizontal' | 'both'
}>()
</script>

<template>
  <div>
    <div v-if="props.title">
      textarea title: {{ props.title }}
    </div>
    <ElInput
      type="textarea"
      :placeholder="props.placeholder"
      :rows="props.rows"
      :maxlength="props.maxlength"
      :show-word-limit="props.showWordLimit"
      :autosize="props.autosize"
      :resize="props.resize"
      :model-value="props.value"
      @update:model-value="props.onChange"
    />
  </div>
</template>
