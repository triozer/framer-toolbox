import React from 'react'
import cx from 'classnames' // to combine class names

import classes from './icon.module.css'

import { type IconType, icons } from '@/components/icons'

type IconProps = {
  icon?: IconType
  iconUrl?: string
  size?: number
  className?: string
  color?: string
} & React.HTMLAttributes<HTMLElement>

const Icon: React.FC<IconProps> = ({
  icon,
  iconUrl,
  size = 16,
  className,
  color = 'currentColor',
  style,
  ...props
}) => {
  const url = iconUrl ?? (icon ? icons[icon] : null) // Either use provided iconUrl or fetch from icons object

  if (!url)
    throw new Error(`Icon "${icon}" not found and no iconUrl provided`)

  return (
    <i
      className={cx(classes.icon, className)}
      style={{
        width: size,
        height: size,
        maskImage: `url(${url})`,
        backgroundColor: color,
        WebkitMaskImage: `url(${url})`,
        ...style,
      }}
      {...props}
    />
  )
}

export { Icon }
