import React, { useEffect, useState } from 'react'
import cx from 'classnames'

import { InputGroup } from '../input-group'
import classes from './text-controls.module.css'

import { type IconType, icons } from '@/components/icons'

type TextControlsProps = {
  title?: string
  icon?: IconType
  onChange?: (value: string) => void
} & Omit<React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>, 'type'>

const TextControls: React.FC<TextControlsProps> = ({
  title,
  icon,
  onChange,
  value,
  defaultValue,
  ...props
}) => {
  const [currentValue, setCurrentValue] = useState(value ?? defaultValue ?? '')

  useEffect(() => {
    if (value !== undefined && value !== currentValue)
      setCurrentValue(value)
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setCurrentValue(newValue)
    onChange && onChange(newValue)
  }

  return (
    <InputGroup title={title}>
      <input
        {...props}
        type="text"
        value={currentValue}
        style={{
          ...props.style,
          ...icon && { backgroundImage: `url(${icons[icon]})` },
        }}
        className={cx(classes.input, icon && classes.withIcon, props.className)}
        onChange={handleChange}
      />
    </InputGroup>
  )
}

export { TextControls }
