import React, { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import InputGroup from "./input-group";

import "../styles/segmented-controls.css";

/**
 * Type definition for a segmented control item
 *
 * @property {string} value - The value of the item
 * @property {string} label - The label displayed for the item
 */
export type SegmentedControlItem = {
  value: string;
  label: string;
};

/**
 * Props for the SegmentedControls component
 *
 * @property {SegmentedControlItem[]} items - Array of segmented control items
 * @property {string} defaultValue - The default selected value
 * @property {(value: string) => void} onChange - Callback function when the selected value changes
 * @extends React.HTMLProps<HTMLDivElement> - Additional props for the div element
 */
type SegmentedControlsProps = {
  title: string;
  items: SegmentedControlItem[];
  defaultValue: string;
  onChange: (value: string) => void;
} & React.HTMLProps<HTMLDivElement>;

/**
 * SegmentedControls component
 *
 * A custom React component for segmented controls with animated indicator
 *
 * @param props - Props for the component
 * @returns The rendered component
 */
const SegmentedControls: React.FC<SegmentedControlsProps> = ({
  title,
  items,
  defaultValue,
  onChange,
}: SegmentedControlsProps) => {
  const segmentedControlsRef = useRef<HTMLDivElement>(null);
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  const padding = useMemo(() => {
    if (!segmentedControlsRef.current)
      return {
        left: "2px",
        top: "2px",
        right: "2px",
        bottom: "2px",
      };

    const computedStyle = getComputedStyle(segmentedControlsRef.current);

    return {
      left: computedStyle.paddingLeft,
      top: computedStyle.paddingTop,
      right: computedStyle.paddingRight,
      bottom: computedStyle.paddingBottom,
    };
  }, [segmentedControlsRef.current]);

  const indicatorDimensions = useMemo(() => {
    return {
      width: `calc((100% - ${padding.left} - ${padding.right}) / ${items.length})`,
      height: `calc(100% - ${padding.top} - ${padding.bottom})`,
    };
  }, [padding]);

  const animateX = useMemo(() => {
    return {
      left: `calc(${items.findIndex(
        (item) => item.value === selectedValue
      )} * (100% - ${padding.left} - ${padding.right}) / ${items.length} + ${
        padding.left
      })`,
    };
  }, [selectedValue, items, padding]);

  const handleChange = (value: string) => {
    if (value === selectedValue) return;

    setSelectedValue(value);
    onChange(value);
  };

  return (
    <InputGroup title={title}>
      <div ref={segmentedControlsRef} className="segmented-controls">
        {items.map((item) => (
          <span
            key={item.value}
            onClick={() => handleChange(item.value)}
            className={item.value === selectedValue ? "selected" : ""}
          >
            {item.label}
          </span>
        ))}
        <motion.div
          className="indicator"
          initial={animateX}
          animate={animateX}
          style={indicatorDimensions}
        />
      </div>
    </InputGroup>
  );
};

export default SegmentedControls;
