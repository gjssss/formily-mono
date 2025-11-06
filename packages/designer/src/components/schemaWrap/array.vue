<script setup lang="ts">
import type { ISchema } from '@formily/json-schema'
import { RecursionField } from '@formily/vue'

defineProps<{
  items: ISchema
}>()
</script>

<template>
  <RecursionField :schema="items" only-render-properties />
</template>

<style>

</style>
