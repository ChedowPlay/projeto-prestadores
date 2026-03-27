import styles from "@/app/stylesheets/BrandMark.module.css";

interface BrandMarkProps {
  compact?: boolean;
  showBadge?: boolean;
  subtitle?: string;
  onClick?: () => void;
  className?: string;
}

const BrandMarkContent = ({
  compact,
  showBadge,
  subtitle,
}: {
  compact: boolean;
  showBadge: boolean;
  subtitle: string;
}) => (
  <>
    <span className={styles.symbol} aria-hidden="true">
      <span className={styles.symbolCore}></span>
    </span>

    <span className={styles.textBlock}>
      <strong>Marca Modelo</strong>
      {!compact && <small>{subtitle}</small>}
    </span>

    {showBadge && <span className={styles.badge}>DEMO</span>}
  </>
);

const BrandMark = ({
  compact = false,
  showBadge = true,
  subtitle = "demo interativa",
  onClick,
  className = "",
}: BrandMarkProps) => {
  const classes = `${styles.brandMark} ${compact ? styles.compact : ""} ${
    onClick ? styles.clickable : ""
  } ${className}`.trim();

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-label="Marca Modelo"
        className={classes}
      >
        <BrandMarkContent compact={compact} showBadge={showBadge} subtitle={subtitle} />
      </button>
    );
  }

  return (
    <div className={classes}>
      <BrandMarkContent compact={compact} showBadge={showBadge} subtitle={subtitle} />
    </div>
  );
};

export default BrandMark;
