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
    <div className={cx(classes.inputGroup, { [classes.full]: !hasMultipleChildren })}>
      {title && <label className={cx({ [classes.inputGroupHasLabel]: true })}>{capitalizeWords(title)}</label>}
      {children}
    </div>
  )
}

export { InputGroup }
