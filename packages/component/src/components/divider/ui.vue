<script setup lang="ts">
defineOptions({
  name: 'Divider',
  inheritAttrs: false,
})

const props = defineProps<{
  orientation?: 'horizontal' | 'vertical'
  dashed?: boolean
}>()
</script>

<template>
  <div
    class="formily-divider"
    :class="{
      'divider-horizontal': props.orientation === 'horizontal',
      'divider-vertical': props.orientation === 'vertical',
      'divider-dashed': props.dashed,
    }"
  />
</template>

<style scoped>
.formily-divider {
  border: 0;
  border-top: 1px solid #e5e7eb;
  margin: 16px 0;
}

.divider-horizontal {
  width: 100%;
  height: 0;
}

.divider-vertical {
  width: 0;
  height: 100%;
  border-top: 0;
  border-left: 1px solid #e5e7eb;
  margin: 0 16px;
  display: inline-block;
}

.divider-dashed {
  border-style: dashed;
}
</style>
