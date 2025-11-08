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
      @update:model-value="props.onChange"
    />
  </div>
</template>
