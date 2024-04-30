import React, { useEffect } from "react";
import { useAutoSizer } from "../hooks/auto-sizer";
import { UIOptions, framer } from "framer-plugin";
import localforage from "localforage";

type NumberValue = `0` | `${number}px`;

type FramerPluginRealProps = {
  padding:
    | `${NumberValue} ${NumberValue} ${NumberValue} ${NumberValue}`
    | `${NumberValue} ${NumberValue} ${NumberValue}`
    | `${NumberValue} ${NumberValue}`
    | `${NumberValue}`;
  gap: `${NumberValue} ${NumberValue}` | `${NumberValue}`;
  autoResize: boolean;
  uiOptions: UIOptions;
  showOnMounted: boolean;
};

type FramerPluginProps = {
  children?: React.ReactNode;
} & Partial<FramerPluginRealProps> &
  React.HTMLAttributes<HTMLDivElement>;

const FramerPlugin = React.forwardRef<HTMLDivElement, FramerPluginProps>(
  (
    { children, padding, gap, autoResize, showOnMounted, uiOptions, ...props },
    ref
  ) => {
    const defaultProps: FramerPluginRealProps = {
      padding: "0 15px 15px 15px",
      gap: "10px",
      autoResize: false,
      showOnMounted: true,
      uiOptions: {
        title: "My Plugin",
        position: "top right",
        width: 240,
        height: 95,
        ...uiOptions,
      },
    };

    const mergedProps = { ...defaultProps, ...props };

    if (mergedProps.showOnMounted) {
      framer.showUI(mergedProps.uiOptions);
    }

    const { ref: mainRef } = useAutoSizer();

    useEffect(() => {
      localforage.config({
        name: mergedProps.uiOptions?.title || "My Plugin",
        storeName: "stores",
      });
    }, [showOnMounted, uiOptions]);

    return (
      <main
        {...props}
        ref={mergedProps.autoResize ? mainRef : ref}
        style={{
          padding: mergedProps.padding,
          gap: mergedProps.gap,
          width: "100%",
          height: "100%",
          ...props.style,
        }}
      >
        {children}
      </main>
    );
  }
);

export default FramerPlugin;
