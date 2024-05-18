import cx from 'classnames'

import classes from './spinner.module.css'

export interface SpinnerProps {
  /** Size of the spinner */
  size?: 'normal' | 'medium' | 'large'
  /** Set the spinner to have a static position inline with other content */
  inline?: boolean
  className?: string
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

function Spinner({
  size,
  inline = false,
  color,
  className,
  ...rest
}: SpinnerProps) {
  return (
    <div
      className={cx(
        className,
        classes.spin,
        classes.baseStyle,
        styleForSize(size),
        !color && classes.buttonWithDepthSpinner,
        !inline && classes.centeredStyle,
      )}
      {...color && { style: { color } }}
      {...rest}
    />
  )
};

export { Spinner }
