import React from 'react'
import { type IconType, icons } from '@/components/icons'

import '../../styles/icon.css'

/**
 * Props for the Icon component
 *
 * @typedef {object} IconProps
 * @property {IconType} [icon] - The name of the icon from the icons object.
 * @property {string} [iconUrl] - The URL of the icon. This takes precedence over the icon name.
 * @property {number} [size=16] - The size of the icon in pixels. Default is 16px.
 * @property {string} [className] - Additional CSS class names for styling.
 * @property {string} [color='currentColor'] - The color of the icon.
 * @property {React.HTMLAttributes<HTMLElement>} props - Additional HTML attributes.
 */
type IconProps = {
  icon?: IconType
  iconUrl?: string
  size?: number
  className?: string
  color?: string
} & React.HTMLAttributes<HTMLElement>

/**
 * A component that renders an icon.
 *
 * @param {IconProps} props - The props object.
 * @param {IconType} [props.icon] - The name of the icon to display from the icons object.
 * @param {string} [props.iconUrl] - The URL of the icon. This takes precedence over the icon name.
 * @param {number} [props.size] - The size of the icon in pixels.
 * @param {string} [props.className] - Additional CSS class names for styling.
 * @param {string} [props.color] - The color of the icon.
 * @param {React.HTMLAttributes<HTMLElement>} [props.props] - Additional HTML attributes.
 * @returns {JSX.Element} The rendered icon component.
 * @throws {Error} Throws an error if the specified icon is not found in the icons object and no iconUrl is provided.
 */
const Icon: React.FC<IconProps> = ({ icon, iconUrl, size = 16, className, color = 'currentColor', ...props }: IconProps): JSX.Element => {
  const url = iconUrl ?? (icon ? icons[icon] : null) // Either use provided iconUrl or fetch from icons object

  if (!url)
    throw new Error(`Icon "${icon}" not found and no iconUrl provided`)

  return (
    <i
      className={`icon ${className || ''}`}
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        maskImage: `url(${url})`,
        maskSize: 'contain',
        maskRepeat: 'no-repeat',
        backgroundColor: color,
        WebkitMaskImage: `url(${url})`,
        WebkitMaskSize: 'contain',
        WebkitMaskRepeat: 'no-repeat',
      }}
      {...props}
    />
  )
}

export { Icon }
