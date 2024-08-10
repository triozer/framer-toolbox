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

/**
 * The options of the UI interface.
 *
 * @public
 */
export interface Options {
  /** The position of the UI interface. */
  resizable: boolean | 'width' | 'height'
  /** The min width of the UI interface. */
  minWidth?: number
  /** The min height of the UI interface. */
  minHeight?: number
  /** The width of the UI interface. */
  width: number
  /** The height of the UI interface. */
  height: number
}

/**
 * Options for the useAutoSizer hook.
 *
 * @public
 */
export interface AutoSizerOptions {
  /** Whether the auto sizer is enabled. */
  enabled: boolean
  /**
   * The options of the UI interface.
   *
   * @see {@link Options}
   */
  options: Options
}

/**
 * The return type of the useAutoSizer hook.
 *
 * @public
 */
export interface AutoSizerReturn {
  /** The reference of the element to resize. */
  ref: React.MutableRefObject<HTMLDivElement | null>
  /**
   * The dimensions of the plugin.
   *
   * @see {@link Dimensions}
   */
  pluginDimensions: Dimensions
  /** The function to update the plugin dimensions. */
  updatePluginDimensions: (type: 'auto' | 'manual', dimensions: Omit<Options, 'resizable'>) => Promise<void>
}

/**
 * A hook that enables responsive sizing for an element.
 *
 * @example
 * ```tsx
 * const { ref, pluginDimensions, updatePluginDimensions } = useAutoSizer({ enabled: true, options: { resizable: true, width: 300, height: 400 } })
 * ```
 *
 * @public
 * @kind hook
 */
export function useAutoSizer({ enabled, options }: AutoSizerOptions): AutoSizerReturn {
  const plugin = useFramerPlugin()

  const ref = useRef<HTMLDivElement>(null)

  const haveBeenResized = useRef(false)
  const isCurrentlyResizing = useRef(false)

  const [pluginDimensions, setPluginDimensions] = useState<Dimensions>({
    width: options.minWidth ?? options.width,
    height: options.minHeight ?? options.height,
  })

  const updatePluginDimensions = async (type: 'auto' | 'manual' = 'manual', dimensions: Omit<Options, 'resizable'>) => {
    if (type === 'manual' || (type === 'auto' && enabled)) {
      isCurrentlyResizing.current = true

      const width = Math.max(dimensions.width, options.minWidth ?? 0)
      const height = Math.max(dimensions.height, options.minHeight ?? 0)

      setPluginDimensions({
        width,
        height,
      })

      const minWidth = Math.max(options.minWidth ?? 0, dimensions.minWidth ?? 0) || undefined
      const minHeight = Math.max(options.minHeight ?? 0, dimensions.minHeight ?? 0) || undefined

      await plugin.showUI({
        width,
        height,
        minHeight,
        minWidth,
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
      case 'width': {
        updatePluginDimensions('auto', { width, height: childsHeight, minWidth: childsMinWidth, minHeight: childsHeight })
        break
      }
      case 'height': {
        updatePluginDimensions('auto', { width: childsMinWidth, height, minWidth: childsMinWidth, minHeight: childsHeight })
        break
      }
      default: {
        const isWidthSet = !Number.isNaN(asNumberOr(ref.current.style.width, Number.NaN))
        const isHeightSet = !Number.isNaN(asNumberOr(ref.current.style.height, Number.NaN))

        if (isWidthSet && isHeightSet) {
          updatePluginDimensions('auto', { width, height, minWidth: childsMinWidth, minHeight: childsHeight })
        }
        else if (isWidthSet) {
          updatePluginDimensions('auto', { width, height: childsHeight, minWidth: childsMinWidth, minHeight: childsHeight })
        }
        else if (isHeightSet) {
          updatePluginDimensions('auto', { width: childsMinWidth, height, minWidth: childsMinWidth, minHeight: childsHeight })
        }
        else {
          updatePluginDimensions('auto', { width: childsMinWidth, height: childsHeight, minWidth: childsMinWidth, minHeight: childsHeight })
        }

        break
      }
    }
  }, 100)

  useLayoutEffect(() => {
    if (!ref.current)
      return
    if (!enabled)
      updatePluginDimensions('manual', options)
  }, [ref, enabled])

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
