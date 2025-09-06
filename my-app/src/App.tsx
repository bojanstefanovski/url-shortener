import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"

import { errorMessages, type ErrorCode } from "./error/messages";
import {z} from 'zod';

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ThemeProvider } from "@/components/theme-provider"
 


const formSchema = z.object({
  longUrl: z.url(),
})

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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const res = await fetch("http://localhost:3000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
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
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">

      <div className="container mx-auto max-w-xl gap-20 flex flex-col mt-20">

        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">URL Shortener</h1>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="longUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input placeholder="https://example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Shorten</Button>
          </form>
        </Form>
      </div>
      
    </ThemeProvider>

  );
}