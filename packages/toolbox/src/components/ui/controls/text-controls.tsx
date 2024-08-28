import React, { useEffect, useState } from 'react'
import cx from 'classnames'

import { InputGroup } from '../input-group'
import classes from './text-controls.module.css'

import { type IconType, icons } from '@/components/icons'

/** @public */
export type FilteredTextInputProps = Omit<React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>, 'onChange' | 'type'>

/**
 * The props of the TextControls component.
 *
 * @see {@link FilteredTextInputProps} for the props of the input element.
 *
 * @public
 */
export interface TextControlsProps extends FilteredTextInputProps {
  /** The title of the text controls. */
  title?: string
  /**
   * The icon of the text controls.
   *
   * @see {@link IconType}
   */
  icon?: IconType
  /**
   * The callback function that is triggered when the value changes.
   *
   * @param value - The new value of the text controls.
   * @param event - The event object.
   */
  onChange?: (value: string, event: React.ChangeEvent<HTMLInputElement>) => void
}

/**
 * A component that renders an input element with optional title and icon.
 *
 * @example
 * ```tsx
 * // Render an input with a title and an icon
 * <TextControls title="Username" icon="user" onChange={handleInputChange} />
 * ```
 *
 * @example
 * ```tsx
 * // Render an input with a default value
 * <TextControls defaultValue="Default text" />
 * ```
 *
 * @example
 * ```tsx
 * // Render an input with additional HTML attributes
 * <TextControls placeholder="Enter text here" className="custom-input" />
 * ```
 *
 * @public
 * @kind component
 */
export const TextControls: React.FC<TextControlsProps> = ({
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
    if (onChange)
      onChange(e.target.value, e)

    if (e.defaultPrevented)
      return

    setCurrentValue(e.target.value)
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
