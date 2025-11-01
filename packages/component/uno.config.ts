import {
  defineConfig,
  presetIcons,
  presetWind3,
  transformerDirectives,
} from 'unocss'

const PREFIX = 'custom-comp'

export default defineConfig({
  postprocess: [(util) => {
    // 在生成的规则中添加前缀
    if (util.selector && !util.selector.startsWith(`.${PREFIX}`)) {
      util.selector = `.${PREFIX}${util.selector}, .${PREFIX} ${util.selector}`
    }
  }],
  shortcuts: [
    {
      'color-base': 'color-neutral-800 dark:color-neutral-300',
      'bg-base': 'bg-white dark:bg-#111',
      'bg-secondary': 'bg-#eee dark:bg-#222',
      'border-base': 'border-#8882',
      'ring-base': 'ring-#8882',
    },
  ],
  presets: [
    // Currently we need to use Wind3, as Shadow DOM does not support @property declarations
    presetWind3({
      preflight: false,
    }),
    presetIcons({
      warn: true,
    }),
  ],
  transformers: [
    // This enable using of `--uno` and `--at-apply` directives in custom CSS.
    transformerDirectives(),
  ],
})
