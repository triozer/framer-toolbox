import React, { useEffect, useState } from 'react'
import cx from 'classnames' // to combine class names

import { InputGroup } from '../input-group'
import classes from './number-controls.module.css'

import { icons } from '@/components/icons'

  type NumberControlsProps = {
    title?: string
    value?: number
    defaultValue?: number
    stepper?: boolean
    slider?: boolean
    onChange?: (value: number) => void
  } & Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    'onChange' | 'value' | 'defaultValue'
  >

const NumberControls: React.FC<NumberControlsProps> = ({
  title,
  defaultValue,
  stepper = false,
  slider = false,
  onChange,
  value,
  ...props
}) => {
  const [currentValue, setCurrentValue] = useState(+(value ?? defaultValue ?? 0))

  const handleChange = (newValue: number) => {
    if (props.min !== undefined)
      newValue = Math.max(+props.min, newValue)

    if (props.max !== undefined)
      newValue = Math.min(+props.max, newValue)

    if (currentValue === newValue)
      return

    setCurrentValue(newValue)
    onChange && onChange(newValue)
  }

  useEffect(() => {
    if (value === undefined || currentValue === value)
      return

    setCurrentValue(value)
  }, [value])

  if (!stepper && !slider) {
    return (
      <InputGroup title={title}>
        <input type="number" {...props} value={currentValue} onChange={e => handleChange(e.target.valueAsNumber)} />
      </InputGroup>
    )
  }

  return (
    <InputGroup title={title}>
      <input type="number" {...props} value={currentValue} onChange={e => handleChange(e.target.valueAsNumber)} />
      {stepper && (
        <div className={cx(classes.numberControls, classes.stepper)}>
          <i
            className={classes.icon}
            style={{
              maskImage: `url(${icons.minus})`,
            }}
            onClick={() => {
              if (props.disabled)
                return

              handleChange(
                Math.max(
                  +(props.min ?? Number.MIN_SAFE_INTEGER),
                  currentValue - +(props.step ?? 1),
                ),
              )
            }}
          />
          <div className={classes.divider} />
          <i
            className={classes.icon}
            style={{
              maskImage: `url(${icons.plus})`,
            }}
            onClick={() => {
              if (props.disabled)
                return

              handleChange(
                Math.min(
                  +(props.max ?? Number.MAX_SAFE_INTEGER),
                  currentValue + +(props.step ?? 1),
                ),
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
          onChange={e => handleChange(e.target.valueAsNumber)}
        />
      )}
    </InputGroup>
  )
}

export { NumberControls }
