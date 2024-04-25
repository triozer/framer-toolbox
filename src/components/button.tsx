type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "destructive";
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<ButtonProps> = ({ children, variant, ...props }) => {
  return (
    <button className={`framer-button-${variant ?? "primary"}`} {...props}>
      <span>{children}</span>
    </button>
  );
};

export default Button;
