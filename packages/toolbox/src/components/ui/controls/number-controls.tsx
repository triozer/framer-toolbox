import React, { useEffect, useState } from 'react'

import { InputGroup } from '../input-group'
import { icons } from '@/components/icons'

import '../../../styles/number-controls.css'

  type NumberControlsProps = {
    title: string
    stepper?: boolean
    slider?: boolean
    onChange?: (value: number) => void
  } & Omit<
    React.DetailedHTMLProps<
      React.InputHTMLAttributes<HTMLInputElement>,
      HTMLInputElement
    >,
    'onChange'
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
    if (currentValue === +(value ?? 0))
      return

    setCurrentValue(+(value ?? 0))
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
        <div
          className="number-controls stepper"
        >
          <i
            style={{
              width: '100%',
              height: '100%',
              maskImage: `url(${icons.minus})`,
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
              backgroundColor: 'currentColor',
              cursor: 'pointer',
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
          <div className="divider" />
          <i
            style={{
              width: '100%',
              height: '100%',
              maskImage: `url(${icons.plus})`,
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
              backgroundColor: 'currentColor',
              cursor: 'pointer',
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
