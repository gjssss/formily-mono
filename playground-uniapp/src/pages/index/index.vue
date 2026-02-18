<script setup lang="ts">
import { ref } from 'vue'

definePage({
  style: {
    navigationBarTitleText: 'Playground 首页',
  },
})

const count = ref(0)
</script>

<template>
  <view class="page">
    <view class="title">
      Wot Design Uni Playground
    </view>
    <wd-button type="primary" @click="count += 1">
      点击次数：{{ count }}
    </wd-button>
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
