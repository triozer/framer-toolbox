import '../../../separator.css'

type SeparatorProps = {
  variant: 'inline' | 'block'
} & React.HTMLAttributes<HTMLHRElement>

const Separator: React.FC<SeparatorProps> = ({
  variant,
  ...props
}) => {
  return (
    <hr
      style={{
        ...props.style,
      }}
      {...props}
    />
  )
}

export { Separator }
