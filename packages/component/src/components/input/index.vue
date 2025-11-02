<script setup lang="ts">
import { useField } from '@formily/vue'

const field = useField()
</script>

<template>
  <ElInput
    :placeholder="field.componentProps?.placeholder"
    :maxlength="field.componentProps?.maxlength"
    :disabled="field.pattern === 'disabled'"
  />
</template>
