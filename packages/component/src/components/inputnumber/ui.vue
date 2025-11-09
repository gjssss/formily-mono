<script setup lang="ts">
defineOptions({
  name: 'InputNumberComponent',
  inheritAttrs: false,
})

const props = defineProps<{
  title?: string
  value?: number
  onChange?: (value: number) => void
  min?: number
  max?: number
  step?: number
  precision?: number
  placeholder?: string
  controls?: boolean
  controlsPosition?: '' | 'right'
}>()
</script>

<template>
  <div>
    <div v-if="props.title">
      inputnumber title: {{ props.title }}
    </div>
    <ElInputNumber
      :placeholder="props.placeholder"
      :model-value="props.value"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :precision="props.precision"
      :controls="props.controls"
      :controls-position="props.controlsPosition || undefined"
      @update:model-value="props.onChange"
    />
  </div>
</template>
