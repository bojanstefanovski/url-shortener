import * as React from "react"
import { X, CheckCircle2, AlertTriangle } from "lucide-react"
import styles from "./alert.module.css"
import { CopyButton } from "./copy-to-clipboard"

type AlertVariant = "success" | "error"

interface AlertProps {
  variant: AlertVariant
  title: string
  description?: string
  url?: string
  onClose?: () => void
}

export const Alert: React.FC<AlertProps> = ({
  variant,
  title,
  description,
  url,
  onClose,
}) => {

  const variantClass =
    variant === "success" ? styles.success : styles.error

  const Icon =
    variant === "success" ? (
      <CheckCircle2 className={styles.iconSuccess} />
    ) : (
      <AlertTriangle className={styles.iconError} />
    )

  return (
    <div role="alert" className={`${styles.alert} ${variantClass}`}>
      {Icon}
      <div>
        <div className={styles.title}>{title}</div>
        {description && <div className={styles.description}>{description}</div>}
        {url && (
          <div className={styles.urlWrapper}>
            <a href={url} target="_blank" rel="noreferrer" className={styles.url}>
              {url}
            </a>
            <CopyButton text={url} />
          </div>
        )}
      </div>
      {onClose && (
        <button onClick={onClose} className={styles.closeButton}>
          <X className={styles.iconSmall} />
        </button>
      )}
    </div>
  )
}