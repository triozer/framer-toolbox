import classes from './separator.module.css'

/**
 * The props of the Separator component.
 *
 * @public
 */
export interface SeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}

/**
 * A component that renders a horizontal separator line (`<hr>` element) with customizable styles.
 *
 * @example
 * ```tsx
 * <Separator style={{ margin: '20px 0', borderColor: 'red' }} />
 * ```
 *
 * @public
 * @kind component
 */
const Separator: React.FC<SeparatorProps> = ({
  ...props
}) => {
  return (
    <hr
      className={classes.separator}
      style={{
        ...props.style,
      }}
      {...props}
    />
  )
}

export { Separator }
