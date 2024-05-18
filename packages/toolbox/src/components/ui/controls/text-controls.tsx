import React from 'react'
import cx from 'classnames'

import { InputGroup } from '../input-group'
import classes from './text-controls.module.css'

import { type IconType, icons } from '@/components/icons'

type TextControlsProps = {
  title?: string
  icon?: IconType
} & React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

const TextControls: React.FC<TextControlsProps> = ({
  title,
  icon,
  type = 'text',
  ...props
}) => {
  return (
    <InputGroup title={title}>
      <input
        {...props}
        type={type}
        style={{
          ...props.style,
          ...icon && { backgroundImage: `url(${icons[icon]})` },
        }}
        className={cx(classes.input, props.className)}
      />
    </InputGroup>
  )
}

export { TextControls }
