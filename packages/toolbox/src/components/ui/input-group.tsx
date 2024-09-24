import React, { useMemo } from 'react'
import cx from 'classnames'

import classes from './input-group.module.css'

import { capitalizeWords } from '@/utils/string'

/**
 * The props of the InputGroup component.
 *
 * @internal
 */
export interface InputGroupProps {
  /** The title of the input group. */
  title?: string
  /** The children of the input group. */
  children: React.ReactNode
  /**
   * The boolean to determine if the input group is multiline.
   *
   * @defaultValue false
   */
  multiline?: boolean
}

/**
 * A component that used to group input element and a title.
 *
 * @remarks
 * This component should not be used directly, instead use the `TextControls`, `NumberControls`, `ListControls` or `SegmentedControls` components.
 *
 * @example
 * ```tsx
 * <InputGroup title="User Information">
 *   <input type="text" placeholder="First Name" />
 * </InputGroup>
 * ```
 *
 * @internal
 * @kind component
 */
const InputGroup: React.FC<InputGroupProps> = ({ title, children, multiline }) => {
  const hasMultipleChildren = useMemo(
    () => React.Children.count(children) > 1,
    [children],
  )

  return (
    <div className={cx(classes.inputGroup, !hasMultipleChildren && classes.full, multiline && classes.multiline)}>
      {title && <label title={capitalizeWords(title)}>{capitalizeWords(title)}</label>}
      {children}
    </div>
  )
}

export { InputGroup }
