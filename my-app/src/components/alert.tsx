import * as React from "react"
import { X, CheckCircle2, AlertTriangle, Copy, Check } from "lucide-react"
import styles from "./alert.module.css"

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
  const [copied, setCopied] = React.useState(false)

  const copyToClipboard = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch (e) {
      console.error("Failed to copy", e)
    }
  }

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
            <button onClick={copyToClipboard} className={styles.copyButton}>
              {copied ? (
                <Check className={styles.iconSmall} />
              ) : (
                <Copy className={styles.iconSmall} />
              )}
            </button>
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