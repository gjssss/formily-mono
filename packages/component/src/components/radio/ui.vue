<script setup lang="ts">
defineOptions({
  name: 'RadioComponent',
  inheritAttrs: false,
})

const props = defineProps<{
  title?: string
  value?: string | number
  onChange?: (value: string | number | boolean | undefined) => void
  options?: Option[]
}>()

interface Option {
  label: string
  value: string | number
}
</script>

<template>
  <div>
    <div v-if="props.title">
      radio title: {{ props.title }}
    </div>
    <ElRadioGroup
      :model-value="props.value"
      @update:model-value="(value) => props.onChange?.(value)"
    >
      <ElRadio
        v-for="option in props.options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </ElRadio>
    </ElRadioGroup>
  </div>
</template>
