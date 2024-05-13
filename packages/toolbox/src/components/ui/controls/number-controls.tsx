import React, { useEffect, useState } from "react";

import { InputGroup } from "../input-group";
import { icons } from "@/components/icons";

type NumberControlsProps = {
  title: string;
  stepper?: boolean;
  slider?: boolean;
  onChange?: (value: number) => void;
} & Omit<
  React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >,
  "onChange"
>;

const NumberControls: React.FC<NumberControlsProps> = ({
  title,
  defaultValue,
  stepper = false,
  slider = false,
  ...props
}) => {
  const [value, setValue] = useState(+(props.value || defaultValue || 0));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(+e.target.value);
  };

  useEffect(() => {
    setValue(+(props.value || 0));
  }, [props.value]);

  useEffect(() => {
    props.onChange && props.onChange(value);
  }, [value]);

  if (!stepper && !slider) {
    return (
      <InputGroup title={title}>
        <input type="number" {...props} value={value} onChange={handleChange} />
      </InputGroup>
    );
  }

  return (
    <InputGroup title={title}>
      <input type="number" {...props} value={value} onChange={handleChange} />
      {stepper && (
        <div
          className="input-background"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1px 1fr",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            color: "#999999",
          }}
        >
          <i
            style={{
              width: "100%",
              height: "100%",
              maskImage: `url(${icons.minus})`,
              maskRepeat: "no-repeat",
              maskPosition: "center",
              backgroundColor: "currentColor",
              cursor: "pointer",
            }}
            onClick={() => {
              if (props.disabled) return;

              setValue((prev) =>
                Math.max(
                  +(props.min ?? Number.MIN_SAFE_INTEGER),
                  prev - +(props.step ?? 1)
                )
              );
            }}
          />
          <div style={{ height: "50%", backgroundColor: "#E3E3E3" }} />
          <i
            style={{
              width: "100%",
              height: "100%",
              maskImage: `url(${icons.plus})`,
              maskRepeat: "no-repeat",
              maskPosition: "center",
              backgroundColor: "currentColor",
              cursor: "pointer",
            }}
            onClick={() => {
              if (props.disabled) return;

              setValue((prev) =>
                Math.min(
                  +(props.max ?? Number.MAX_SAFE_INTEGER),
                  prev + +(props.step ?? 1)
                )
              );
            }}
          />
        </div>
      )}
      {slider && (
        <input
          type="range"
          value={value}
          min={props.min}
          max={props.max}
          step={props.step}
          onChange={handleChange}
        />
      )}
    </InputGroup>
  );
};

export { NumberControls };
