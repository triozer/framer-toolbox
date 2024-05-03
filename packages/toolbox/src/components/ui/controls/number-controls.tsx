import React, { useEffect, useState } from "react";

import { InputGroup } from "../input-group";

type NumberControlsProps = {
  title: string;
  stepper?: boolean;
  slider?: boolean;
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
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

    if (props.onChange) {
      props.onChange(e);
    }
  };

  useEffect(() => {
    setValue(+(props.value || 0));
  }, [props.value]);

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
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 2px 1fr",
            alignItems: "center",
            width: "100%",
          }}
        >
          <div
            onClick={() =>
              setValue((prev) =>
                Math.max(
                  +(props.min ?? Number.MIN_SAFE_INTEGER),
                  prev - +(props.step ?? 1)
                )
              )
            }
          >
            -
          </div>
          <div style={{ height: "75%", backgroundColor: "red" }} />
          <div
            onClick={() => {
              setValue((prev) =>
                Math.min(
                  +(props.max ?? Number.MAX_SAFE_INTEGER),
                  prev + +(props.step ?? 1)
                )
              );
            }}
          >
            +
          </div>
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
