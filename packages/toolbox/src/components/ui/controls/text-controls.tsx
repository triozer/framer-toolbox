import React, { useMemo } from 'react'

import { InputGroup } from '../input-group'
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
  const withIconStyle = useMemo<React.CSSProperties>(
    () =>
      icon
        ? {
            paddingLeft: 30,
            backgroundImage: `url(${icons[icon]})`,
            backgroundSize: 12,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: '10px 50%',
          }
        : {},
    [icon],
  )

  return (
    <InputGroup title={title}>
      <input
        {...props}
        type={type}
        style={{
          ...props.style,
          ...withIconStyle,
        }}
      />
    </InputGroup>
  )
}

export { TextControls }
