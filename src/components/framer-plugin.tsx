import React from "react";
import { useAutoSizer } from "../hooks/auto-sizer";

type NumberValue = `0` | `${number}px`;

type FramerPluginProps = {
  children?: React.ReactNode;
  padding?:
    | `${NumberValue} ${NumberValue} ${NumberValue} ${NumberValue}`
    | `${NumberValue} ${NumberValue} ${NumberValue}`
    | `${NumberValue} ${NumberValue}`
    | `${NumberValue}`;
  gap?: `${NumberValue} ${NumberValue}` | `${NumberValue}`;
  autoResize?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

const FramerPlugin = React.forwardRef<HTMLDivElement, FramerPluginProps>(
  ({ children, padding, gap, autoResize, ...props }, ref) => {
    const defaultProps = {
      padding: "0 15px 15px 15px",
      gap: "10px",
      autoResize: false,
    };

    const mergedProps = { ...defaultProps, ...props };

    const { ref: mainRef } = useAutoSizer();

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
