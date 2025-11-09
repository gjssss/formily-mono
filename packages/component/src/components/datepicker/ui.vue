<script setup lang="ts">
defineOptions({
  name: 'DatePickerComponent',
  inheritAttrs: false,
})

const props = defineProps<{
  title?: string
  value?: string | Date
  onChange?: (value: string | Date) => void
  placeholder?: string
  format?: string
  valueFormat?: string
  type?: 'date' | 'datetime' | 'daterange' | 'datetimerange' | 'year' | 'month' | 'week'
  clearable?: boolean
  editable?: boolean
}>()
</script>

<template>
  <div>
    <div v-if="props.title">
      datepicker title: {{ props.title }}
    </div>
    <ElDatePicker
      :placeholder="props.placeholder"
      :model-value="props.value"
      :format="props.format"
      :value-format="props.valueFormat"
      :type="props.type || 'date'"
      :clearable="props.clearable"
      :editable="props.editable"
      @update:model-value="props.onChange"
    />
  </div>
</template>
