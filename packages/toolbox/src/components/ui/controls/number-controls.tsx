import React, { useEffect, useState } from 'react'
import cx from 'classnames'

import { InputGroup } from '../input-group'
import classes from './number-controls.module.css'

import { icons } from '@/components/icons'

/** @public */
export type FilteredNumberInputProps = Omit<React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'onChange' | 'value' | 'defaultValue'>

/**
 * The props of the NumberControls component.s
 *
 * @see {@link FilteredNumberInputProps} for the props of the input element.
 *
 * @public
 */
export interface NumberControlsProps extends FilteredNumberInputProps {
  /** The title of the number controls. */
  title?: string
  /** The value of the number controls. */
  value?: number
  /** The default value of the number controls. */
  defaultValue?: number
  /** Whether to show the stepper controls. */
  stepper?: boolean
  /** Whether to show the slider control. */
  slider?: boolean
  /**
   * The callback function that is triggered when the value changes.
   *
   * @param value - The new value of the number controls.
   * @param event - The event object.
   */
  onChange?: (value: number, event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent) => void
}

/**
 * A component that renders an input element for number controls with optional stepper and slider features.
 *
 * @example
 * ```tsx
 * // Render number controls with a title and disabled state
 * <NumberControls title="Quantity" />
 * ```
 *
 * @example
 * ```tsx
 * // Render number controls with stepper
 * <NumberControls title="Quantity" stepper onChange={handleQuantityChange} />
 * ```
 *
 * @example
 * ```tsx
 * // Render number controls with a default value and custom step
 * <NumberControls defaultValue={10} step={2} onChange={handleQuantityChange} />
 * ```
 *
 * @public
 * @kind component
 */
export const NumberControls: React.FC<NumberControlsProps> = ({
  title,
  defaultValue,
  stepper = false,
  slider = false,
  onChange,
  value,
  ...props
}) => {
  const [currentValue, setCurrentValue] = useState(+(value ?? defaultValue ?? 0))

  const handleChange = (newValue: number, event: React.ChangeEvent<HTMLInputElement> | React.MouseEvent) => {
    if (props.min !== undefined)
      newValue = Math.max(+props.min, newValue)

    if (props.max !== undefined)
      newValue = Math.min(+props.max, newValue)

    if (currentValue === newValue)
      return

    if (onChange)
      onChange(newValue, event)

    if (event.defaultPrevented)
      return

    setCurrentValue(newValue)
  }

  useEffect(() => {
    if (value === undefined || currentValue === value)
      return

    setCurrentValue(value)
  }, [value])

  if (!stepper && !slider) {
    return (
      <InputGroup title={title}>
        <input type="number" {...props} value={currentValue} onChange={e => handleChange(e.target.valueAsNumber, e)} />
      </InputGroup>
    )
  }

  return (
    <InputGroup title={title}>
      <input type="number" {...props} value={currentValue} onChange={e => handleChange(e.target.valueAsNumber, e)} />
      {stepper && (
        <div className={cx(classes.numberControls, classes.stepper)}>
          <i
            className={classes.icon}
            style={{
              maskImage: `url(${icons.minus})`,
            }}
            onClick={(e) => {
              if (props.disabled)
                return

              handleChange(
                Math.max(
                  +(props.min ?? Number.MIN_SAFE_INTEGER),
                  currentValue - +(props.step ?? 1),
                ),
                e,
              )
            }}
          />
          <div className={classes.divider} />
          <i
            className={classes.icon}
            style={{
              maskImage: `url(${icons.plus})`,
            }}
            onClick={(e) => {
              if (props.disabled)
                return

              handleChange(
                Math.min(
                  +(props.max ?? Number.MAX_SAFE_INTEGER),
                  currentValue + +(props.step ?? 1),
                ),
                e,
              )
            }}
          />
        </div>
      )}
      {slider && (
        <input
          type="range"
          {...props}
          value={currentValue}
          onChange={e => handleChange(e.target.valueAsNumber, e)}
        />
      )}
    </InputGroup>
  )
}
