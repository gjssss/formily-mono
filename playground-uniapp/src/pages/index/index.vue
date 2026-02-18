<script setup lang="ts">
// #ifdef H5
import { Render } from '@formily-djd/designer'
// #endif
import InputComponent from '@/components/input'

const schema = {
  type: 'object',
  properties: {
    f_wgkybduuxr7: {
      'type': 'string',
      'title': '输入框',
      'x-component': 'Input',
      'x-pattern': 'inherit',
      'x-component-props': {
        placeholder: '请输入',
      },
    },
  },
}
</script>

<template>
  <view class="page">
    <view class="title">
      Formily Playground
    </view>
    <Render
      :schema="schema"
      :components="{ Input: InputComponent }"
    />
  </view>
</template>

<style scoped lang="scss">
.page {
  min-height: 100vh;
  padding: 32rpx;
}

.title {
  margin-bottom: 24rpx;
  color: #333;
  font-size: 32rpx;
  font-weight: 600;
}
</style>
