import { defineManifestConfig } from '@uni-helper/vite-plugin-uni-manifest'

export default defineManifestConfig({
  'name': 'playground-uniapp',
  'appid': '__UNI__PLAYGROUND_UNIAPP__',
  'description': 'Minimal uni-app playground',
  'versionName': '1.0.0',
  'versionCode': '100',
  'transformPx': false,
  'mp-weixin': {
    appid: '',
    setting: {
      urlCheck: false,
    },
    usingComponents: true,
  },
  'h5': {},
  'vueVersion': '3',
})
