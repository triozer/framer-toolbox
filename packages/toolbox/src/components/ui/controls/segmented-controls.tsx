import React, { useEffect, useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import cx from 'classnames'
import { InputGroup } from '../input-group'
import classes from './segmented-controls.module.css'
import { capitalizeWords } from '@/utils/string'

/**
 * An item in the segmented controls.
 *
 * @public
 */
export interface SegmentedControlItem<Value> {
  /**
   * The value of the item.
   */
  value: Value
  /**
   * The label of the item.
   */
  label?: string
  /**
   * The icon of the item.
   */
  icon?: string
}

/**
 * The props of the SegmentedControls component.
 *
 * @typeParam Value - The type of the value of the segmented controls.
 *
 * @public
 */
export interface SegmentedControlsProps<Value> {
  /** The title of the segmented controls. */
  title?: string
  /**
   * The list of selectable items.
   *
   * @see {@link SegmentedControlItem}
   *
   * @defaultValue \[\{ value: true, label: 'Yes' \}, \{ value: false, label: 'No' \}\]
   */
  items?: SegmentedControlItem<Value>[]
  /** The default value of the segmented controls. */
  defaultValue?: Value
  /** The value of the segmented controls. */
  value?: Value | null
  /**
   * The callback function that is triggered when the value changes.
   *
   * @param value - The new value of the segmented controls.
   * @param event - The event object.
   */
  onChange?: (value: Value, event: React.MouseEvent<HTMLSpanElement>) => void
  /** Whether the segmented controls are disabled. */
  disabled?: boolean
  /** The direction of the segmented controls. */
  direction?: 'horizontal' | 'vertical'
}

/**
 * A component that renders a set of selectable items with an indicator for the selected item.
 *
 * @remarks
 * If no value is provided, the default value is set to the first item in the list.
 * If no items are provided, the default items are set to 'Yes' and 'No' and their respective boolean values.
 *
 * @typeParam Value - The type of the value of the segmented controls.
 *
 * @example
 * ```tsx
 * // Render segmented controls with default items
 * <SegmentedControls title="Choose an option" onChange={handleSegmentChange} />
 * ```
 *
 * @example
 * ```tsx
 * // Render segmented controls with custom items
 * const items = [
 *   { value: 'option1', label: 'Option 1', icon: 'path/to/icon1.svg' },
 *   { value: 'option2', label: 'Option 2', icon: 'path/to/icon2.svg' },
 * ];
 *
 * <SegmentedControls items={items} value="option1" onChange={handleSegmentChange} />
 * ```
 *
 * @public
 * @kind component
 */
export function SegmentedControls<Value>({
  title,
  items = [
    {
      value: true as Value,
      label: 'Yes',
    },
    {
      value: false as Value,
      label: 'No',
    },
  ],
  value,
  defaultValue,
  disabled,
  onChange,
  direction = 'horizontal',
}: SegmentedControlsProps<Value>) {
  const segmentedControlsRef = useRef<HTMLDivElement>(null)
  const [selectedValue, setSelectedValue] = useState(value ?? defaultValue ?? (items.length > 0 ? items[0].value : false))

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
    return direction === 'horizontal'
      ? {
          width: `calc((100% - ${padding.left} - ${padding.right}) / ${items.length})`,
          height: `calc(100% - ${padding.top} - ${padding.bottom})`,
        }
      : {
          width: `calc(100% - ${padding.left} - ${padding.right})`,
          height: `calc((100% - ${padding.top} - ${padding.bottom}) / ${items.length})`,
        }
  }, [padding, items.length, direction])

  const animatePosition = useMemo(() => {
    const index = items.findIndex(item => item.value === selectedValue)
    return direction === 'horizontal'
      ? {
          left: `calc(${index} * (100% - ${padding.left} - ${padding.right}) / ${items.length} + ${padding.left})`,
          top: padding.top,
        }
      : {
          left: padding.left,
          top: `calc(${index} * (100% - ${padding.top} - ${padding.bottom}) / ${items.length} + ${padding.top})`,
        }
  }, [selectedValue, items, padding, direction])

  const handleChange = (event: React.MouseEvent<HTMLSpanElement>, value: Value) => {
    if (disabled) {
      event.preventDefault()
      event.stopPropagation()
      return
    }

    if (value === selectedValue)
      return

    if (onChange)
      onChange(value, event)

    if (event.defaultPrevented)
      return

    setSelectedValue(value)
  }

  useEffect(() => {
    if (value === undefined || value === null) {
      setSelectedValue(defaultValue ?? items[0].value)
      return
    }

    setSelectedValue(value)
  }, [value])

  return (
    <InputGroup title={title} multiline={direction === 'vertical'}>
      <div ref={segmentedControlsRef} className={cx(classes.segmentedControls, classes[direction])}>
        {items.map((item, idx) => (
          <span
            key={`${title}-${item.value}`}
            onClick={e => handleChange(e, item.value)}
            className={cx({ [classes.selected]: item.value === selectedValue })}
          >
            {item.icon
              ? (
                  <i
                    className={classes.icon}
                    style={{
                      maskImage: `url(${item.icon})`,
                    }}
                  />
                )
              : (
                  capitalizeWords(
                    item.label ? item.label : idx === 0 ? 'Yes' : idx === 1 ? 'No' : `${item.value}`,
                  )
                )}
          </span>
        ))}
        <motion.div
          className={classes.indicator}
          initial={animatePosition}
          animate={animatePosition}
          style={indicatorDimensions}
        />
      </div>
    </InputGroup>
  )
}
