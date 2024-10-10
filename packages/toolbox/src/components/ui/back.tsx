import { Icon } from './icon'
import { Separator } from './separator'

import classes from './back.module.css'

/**
 * The props of the Back component.
 *
 * @public
 */
export interface BackProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The title of the current page. */
  title: string
  /** The function to call when the back button is clicked. */
  onClick?: () => void
}

/**
 * A component that renders a horizontal separator line (`<hr>` element) with customizable styles.
 *
 * @example
 * ```tsx
 * <Back onClick={() => {}} />
 * ```
 *
 * @public
 * @kind component
 */
const Back: React.FC<BackProps> = ({
  title,
  onClick,
  ...props
}) => {
  return (
    <div className={classes.back} {...props}>
      <Separator style={{ margin: 0 }} />
      <div className={classes.backContent} onClick={onClick}>
        <Icon className={classes.backIcon} icon="arrow-left" size={12} />
        <span className={classes.backText}>{title}</span>
      </div>
      <Separator style={{ margin: 0 }} />
    </div>
  )
}

export { Back }
