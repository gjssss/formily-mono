<script setup lang="ts">
defineOptions({
  name: 'CheckboxComponent',
  inheritAttrs: false,
})

const props = defineProps<{
  title?: string
  value?: (string | number)[]
  onChange?: (value: (string | number)[]) => void
  options?: Option[]
  min?: number
  max?: number
}>()

interface Option {
  label: string
  value: string | number
}
</script>

<template>
  <div>
    <div v-if="props.title">
      checkbox title: {{ props.title }}
    </div>
    <ElCheckboxGroup
      :model-value="props.value"
      :options="props.options"
      :min="props.min"
      :max="props.max"
      @update:model-value="props.onChange"
    />
  </div>
</template>
