interface ButtonProps {
  text: React.ReactNode;
  color: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({text, color, className, disabled, onClick}) => {
  return (
    <button className={`button-secondary ${className} me-2 align-self-center ${color}`} onClick={onClick} disabled={disabled}>
      <span>{text}</span>
    </button>
  )
}

export default Button;
