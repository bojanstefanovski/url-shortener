import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

import { errorMessages, type ErrorCode } from "./error/messages"
import { Alert } from "./components/alert"
import styles from "./app.module.css"


const formSchema = z.object({
  longUrl: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^https?:\/\/\S+$/i.test(val),
      { message: "Must be a valid URL" }
    ),
})

type ApiSuccess = {
  ok: true
  message?: string
  data: { slug: string; longUrl: string }
}
type ApiError = { ok: false; error: ErrorCode }
type ApiResponse = ApiSuccess | ApiError

export const App = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const [alert, setAlert] = React.useState<{
    variant: "success" | "error"
    title: string
    description?: string
    url?: string
  } | null>(null)

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setAlert(null)
    try {
      const res = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      })
      const json: ApiResponse | null = await res.json().catch(() => null)

      if (!res.ok || !json || (json as ApiError).ok === false) {
        const code: ErrorCode =
          (json && "error" in json && typeof json.error === "string"
            ? json.error
            : "internal_error") as ErrorCode

        setAlert({
          variant: "error",
          title: "Error",
          description: errorMessages[code] ?? "Server error",
        })
        return
      }

      const success = json as ApiSuccess
      const shortUrl = `http://localhost:3000/${success.data.slug}`

      if (res.status === 201 || success.message === "slug_created") {
        setAlert({
          variant: "success",
          title: "New URL created",
          description: "Your URL has been shortened successfully.",
          url: shortUrl,
        })
      } else {
        setAlert({
          variant: "success",
          title: "URL already exists",
          description: "This short URL already existed.",
          url: shortUrl,
        })
      }

      reset()
    } catch {
      setAlert({
        variant: "error",
        title: "Error",
        description: errorMessages.internal_error ?? "Unknown error",
      })
    }
  }

  return (
    <div className={styles.wrapper}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
        URL Shortener
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        style={{ display: "flex", gap: 8, alignItems: "flex-start" }}
      >
        <div>
          <input
            placeholder="https://example.com"
            {...register("longUrl")}
            style={{
              width: "25rem",
              height: 36,
              padding: "0 12px",
              border: "1px solid #ddd",
              borderRadius: 6,
            }}
          />
          <p className={styles.fieldError}>
            {errors.longUrl?.message ?? "\u00A0"}
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            height: 36,
            padding: "0 16px",
            borderRadius: 6,
            background: "#000",
            color: "#fff",
            opacity: isSubmitting ? 0.6 : 1,
          }}
        >
          {isSubmitting ? "…" : "Shorten"}
        </button>
      </form>

      <div className={styles.alertSlot}>
        {alert && (
          <div className={`${styles.alertEnter} ${styles.alertShow}`}>
            <Alert
              variant={alert.variant}
              title={alert.title}
              description={alert.description}
              url={alert.url}
              onClose={() => setAlert(null)}
            />
          </div>
        )}
      </div>
    </div>
  )
}