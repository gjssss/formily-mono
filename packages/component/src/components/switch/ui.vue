<script setup lang="ts">
defineOptions({
  name: 'SwitchComponent',
  inheritAttrs: false,
})

const props = defineProps<{
  title?: string
  value?: boolean
  onChange?: (value: boolean) => void
  activeText?: string
  inactiveText?: string
  activeValue?: any
  inactiveValue?: any
  inlinePrompt?: boolean
}>()
</script>

<template>
  <div>
    <div v-if="props.title">
      switch title: {{ props.title }}
    </div>
    <ElSwitch
      :model-value="props.value"
      :active-text="props.activeText"
      :inactive-text="props.inactiveText"
      :active-value="props.activeValue"
      :inactive-value="props.inactiveValue"
      :inline-prompt="props.inlinePrompt"
      @update:model-value="props.onChange"
    />
  </div>
</template>
