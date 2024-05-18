import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { InputGroup } from '../input-group'

import '../../../styles/segmented-controls.css'
import { capitalizeWords } from '@/utils/string'

/**
 * Type definition for a segmented control item
 *
 * @property {string | boolean} value - The value of the item
 * @property {string} [label] - The label of the item
 */
interface SegmentedControlItem<Value> {
  value: Value
  label?: string
  icon?: string
}

/**
 * Props for the SegmentedControls component
 *
 * @property {SegmentedControlItem[]} items - Array of segmented control items
 * @property {string} defaultValue - The default selected value
 * @property {(value: string) => void} onChange - Callback function when the selected value changes
 * @extends React.HTMLProps<HTMLDivElement> - Additional props for the div element
 */
type SegmentedControlsProps<Value> = {
  title?: string
  items?: SegmentedControlItem<Value>[]
  defaultValue?: string
  value?: Value | null
  onChange?: (value: Value) => void
} & Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  'onChange'
>

/**
 * SegmentedControls component
 *
 * A custom React component for segmented controls with animated indicator
 *
 * @param props - Props for the component
 * @param props.title - The title of the input group
 * @param props.items - Array of segmented control items
 * @param props.value - The selected value
 * @param props.defaultValue - The default selected value
 * @param props.onChange - Callback function when the selected value changes
 * @returns The rendered component
 */
function SegmentedControls<T = boolean>({
  title,
  items = [
    {
      value: true as T,
      label: 'Yes',
    },
    {
      value: false as T,
      label: 'No',
    },
  ],
  value,
  defaultValue,
  onChange,
}: SegmentedControlsProps<T>) {
  const segmentedControlsRef = useRef<HTMLDivElement>(null)
  const [selectedValue, setSelectedValue] = useState(
    defaultValue ?? value ?? items.length > 0 ? items[0].value : false,
  )

  const padding = useMemo(() => {
    if (!segmentedControlsRef.current) {
      return {
        left: '2px',
        top: '2px',
        right: '2px',
        bottom: '2px',
      }
    }

    const computedStyle = getComputedStyle(segmentedControlsRef.current)

    return {
      left: computedStyle.paddingLeft,
      top: computedStyle.paddingTop,
      right: computedStyle.paddingRight,
      bottom: computedStyle.paddingBottom,
    }
  }, [segmentedControlsRef])

  const indicatorDimensions = useMemo(() => {
    return {
      width: `calc((100% - ${padding.left} - ${padding.right}) / ${items.length})`,
      height: `calc(100% - ${padding.top} - ${padding.bottom})`,
    }
  }, [padding, items.length])

  const animateX = useMemo(() => {
    return {
      left: `calc(${items.findIndex(
        item => item.value === selectedValue,
      )} * (100% - ${padding.left} - ${padding.right}) / ${items.length} + ${
        padding.left
      })`,
    }
  }, [selectedValue, items, padding])

  const handleChange = (value: T) => {
    if (value === selectedValue)
      return

    setSelectedValue(value)
    onChange && onChange(value)
  }

  useEffect(() => {
    setSelectedValue(value ?? false)
  }, [value])

  return (
    <InputGroup title={title}>
      <div ref={segmentedControlsRef} className="segmented-controls">
        {items.map((item, idx) => (
          <span
            key={`${title}-${item.value}`}
            onClick={() => handleChange(item.value)}
            className={item.value === selectedValue ? 'selected' : ''}
          >
            {item.icon
              ? (
                <i
                  style={{
                    maskImage: `url(${item.icon})`,
                  }}
                />
                )
              : (
                  capitalizeWords(item.label ? item.label : idx === 0 ? 'Yes' : idx === 1 ? 'No' : `${item.value}`)
                )}
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
  )
}

export { SegmentedControls, type SegmentedControlItem }
