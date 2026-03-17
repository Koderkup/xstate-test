import type { CSSProperties } from 'vue'

import type { SchemeIndicatorAttribute, SchemeIndicatorParams, SchemeIndicatorState } from '@/entities/exercise'
import { useSettingsStore } from '@/entities/settings'

const operations = {
  findOne(scheme: SVGElement, id: string): Element {
    return (scheme as unknown as Document).getElementById(id)!
  },

  find(scheme: SVGElement, id: string, group?: string): Element[] {
    const elements = [this.findOne(scheme, id)]

    if (!elements[0]) {
      console.warn(`Элемент ${id} не найден`)
      return []
    }

    if (group) {
      elements.push(...elements[0]!.querySelectorAll(group))
    }

    return elements.filter(Boolean) as Element[]
  },

  get<K extends string>(element: Element, attrs: K[]): Record<K, string> {
    return _.fromPairs(attrs.map(key => [key, element.getAttribute(key)!])) as any
  },

  set(element: Element[] | Element, attrs: Record<string, unknown>): void {
    [element].flat().forEach((el) => {
      _.forEach(attrs, (value, key) => el.setAttribute(key, String(value)))
    })
  },

  style(element: Element[] | Element, attrs: CSSProperties): void {
    [element as HTMLElement].flat().forEach((el) => {
      _.forEach(attrs, (value, key) => el.style[key as any] = value as any)
    })
  },

  create(scheme: SVGElement, name: keyof SVGElementTagNameMap, attrs: Record<string, unknown>): Element {
    const element = scheme.ownerDocument.createElementNS('http://www.w3.org/2000/svg', name)
    operations.set(element, attrs)
    return element
  },
}

type IndicatorUpdater = {
  [A in SchemeIndicatorAttribute]: (
    scheme: SVGElement,
    id: string,
    params: Exclude<SchemeIndicatorParams[A], undefined>,
    value: Exclude<SchemeIndicatorState[A], undefined>,
  ) => void
}

export const updater: IndicatorUpdater = {
  color(scheme, id, params, value) {
    const settings = useSettingsStore()

    const elements = operations.find(scheme, id, params.group)
    const color = value.startsWith('#') ? value : settings.get('colors', value as any)

    operations.style(elements, {
      fill: color,
    })
  },

  text(scheme, id, params, value) {
    const prev = operations.findOne(scheme, params.textId)
    const prevAttrs = operations.get(prev, ['font-size', 'font-family', 'font-weight', 'letter-spacing', 'fill'])
    prev.remove()

    const container = operations.findOne(scheme, id)
    const { x, y, width, height } = operations.get(container, ['x', 'y', 'width', 'height'])

    const text = operations.create(scheme, 'text', {
      ...prevAttrs,
      'id': params.textId,
      'x': Number(x) + Number(width) / 2,
      'y': Number(y) + Number(height) / 2 + Number(height) * 0.1,
      'dominant-baseline': 'middle',
      'text-anchor': 'middle',
    })
    text.textContent = String(value)

    container.parentNode?.appendChild(text)
  },

  rotate(scheme, id, params, value) {
    const element = operations.findOne(scheme, id)

    operations.style(element, {
      'rotate': `${value}deg`,
      'transform-origin': params.origin,
    })
  },

  scale(scheme, id, params, value) {
    const element = operations.findOne(scheme, id)

    operations.style(element, {
      'scale': params.axis === 'x' ? `${value} 1` : params.axis === 'y' ? `1 ${value}` : `${value} ${value}`,
      'transform-origin': params.origin,
    })
  },

  range(scheme, id, params, value) {
    const relative = (value - params.value[0]) / (params.value[1] - params.value[0])

    if (params.size) {
      this.scale(scheme, id, params.size, relative)
    }

    if (params.color) {
      const color = { h: 0, s: 100, l: 50 } as any
      for (const [component, value] of _.entries(params.color.hsl)) {
        if (_.isArray(value)) {
          color[component] = ((value[1] - value[0]) * relative) + value[0]
        }
        else if (_.isNumber(value)) {
          color[component] = value
        }
      }

      this.color(scheme, id, params.color, `hsl(${color.h}, ${color.s}%, ${color.l}%)` as any)
    }
  },

  // Чтобы ошбика не летела. По факту это функция тут не нужна.
  status(scheme, id, params, value) {
    return
  },
}
