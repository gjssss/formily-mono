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
  type?: 'date' | 'datetime' | 'daterange' | 'datetimerange'
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
      :type="props.type || 'date'"
      @update:model-value="props.onChange"
    />
  </div>
</template>
