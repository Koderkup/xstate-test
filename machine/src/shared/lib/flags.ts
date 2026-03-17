function checkWebGL(): boolean {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') ?? canvas.getContext('experimental-webgl')
  return Boolean(gl instanceof WebGLRenderingContext)
}

const params = new URLSearchParams(location.search)
const FLAGS = {
  admin: !_.isNil(params.get('admin')),
  debug: !_.isNil(params.get('debug')),
  animate: _.isNil(params.get('no-animate')) && checkWebGL(),
} as const

export const useFlags = createGlobalState(() => {
  const flags = shallowRef(FLAGS)

  function get<K extends keyof typeof FLAGS>(key: K): typeof FLAGS[K] {
    return flags.value[key]
  }

  return {
    flags: readonly(flags),

    get,
  }
})
