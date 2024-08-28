import React, { useEffect, useState } from 'react'

import { InputGroup } from '../input-group'
import { capitalizeWords } from '@/utils'

/**
 * An item in the list of selectable items.
 *
 * @public
 */
export interface ListControlItem<Value> {
  /**
   * The value of the item.
   */
  value: Value
  /**
   * The label of the item.
   */
  label?: string
}

/** @public */
export type SelectFilteredProps = Omit<React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, 'onChange' | 'value' | 'defaultValue'>

/**
 * The props of the ListControls component.
 *
 * @typeParam Value - The type of the value of the list controls.
 *
 * @see {@link SelectFilteredProps} for the props of the select element.
 *
 * @public
 */
export interface ListControlsProps<Value> extends SelectFilteredProps {
  /** The title of the list controls. */
  title?: string
  /**
   * The list of selectable items.
   *
   * @see {@link ListControlItem}
   *
   * @defaultValue []
   */
  items?: ListControlItem<Value>[]
  /** The default value of the list controls. */
  defaultValue?: Value
  /** The value of the list controls. */
  value?: Value | null
  /**
   * The callback function that is triggered when the value changes.
   *
   * @param value - The new value of the list controls.
   * @param event - The event object.
   */
  onChange?: (value: Value, event: React.ChangeEvent<HTMLSelectElement>) => void
}

/**
 * A component that renders a select dropdown with optional title.
 *
 *
 * @remarks
 * If no value is provided, the default value is set to the first item in the list.
 * If no items are provided, the default items are an empty array.
 *
 * @typeParam Value - The type of the value of the list controls.
 *
 * @example
 * ```tsx
 * <ListControls title="Select an option" onChange={handleOptionChange} />
 * ```
 *
 * @example
 * ```tsx
 * // Render list controls with custom items
 * const items = [
 *   { value: 'option1', label: 'Option 1' },
 *   { value: 'option2', label: 'Option 2' },
 * ];
 *
 * <ListControls title="Select an option" items={items} onChange={handleOptionChange} />
 * ```
 *
 * @public
 * @kind component
 */
export function ListControls<Value extends string | number>({
  title,
  items = [],
  value,
  defaultValue,
  onChange,
  ...props
}: ListControlsProps<Value>) {
  const [selectedValue, setSelectedValue] = useState(value ?? defaultValue ?? (items.length > 0 ? items[0].value : ''))

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as Value

    if (onChange)
      onChange(newValue, event)

    if (event.defaultPrevented)
      return

    setSelectedValue(newValue)
  }

  useEffect(() => {
    if (value !== undefined && value !== null)
      setSelectedValue(value)
  }, [value])

  return (
    <InputGroup title={title}>
      <select value={selectedValue} onChange={handleChange} {...props}>
        {items.map(item => (
          <option key={`${title}-${item.value}`} value={item.value}>
            {capitalizeWords(item.label ?? `${item.value}`)}
          </option>
        ))}
      </select>
    </InputGroup>
  )
}
