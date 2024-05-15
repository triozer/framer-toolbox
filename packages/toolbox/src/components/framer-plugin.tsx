import React, { useEffect } from "react"
import { useAutoSizer } from "../hooks/auto-sizer"
import { type UIOptions, framer } from "framer-plugin"
import { useFramerPlugin } from "../providers/framer-plugin"

type FramerPluginRealProps = {
  name: string
  padding: React.CSSProperties["padding"]
  gap: React.CSSProperties["gap"]
  autoResize: boolean
  uiOptions: Omit<UIOptions, "title">
  showOnMounted: boolean
}

const defaultProps: FramerPluginRealProps = {
  name: "Framer Plugin",
  padding: "0 15px 15px 15px",
  gap: "10px",
  autoResize: true,
  showOnMounted: true,
  uiOptions: {
    position: "top right",
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
    ref
  ) => {
    const { name: configName } = useFramerPlugin()

    const mergedProps: FramerPluginRealProps = {
      name: name ?? configName,
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
    }, [mergedProps.name, mergedProps.showOnMounted, mergedProps.uiOptions])

    return (
      <main
        {...props}
        ref={mergedProps.autoResize ? mainRef : ref}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "start",
          padding: mergedProps.padding,
          gap: mergedProps.gap,
          width: "100%",
          height: "100%",
          ...props.style,
        }}
      >
        {children}
      </main>
    )
  }
)

export { FramerPlugin }
