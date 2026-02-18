import Uni from '@uni-helper/plugin-uni'
import UniHelperComponents from '@uni-helper/vite-plugin-uni-components'
import { WotResolver } from '@uni-helper/vite-plugin-uni-components/resolvers'
import UniHelperManifest from '@uni-helper/vite-plugin-uni-manifest'
import UniHelperPages from '@uni-helper/vite-plugin-uni-pages'
import { defineConfig } from 'vite'

export default defineConfig({
  base: './',
  plugins: [
    UniHelperManifest(),
    UniHelperPages({
      dts: 'src/uni-pages.d.ts',
    }),
    UniHelperComponents({
      resolvers: [WotResolver()],
      dts: 'src/components.d.ts',
    }),
    Uni(),
  ],
})
