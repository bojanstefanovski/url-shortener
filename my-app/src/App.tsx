import { useForm } from "react-hook-form";
import { errorMessages, type ErrorCode } from "./error/messages";

type FormValues = {
  longUrl: string;
};

type ApiSuccess = { 
  ok: true; 
  message?: string; 
  data: { slug: string; longUrl: string } 
};

type ApiError = { 
  ok: false; 
  error: ErrorCode 
};

type ApiResponse = ApiSuccess | ApiError;

export const App =() => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const jsonResponse: ApiResponse = await res.json().catch(() => null);
      console.log(jsonResponse)
      if (!res.ok || jsonResponse?.ok === false) {
        console.log(jsonResponse)
        const code = (jsonResponse && 'error' in jsonResponse && typeof jsonResponse.error === "string")
          ? jsonResponse.error
          : "internal_error";
        alert(errorMessages[code] ?? "Erreur serveur");
        return;
      }

      if (res.status === 201 && jsonResponse && 'data' in jsonResponse) {
        alert(`Nouvelle URL courte créée : http://localhost:3000/${jsonResponse.data.slug}`);
      } else if (res.status === 200 && jsonResponse && 'data' in jsonResponse) {
        alert(`Cette URL existait déjà : http://localhost:3000/${jsonResponse.data.slug}`);
      }
    } catch {
      alert(`Erreur : ${errorMessages.err ?? "Erreur inconnue"}`);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>URL Shortener</h1>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input
          type="url"
          placeholder="https://example.com"
          {...register("longUrl", {
            required: "URL obligatoire",
            pattern: {
              value: /^https?:\/\/.+$/i,
              message: "Doit être une URL http(s) valide",
            },
          })}
          style={{ width: "20rem", marginRight: "1rem", height: "2rem" }}
        />
        <button type="submit">Raccourcir</button>
      </form>

      {errors.longUrl && (
        <p style={{ color: "red" }}>{errors.longUrl.message}</p>
      )}
    </div>
  );
}