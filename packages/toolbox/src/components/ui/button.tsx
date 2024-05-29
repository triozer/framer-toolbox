import React from 'react'
import cx from 'classnames'

import classes from './button.module.css'

/**
 * The props of the Button component.
 *
 * @public
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** The URL of the icon to display on the button. */
  icon?: string
  /**
   * The variant of the button.
   *
   * @defaultValue 'primary'
   */
  variant?: 'primary' | 'secondary' | 'destructive'
}

/**
 * A component that renders a button element with optional icon and different variants.
 *
 * @example
 * ```tsx
 * // Render a primary button with text
 * <Button variant="primary">Click Me</Button>
 * ```
 *
 * @example
 * ```tsx
 * // Render a secondary button with an icon
 * <Button icon="https://example.com/icon.svg" variant="secondary" />
 * ```
 *
 * @example
 * ```tsx
 * // Render a destructive button with icon and text
 * <Button icon="https://example.com/warning-icon.svg" variant="destructive">
 *   Delete
 * </Button>
 * ```
 *
 * @public
 * @kind component
 */
export const Button: React.FC<ButtonProps> = ({
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
            maskImage: `url(${icon})`,
          }}
        />
      )}
      {children && <span>{children}</span>}
    </button>
  )
}
