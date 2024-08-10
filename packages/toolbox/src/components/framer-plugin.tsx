import React, { useEffect, useImperativeHandle, useMemo, useRef, useState } from 'react'
import type { UIOptions } from 'framer-plugin'
import cx from 'classnames'

import { useAutoSizer } from '../hooks/auto-sizer'
import { useFramerPlugin } from '../providers'

import classes from './framer-plugin.module.css'

/**
 * The properties of the FramerPlugin component.
 *
 * @public
 */
export interface FramerPluginProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The name of the plugin.
   *
   * @remarks
   * If set, it will override the name from the plugin provider.
   */
  name?: string
  /**
   * Whether the plugin should auto resize.
   *
   * @defaultValue false
   */
  autoResize?: boolean
  /**
   * The options of the UI interface.
   *
   * @defaultValue \{ position: 'top right', width: 240, height: 95 \}
   */
  uiOptions?: Omit<UIOptions, 'title'>
  /**
   * Whether the plugin should show on mounted.
   *
   * @defaultValue true
   */
  showOnMounted?: boolean
}

/**
 * Default properties for the FramerPlugin component.
 */
const defaultProps: Omit<FramerPluginProps, keyof React.HTMLAttributes<HTMLDivElement>> = {
  name: 'Framer Plugin',
  autoResize: false,
  showOnMounted: true,
  uiOptions: {
    position: 'top right',
    width: 240,
    height: 95,
  },
}

/**
 * A component that integrates with Framer to provide plugin functionality.
 *
 * @remarks
 * When using this component, it manages padding and gap for UI interface.
 *
 * @example
 * ```tsx
 * <FramerPlugin name="My Plugin" autoResize={true} showOnMounted={false} uiOptions={{ position: 'bottom left', width: 300, height: 100 }}>
 *   <div>Plugin Content</div>
 * </FramerPlugin>
 * ```
 *
 * @public
 * @kind component
 */
const FramerPlugin = React.forwardRef<HTMLDivElement, FramerPluginProps>(
  (
    {
      children,
      name,
      autoResize = defaultProps.autoResize,
      showOnMounted = defaultProps.showOnMounted,
      uiOptions = defaultProps.uiOptions,
      ...props
    },
    ref,
  ) => {
    const plugin = useFramerPlugin()

    const hasMountedOnce = useRef(false)

    const [mergedProps, setMergedProps] = useState(() => ({
      ...defaultProps,
      ...plugin,
      name: name ?? plugin?.name ?? defaultProps.name,
      autoResize,
      showOnMounted,
      uiOptions: {
        ...defaultProps.uiOptions,
        ...uiOptions,
      },
    }))

    useEffect(() => {
      setMergedProps(prevProps => ({
        ...prevProps,
        name: name ?? plugin?.name ?? defaultProps.name,
        autoResize,
        showOnMounted,
        uiOptions: {
          ...prevProps.uiOptions,
          ...uiOptions,
        },
      }))
    }, [
      name,
      autoResize,
      showOnMounted,
      uiOptions,
      plugin,
    ])

    const mainRef = useRef<HTMLDivElement>(null)

    useImperativeHandle(ref, () => {
      return mainRef.current!
    }, [])

    useAutoSizer(
      mainRef,
      {
        enabled: mergedProps.autoResize!,
        options: {
          width: mergedProps.uiOptions.width!,
          height: mergedProps.uiOptions.height!,
          resizable: mergedProps.uiOptions.resizable ?? false,
          minWidth: mergedProps.uiOptions.minWidth,
          minHeight: mergedProps.uiOptions.minHeight,
        },
      },
    )

    useEffect(() => {
      if (!mergedProps.showOnMounted || hasMountedOnce.current) {
        return
      }

      plugin.showUI(mergedProps.uiOptions)
      hasMountedOnce.current = true
    }, [mergedProps.showOnMounted])

    useEffect(() => {
      if (!mainRef.current) {
        return
      }

      plugin.showUI({ resizable: mergedProps.uiOptions.resizable })
    }, [mergedProps.uiOptions.resizable])

    return (
      <main
        ref={mainRef}
        {...props}
        className={cx(classes.framerPlugin, props.className)}
      >
        {children}
      </main>
    )
  },
)

export { FramerPlugin }
