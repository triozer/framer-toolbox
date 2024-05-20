import React, { useState } from 'react'
import cx from 'classnames' // to combine class names

import classes from './icon.module.css'

import { type IconType, icons } from '@/components/icons'

/**
 * The predefined icon types.
 *
 * @public
 */
export interface IconProps extends React.HTMLAttributes<HTMLElement> {
  /**
   * The type of the icon to display.
   *
   * @see {@link IconType}
   */
  icon?: IconType
  /** The URL of the icon to display. */
  iconUrl?: string
  /**
   * The size of the icon.
   *
   * @defaultValue 16
   */
  size?: number
  /** The additional class names to apply to the icon. */
  className?: string
  /**
   * The color of the icon.
   *
   * @defaultValue 'currentColor'
   */
  color?: string
}

/**
 * Icon component that renders an icon using either a provided URL or a predefined icon type.
 *
 * @throws Will throw an error if neither icon nor iconUrl is provided, or if the icon type is not found in the icons object.
 *
 * @example
 * ```tsx
 * // Render an icon from a predefined type
 * <Icon icon="home" size={24} color="blue" />
 *
 * // Render an icon from a URL
 * <Icon iconUrl="https://example.com/icon.svg" size={32} />
 *
 * // Render an icon with additional class names and styles
 * <Icon icon="settings" className="my-icon" style={{ margin: '10px' }} />
 * ```
 *
 * @public
 * @kind component
 */
export const Icon: React.FC<IconProps> = ({
  icon,
  iconUrl,
  size = 16,
  className,
  color = 'currentColor',
  style,
  ...props
}) => {
  const [url] = useState(iconUrl ?? (icon ? icons[icon] : null))

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
