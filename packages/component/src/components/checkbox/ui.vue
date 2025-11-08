<script setup lang="ts">
defineOptions({
  name: 'CheckboxComponent',
  inheritAttrs: false,
})

interface Option {
  label: string
  value: string | number
}

const props = defineProps<{
  title?: string
  value?: (string | number)[]
  onChange?: (value: (string | number)[]) => void
  options?: Option[]
}>()
</script>

<template>
  <div>
    <div v-if="props.title">
      checkbox title: {{ props.title }}
    </div>
    <ElCheckboxGroup
      :model-value="props.value"
      @update:model-value="props.onChange"
    >
      <ElCheckbox
        v-for="option in props.options"
        :key="option.value"
        :label="option.value"
      >
        {{ option.label }}
      </ElCheckbox>
    </ElCheckboxGroup>
  </div>
</template>
