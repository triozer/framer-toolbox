import { type IconType, icons } from '../icons'

import '../../styles/button.css'

type ButtonProps = {
  icon?: IconType
  children?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'destructive'
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Button: React.FC<ButtonProps> = ({
  icon,
  children,
  variant,
  ...props
}) => {
  return (
    <button
      className={`framer-button-${variant ?? 'primary'} ${
        icon ? 'framer-button-icon' : ''
      }`}
      {...props}
    >
      {icon && (
        <i
          style={{
            display: 'block',
            width: 16,
            height: 16,
            maskImage: `url(${icons[icon]})`,
            maskRepeat: 'no-repeat',
            maskPosition: 'center',
            background: 'currentColor',
          }}
        />
      )}
      {children && <span>{children}</span>}
    </button>
  )
}

export { Button }
