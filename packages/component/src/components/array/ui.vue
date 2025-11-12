<script setup lang="ts">
defineOptions({
  name: 'Array',
  inheritAttrs: false,
})
const props = defineProps<{
  title?: string
  onAdd?: () => void
  onPush?: () => void
  onUnshift?: () => void
}>()
</script>

<template>
  <div>
    <div>array title: {{ props.title }}</div>
    <div style="margin-bottom: 10px;">
      <ElButton @click="props.onAdd">
        添加到末尾
      </ElButton>
      <ElButton style="margin-left: 8px;" @click="props.onUnshift">
        添加到开头
      </ElButton>
    </div>
    <div>--------------------------------</div>
    <slot />
    <div>--------------------------------</div>
  </div>
</template>
