<script setup lang="ts">
const props = defineProps<{
  title?: string
}>()
</script>

<template>
  <div>
    <div>array title: {{ props.title }}</div>
    <ElButton>
      添加
    </ElButton>
    <ElButton>
      删除
    </ElButton>
    <div>--------------------------------</div>
    <slot name="array" />
    <div>--------------------------------</div>
    <slot />
  </div>
</template>
