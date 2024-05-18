import classes from './separator.module.css'

type SeparatorProps = React.HTMLAttributes<HTMLHRElement>

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
