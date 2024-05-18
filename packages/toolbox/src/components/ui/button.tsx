import React from 'react'
import cx from 'classnames'

import { type IconType, icons } from '../icons'
import classes from './button.module.css'

type ButtonProps = {
  icon?: IconType
  children?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'destructive'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({
  icon,
  children,
  variant = 'primary',
  ...props
}) => {
  return (
    <button
      className={cx(classes.button, classes[variant], { [classes.buttonIcon]: !!icon })}
      {...props}
    >
      {icon && (
        <i
          className={classes.icon}
          style={{
            maskImage: `url(${icons[icon]})`,
          }}
        />
      )}
      {children && <span>{children}</span>}
    </button>
  )
}

export { Button }
