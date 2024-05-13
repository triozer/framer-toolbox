import "../../styles/spinner.css";

export interface SpinnerProps {
  /** Size of the spinner */
  size?: "normal" | "medium" | "large";
  /** Set the spinner to have a static position inline with other content */
  inline?: boolean;
  className?: string;
  inheritColor?: boolean;
}

function styleForSize(size: SpinnerProps["size"]) {
  switch (size) {
    case "normal":
      return "normalStyle";
    case "medium":
      return "mediumStyle";
    case "large":
      return "largeStyle";
  }
}

const Spinner = ({
  size,
  inline = false,
  inheritColor,
  className,
  ...rest
}: SpinnerProps) => {
  return (
    <div
      className={`spin baseStyle ${styleForSize(size)} ${
        inheritColor ? "buttonWithDepthSpinner" : ""
      } ${!inline ? "centeredStyle" : ""}`}
      {...rest}
    />
  );
};

export { Spinner };
