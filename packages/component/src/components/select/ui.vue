<script setup lang="ts">
defineOptions({
  name: 'SelectComponent',
  inheritAttrs: false,
})

const props = defineProps<{
  title?: string
  value?: string | number
  onChange?: (value: string | number) => void
  placeholder?: string
  options?: Option[]
  multiple?: boolean
  clearable?: boolean
  filterable?: boolean
  allowCreate?: boolean
}>()

interface Option {
  label: string
  value: string | number
}
</script>

<template>
  <div>
    <div v-if="props.title">
      select title: {{ props.title }}
    </div>
    <ElSelect
      :placeholder="props.placeholder"
      :model-value="props.value"
      :multiple="props.multiple"
      :clearable="props.clearable"
      :filterable="props.filterable"
      :allow-create="props.allowCreate"
      @update:model-value="props.onChange"
    >
      <ElOption
        v-for="option in props.options"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </ElSelect>
  </div>
</template>
