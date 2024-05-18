import React, { useMemo } from 'react'

import '../../styles/input-group.css'
import { capitalizeWords } from '@/utils/string'

interface InputGroupProps {
  title?: string
  children: React.ReactNode
}

const InputGroup: React.FC<InputGroupProps> = ({ title, children }) => {
  const hasMultipleChildren = useMemo(
    () => React.Children.count(children) > 1,
    [children],
  )

  return (
    <div className={`input-group ${!hasMultipleChildren ? 'full' : ''}`}>
      {title && <label>{capitalizeWords(title)}</label>}
      {children}
    </div>
  )
}

export { InputGroup }
