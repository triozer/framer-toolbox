import React, { useEffect, useState } from 'react'

import { InputGroup } from '../input-group'
import { capitalizeWords } from '@/utils'

interface ListControlItem<Value> {
  value: Value
  label?: string
}

type ListControlsProps<Value> = {
  title?: string
  items?: ListControlItem<Value>[]
  defaultValue?: Value
  value?: Value | null
  onChange?: (value: Value) => void
} & Omit<React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, 'onChange'>

function ListControls<Value extends string | number>({
  title,
  items = [],
  value,
  defaultValue,
  onChange,
  ...props
}: ListControlsProps<Value>) {
  const [selectedValue, setSelectedValue] = useState(defaultValue ?? value ?? (items.length > 0 ? items[0].value : ''))

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = event.target.value as Value
    setSelectedValue(newValue)
    onChange && onChange(newValue)
  }

  useEffect(() => {
    if (value !== undefined)
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

export { ListControls, type ListControlItem }
