import { tryOnScopeDispose } from '@vueuse/core'
import { createTooltip } from 'floating-vue'

import type { SchemeTrigger } from '@/entities/exercise'
import { useExerciseStore } from '@/entities/exercise'
import { useTriggerElementStore } from '@/features/trigger-element'

export function useRegisterTrigger(scheme: Ref<SVGElement | undefined>, trigger: SchemeTrigger): void {
  const { interact } = useTriggerElementStore()
  const exercise = useExerciseStore()

  const element = computed(() => (scheme.value as unknown as Document)?.getElementById(trigger.id))

  useEventListener(element, 'mousedown', (ev) => {
    ev.preventDefault()
    ev.stopPropagation()
  })

  useEventListener(element, 'click', (ev) => {
    if (trigger.effect === 'input') {
      ev.preventDefault()
      ev.stopPropagation()
      activateInput(element.value as SVGGElement, trigger, exercise)
      return
    }

    if (trigger.effect === 'range') {
      ev.preventDefault()
      ev.stopPropagation()
      // console.debug(`[range] click ignored (immediate=${trigger.immediate}) for`, trigger.id)
      return
    }

    interact(trigger)
  })

  const statusText = computed(() => {
    if (trigger.remoteHint) { return null }

    const state = exercise?.state?.[trigger.id]
    if (typeof state === 'string') { return state }
    if (state?.status) { return state.status }

    return trigger.name
  })

  let cleanup: (() => void) | null = null

  whenever(element, (el) => {
    cleanup?.()

    el.classList.add('trigger', `effect-${trigger.effect ?? 'default'}`)

    let currentTooltip: any = null

    const cleanTooltip = () => {
      currentTooltip?.hide?.()
      currentTooltip?.destroy?.()
      currentTooltip = null
    }

    const tooltip = () => {
      cleanTooltip()

      currentTooltip = createTooltip(el, {
        content: statusText.value,
        delay: { show: 100 },
        placement: 'top',
        triggers: [],
      }) as any

      currentTooltip.show?.()
    }

    const showTooltip = () => {
      if (!statusText.value)
        return

      if (currentTooltip)
        return

      tooltip()
    }

    const hideTooltip = () => {
      cleanTooltip()
    }

    el.addEventListener('mouseenter', showTooltip)
    el.addEventListener('mouseleave', hideTooltip)

    cleanup = () => {
      el.removeEventListener('mouseenter', showTooltip)
      el.removeEventListener('mouseleave', hideTooltip)
    }
  })
}

function activateInput(g: SVGGElement, trigger: SchemeTrigger, exercise: ReturnType<typeof useExerciseStore>) {
  const rect = g.querySelector('rect')
  if (!rect) {
    return
  }

  const { x, y, width, height } = rect.getBBox()

  const foreign = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
  foreign.setAttribute('x', String(x))
  foreign.setAttribute('y', String(y))
  foreign.setAttribute('width', String(width))
  foreign.setAttribute('height', String(height))

  const div = document.createElement('div')
  div.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')

  const input = document.createElement('input')
  input.style.cssText = `
    width:100%;
    height:100%;
    border:none;
    outline:none;
    text-align:center;
    font-size:8px;
  `

  div.appendChild(input)
  foreign.appendChild(div)
  g.appendChild(foreign)
  input.focus()

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      exercise.send({
        type: `${trigger.id}.input.submit`,
        value: input.value,
        expected: trigger.expected ?? null,
      } as any)
      g.removeChild(foreign)
    }
  })

  const onClickOutsideInput = (e: MouseEvent) => {
    if (!foreign.contains(e.target as Node)) {
      g.removeChild(foreign)
      document.removeEventListener('click', onClickOutsideInput)
    }
  }

  document.addEventListener('click', onClickOutsideInput)
}

