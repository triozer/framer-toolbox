import cx from 'classnames'

import classes from './spinner.module.css'

/**
 * The props of the Spinner component.
 *
 * @public
 */
export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The size of the spinner.
   *
   * @defaultValue 'normal'
   */
  size?: 'normal' | 'medium' | 'large'
  /**
   * Whether the spinner is inline.
   *
   * @defaultValue false
   */
  inline?: boolean
  /**
   * The color of the spinner.
   *
   * @defaultValue 'currentColor'
   */
  color?: React.CSSProperties['color']
}

function styleForSize(size: SpinnerProps['size']) {
  switch (size) {
    case 'normal':
      return classes.normalSize
    case 'medium':
      return classes.mediumSize
    case 'large':
      return classes.largeSize
  }
}

/**
 * A spinner component to indicate loading state.
 *
 * @example
 * ```tsx
 * <Spinner size="normal" />
 * ```
 *
 * @example
 * ```tsx
 * <Spinner size="normal" color="yellow" />
 * ```
 *
 * @public
 * @kind component
 */
const Spinner: React.FC<SpinnerProps> = ({
  size,
  inline = false,
  color = 'currentColor',
  ...props
}) => {
  return (
    <div
      className={cx(
        props.className,
        classes.spin,
        classes.baseStyle,
        styleForSize(size),
        !color && classes.buttonWithDepthSpinner,
        !inline && classes.centeredStyle,
      )}
      {...color && { style: { color } }}
      {...props}
    />
  )
}

export { Spinner }
