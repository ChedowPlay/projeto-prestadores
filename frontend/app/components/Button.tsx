import COLORS from "@/app/stylesheets/colors";

interface ButtonProps {
  text: React.ReactNode;
  color: string;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  children?: React.ReactNode;
}

const resolveTextColor = (background: string) => {
  if (background === COLORS.primary) return "#ffffff";
  if (background === COLORS.danger) return "#ffffff";
  return "#0f172a";
};

const Button: React.FC<ButtonProps> = ({
  text,
  color,
  className = "",
  disabled,
  onClick,
  type = "button",
}) => {
  return (
    <button
      type={type}
      className={`button-secondary ${className} me-2 align-self-center`.trim()}
      onClick={onClick}
      disabled={disabled}
      style={{
        backgroundColor: color,
        color: resolveTextColor(color),
      }}
    >
      <span>{text}</span>
    </button>
  );
};

export default Button;
