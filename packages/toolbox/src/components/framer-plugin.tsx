import React, { useEffect } from 'react'
import { type UIOptions, framer } from 'framer-plugin'
import cx from 'classnames'

import { useAutoSizer } from '../hooks/auto-sizer'
import { useFramerPlugin } from '../providers'

import classes from './framer-plugin.module.css'

interface FramerPluginRealProps {
  name: string
  padding: React.CSSProperties['padding']
  gap: React.CSSProperties['gap']
  autoResize: boolean
  uiOptions: Omit<UIOptions, 'title'>
  showOnMounted: boolean
}

const defaultProps: FramerPluginRealProps = {
  name: 'Framer Plugin',
  padding: '0 15px 15px 15px',
  gap: '10px',
  autoResize: true,
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
      padding,
      gap,
      autoResize,
      showOnMounted,
      uiOptions,
      ...props
    },
    ref,
  ) => {
    const plugin = useFramerPlugin()

    const mergedProps: FramerPluginRealProps = {
      name: name ?? plugin?.name ?? defaultProps.name,
      padding: padding ?? defaultProps.padding,
      gap: gap ?? defaultProps.gap,
      autoResize: autoResize ?? defaultProps.autoResize,
      showOnMounted: showOnMounted ?? defaultProps.showOnMounted,
      uiOptions: {
        ...defaultProps.uiOptions,
        ...uiOptions,
      },
    }

    const { ref: mainRef } = useAutoSizer({
      enableUIResizing: mergedProps.autoResize,
      defaultSize: {
        width: mergedProps.uiOptions.width ?? defaultProps.uiOptions.width!,
        height: mergedProps.uiOptions.height ?? defaultProps.uiOptions.height!,
      },
    })

    useEffect(() => {
      if (mergedProps.showOnMounted) {
        framer.showUI({
          title: mergedProps.name,
          ...mergedProps.uiOptions,
        })
      }
    }, [])

    return (
      <main
        {...props}
        ref={mergedProps.autoResize ? mainRef : ref}
        className={cx(classes.framerPlugin, props.className)}
        style={{
          padding: mergedProps.padding,
          gap: mergedProps.gap,
          ...props.style,
        }}
      >
        {children}
      </main>
    )
  },
)

export { FramerPlugin }
