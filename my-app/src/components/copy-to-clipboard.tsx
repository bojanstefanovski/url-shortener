import { useState } from "react"
import { Copy, Check } from "lucide-react"
import styles from "./copy-to-clipboard.module.css"

export const CopyButton = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch (e) {
      console.error("Failed to copy", e)
    }
  }

  return (
    <button onClick={copyToClipboard} className={styles.button}>
      {copied ? (
        <Check className={styles.icon} />
      ) : (
        <Copy className={styles.icon} />
      )}
      {copied ? "Copié" : "Copier"}
    </button>
  )
}