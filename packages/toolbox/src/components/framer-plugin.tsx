import React, { useEffect, useRef, useState } from 'react'
import type { UIOptions } from 'framer-plugin'
import cx from 'classnames'

import { useAutoSizer } from '../hooks/auto-sizer'
import { useFramerPlugin } from '../providers'

import classes from './framer-plugin.module.css'

interface FramerPluginRealProps {
  name: string
  autoResize: boolean
  uiOptions: Omit<UIOptions, 'title'>
  showOnMounted: boolean
}

const defaultProps: FramerPluginRealProps = {
  name: 'Framer Plugin',
  autoResize: false,
  showOnMounted: true,
  uiOptions: {
    position: 'top right',
    width: 240,
    height: 95,
  },
}

type FramerPluginProps = {
  children?: React.ReactNode
} & Partial<FramerPluginRealProps> &
React.HTMLAttributes<HTMLDivElement>

const FramerPlugin = React.forwardRef<HTMLDivElement, FramerPluginProps>(
  (
    {
      children,
      name,
      autoResize,
      showOnMounted,
      uiOptions,
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
      autoResize: autoResize ?? defaultProps.autoResize,
      showOnMounted: showOnMounted ?? defaultProps.showOnMounted,
      uiOptions: {
        ...defaultProps.uiOptions,
        ...uiOptions,
      },
    }))

    useEffect(() => {
      setMergedProps(prevProps => ({
        ...prevProps,
        name: name ?? plugin?.name ?? defaultProps.name,
        autoResize: autoResize ?? defaultProps.autoResize,
        showOnMounted: showOnMounted ?? defaultProps.showOnMounted,
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

    const { ref: mainRef } = useAutoSizer(
      {
        enabled: mergedProps.autoResize,
        options: {
          width: mergedProps.uiOptions.width!,
          height: mergedProps.uiOptions.height!,
          resizable: mergedProps.uiOptions.resizable,
          minWidth: mergedProps.uiOptions.minWidth,
          minHeight: mergedProps.uiOptions.minHeight,
        },
      },
    )

    useEffect(() => {
      if (mergedProps.autoResize && mergedProps.uiOptions.resizable)
        return

      if (mergedProps.showOnMounted && !hasMountedOnce.current) {
        plugin.showUI(mergedProps.uiOptions)
        hasMountedOnce.current = true
      }
    }, [mergedProps.showOnMounted])

    useEffect(() => {
      plugin.showUI({ resizable: mergedProps.uiOptions.resizable })
    }, [mergedProps.uiOptions.resizable])

    return (
      <main
        ref={mergedProps.autoResize ? mainRef : ref}
        {...props}
        className={cx(classes.framerPlugin, props.className)}
      >
        {children}
      </main>
    )
  },
)

export { FramerPlugin }
