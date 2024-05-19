import type { UIOptions as FramerUIOptions } from 'framer-plugin'
import { useLayoutEffect, useRef, useState } from 'react'
import { type Dimensions, asNumberOr, useDebounce, useFramerPlugin } from '..'

function getNodeDimensions(parent: HTMLElement, element: HTMLElement): Dimensions {
  const style = getComputedStyle(element)

  element.dataset.framerPluginDuplicate = 'true'
  element.style.visibility = 'hidden'
  element.style.position = 'absolute'
  element.style.width = 'min-content'
  element.style.height = 'min-content'

  parent.appendChild(element)
  const width = element.clientWidth
  const height = element.clientWidth
  element.remove()

  return {
    width: width + asNumberOr(style.marginLeft) + asNumberOr(style.marginRight),
    height: height + asNumberOr(style.marginTop) + asNumberOr(style.marginBottom),
  }
}

interface UIOptions {
  resizable: FramerUIOptions['resizable']
  minWidth?: number
  minHeight?: number
  width: number
  height: number
}

/**
 * Options for the responsive sizer.
 */
interface Options {
  /**
   * Whether to enable UI resizing.
   */
  enabled: boolean
  options: UIOptions
}

/**
 * A hook that enables responsive sizing for an element.
 *
 * @param {Options} options - The options for the responsive sizer.
 * @returns An object containing the element reference and the element size.
 */
export function useAutoSizer({ enabled, options }: Options) {
  const plugin = useFramerPlugin()
  const ref = useRef<HTMLDivElement>(null)

  const haveBeenResized = useRef(false)
  const isCurrentlyResizing = useRef(false)

  const [pluginDimensions, setPluginDimensions] = useState({
    width: options.width,
    height: options.height,
  })

  const updatePluginDimensions = async (type: 'auto' | 'manual' = 'manual', dimensions: Omit<UIOptions, 'resizable'>) => {
    if (type === 'manual' || (type === 'auto' && enabled)) {
      isCurrentlyResizing.current = true

      setPluginDimensions({
        width: dimensions.width,
        height: dimensions.height,
      })

      await plugin.showUI({
        ...dimensions,
        resizable: options.resizable,
      })

      isCurrentlyResizing.current = false
    }
  }

  const handleResize = useDebounce(async (entries: MutationRecord[] | ResizeObserverEntry[]) => {
    if (!ref.current)
      return
    if (entries.length === 0)
      return
    if (isCurrentlyResizing.current)
      return

    if (entries[0] instanceof MutationRecord) {
      if (entries[0].addedNodes.length > 0) {
        const el = entries[0].addedNodes[0] as HTMLElement
        if (el.dataset.framerPluginDuplicate === 'true')
          return
      }
      if (entries[0].removedNodes.length > 0) {
        const el = entries[0].removedNodes[0] as HTMLElement
        if (el.dataset.framerPluginDuplicate === 'true')
          return
      }
    }

    haveBeenResized.current = true

    const style = getComputedStyle(ref.current)

    const paddingX = asNumberOr(style.paddingLeft) + asNumberOr(style.paddingRight)
    const paddingY = asNumberOr(style.paddingTop) + asNumberOr(style.paddingBottom)
    const gapX = asNumberOr(style.columnGap) * (ref.current.childElementCount - 1)
    const gapY = asNumberOr(style.rowGap) * (ref.current.childElementCount - 1)

    const [width, height] = [ref.current.clientWidth, ref.current.clientHeight]

    let childsMinWidth = gapX + paddingX
    let childsHeight = gapY + paddingY

    for (const child of Array.from(ref.current.children)) {
      const childStyle = getComputedStyle(child)
      const dimensions = getNodeDimensions(ref.current!, child.cloneNode(true) as HTMLElement)

      const childWidth = dimensions.width + gapX + paddingX

      if (childWidth > childsMinWidth)
        childsMinWidth = childWidth

      childsHeight += child.clientHeight + asNumberOr(childStyle.marginTop) + asNumberOr(childStyle.marginBottom)
    }

    switch (options.resizable) {
      case true: {
        updatePluginDimensions('auto', { width, height, minWidth: childsMinWidth, minHeight: childsHeight })
        break
      }
      case 'width': {
        updatePluginDimensions('auto', { width, height: childsHeight, minWidth: childsMinWidth, minHeight: childsHeight })
        break
      }
      case 'height': {
        updatePluginDimensions('auto', { width: childsMinWidth, height, minWidth: childsMinWidth, minHeight: childsHeight })
        break
      }
      default: {
        updatePluginDimensions('auto', { width: childsMinWidth, height: childsHeight, minWidth: childsMinWidth, minHeight: childsHeight })
        break
      }
    }
  }, 100)

  useLayoutEffect(() => {
    if (!enabled)
      updatePluginDimensions('manual', options)
  }, [enabled])

  useLayoutEffect(() => {
    if (!enabled)
      return
    if (!ref.current)
      return

    const resizeObserver = new ResizeObserver(handleResize)
    const mutationObserver = new MutationObserver(handleResize)

    mutationObserver.observe(ref.current, {
      childList: true,
      attributes: true,
      attributeFilter: ['style'],
    })

    resizeObserver.observe(ref.current, {
      box: 'border-box',
    })

    return () => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    }
  }, [ref, enabled, options.resizable])

  return { ref, pluginDimensions, updatePluginDimensions }
}