function activateRange(
  g: SVGGElement,
  trigger: SchemeTrigger,
  exercise: ReturnType<typeof useExerciseStore>,
) {
  const svg = g.ownerSVGElement || g.closest('svg')
  if (!svg)
    return

  const track = svg.getElementById('Rectangle91') as SVGRectElement | null
  const sliderGroup = svg.getElementById('Rectangle92') as SVGGElement | null

  if (!track || !sliderGroup) {
    console.warn('Track or slider not found', { track, sliderGroup })
    return
  }

  const sliderRect = sliderGroup.querySelector('rect') as SVGRectElement | null
  const sliderBox = sliderRect ? sliderRect.getBBox() : sliderGroup.getBBox()
  const trackBox = track.getBBox()

  const minRel = 0
  const maxRel = Math.max(0, trackBox.width - sliderBox.width)

  let currentRel = 0

  const applyPercent = (percent: number) => {
    const clamped = Math.min(100, Math.max(0, percent))
    const newRel = (clamped / 100) * maxRel
    currentRel = newRel
    sliderGroup.setAttribute('transform', `translate(${newRel}, 0)`)
  }

  const indicatorId = trigger.indicatorId
  if (indicatorId) {
    const indicator = svg.getElementById(indicatorId)
    if (indicator) {
      const textNode = indicator.querySelector('text')
      if (textNode?.textContent) {
        const val = Number.parseFloat(textNode.textContent.replace(',', '.'))
        if (!isNaN(val))
          applyPercent(val)
      }
    }

    // подписка на изменения в exercise.state[indicatorId]
    if (!(sliderGroup as any).__indicatorWatchAttached) {
      watch(
        () => exercise.state?.[indicatorId]?.text,
        (newVal) => {
          const val = Number.parseFloat(String(newVal).replace(',', '.'))
          if (!isNaN(val))
            applyPercent(val)
        },
        { immediate: true },
      )
      ;(sliderGroup as any).__indicatorWatchAttached = true
    }
  }

  const clientToSvg = (clientX: number, clientY: number) => {
    const p = svg.createSVGPoint()
    p.x = clientX
    p.y = clientY
    const ctm = svg.getScreenCTM()
    if (!ctm)
      return { x: clientX, y: clientY }
    return p.matrixTransform(ctm.inverse())
  }

  let dragging = false
  let startSvgX = 0
  let startRel = 0
  let activePointerId: number | null = null

  const onPointerMove = (ev: PointerEvent) => {
    if (!dragging)
      return
    const pt = clientToSvg(ev.clientX, ev.clientY)
    const dxSvg = pt.x - startSvgX
    let newRel = startRel + dxSvg
    if (newRel < minRel)
      newRel = minRel
    if (newRel > maxRel)
      newRel = maxRel

    sliderGroup.setAttribute('transform', `translate(${newRel}, 0)`)

    const percent = maxRel === 0 ? 0 : (newRel / maxRel) * 100
    exercise.send({
      type: `${trigger.id}.range.change`,
      value: percent,
      expected: trigger.expected ?? null,
      trigger,
    } as any)
  }

  const onPointerUp = (ev: PointerEvent) => {
    if (!dragging)
      return
    dragging = false
    try {
      if (typeof (sliderGroup as any).releasePointerCapture === 'function' && activePointerId != null) {
        ;(sliderGroup as any).releasePointerCapture(activePointerId)
      }
    }
    catch (e) {}
    document.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('pointerup', onPointerUp)

    sliderGroup.style.cursor = 'grab'
    activePointerId = null

    const transform = sliderGroup.getAttribute('transform') || ''
    const match = transform.match(/translate\(\s*([-\d.]+)/)
    if (match)
      currentRel = Math.max(minRel, Math.min(maxRel, Number.parseFloat(match[1])))

    const percent = maxRel === 0 ? 0 : (currentRel / maxRel) * 100

    console.log(trigger.immediate)

    ///////////////
    // input.addEventListener('keydown', (e) => {
    //     if (e.key === 'Enter') {
    //       exercise.send({
    //         type: `${trigger.id}.input.submit`,
    //         value: input.value,
    //         expected: trigger.expected ?? null,
    //       } as any)
    //       g.removeChild(foreign)
    //     }
    //   })
    if (trigger.immediate) {
      exercise.send({
        type: `${trigger.id}.range.change`,
        value: percent,
        expected: trigger.expected ?? null,
        trigger,
      } as any)
    }
    // else {
    //   exercise.send({
    //     type: `${trigger.id}.range.submit`,
    //     value: percent,
    //   } as any)
    // }
  }

  const onPointerDown = (ev: PointerEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
    const pt = clientToSvg(ev.clientX, ev.clientY)
    dragging = true
    startSvgX = pt.x
    startRel = currentRel
    activePointerId = ev.pointerId

    try {
      if (typeof (sliderGroup as any).setPointerCapture === 'function') {
        ;(sliderGroup as any).setPointerCapture(ev.pointerId)
      }
    }
    catch (e) {}

    document.addEventListener('pointermove', onPointerMove)
    document.addEventListener('pointerup', onPointerUp)
    sliderGroup.style.cursor = 'grabbing'
  }

  if (!(sliderGroup as any).__rangePointerDownAttached) {
    sliderGroup.addEventListener('pointerdown', onPointerDown)
    ;(sliderGroup as any).__rangePointerDownAttached = true
  }

  const onWheel = (ev: WheelEvent) => {
    ev.preventDefault()
    ev.stopPropagation()
    const delta = ev.deltaY > 0 ? -5 : 5
    let newRel = currentRel + delta
    if (newRel < minRel)
      newRel = minRel
    if (newRel > maxRel)
      newRel = maxRel
    currentRel = newRel
    sliderGroup.setAttribute('transform', `translate(${newRel}, 0)`)

    const percent = maxRel === 0 ? 0 : (newRel / maxRel) * 100

    // input.addEventListener('keydown', (e) => {
    //     if (e.key === 'Enter') {
    //       exercise.send({
    //         type: `${trigger.id}.input.submit`,
    //         value: input.value,
    //         expected: trigger.expected ?? null,
    //       } as any)
    //       g.removeChild(foreign)
    //     }
    //   })
    exercise.send({
      type: `${trigger.id}.range.change`,
      value: percent,
      expected: trigger.expected ?? null,
      trigger,
    } as any)
  }

  if (!(sliderGroup as any).__wheelListenerAttached) {
    sliderGroup.addEventListener('wheel', onWheel, { passive: false })
    track.addEventListener('wheel', onWheel, { passive: false })
    ;(sliderGroup as any).__wheelListenerAttached = true
  }

  sliderGroup.style.cursor = 'grab'
}
