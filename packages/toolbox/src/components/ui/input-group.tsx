import React, { useMemo } from 'react'
import cx from 'classnames'

import classes from './input-group.module.css'

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
    <div className={cx(classes.inputGroup, !hasMultipleChildren && classes.full)}>
      {title && <label title={capitalizeWords(title)}>{capitalizeWords(title)}</label>}
      {children}
    </div>
  )
}

export { InputGroup }
