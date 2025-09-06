import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"
import { useState } from "react";
import { CheckCircle, AlertCircle, X } from "lucide-react";

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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CopyButton } from "@/components/ui/copy-button"
 


const formSchema = z.object({
  longUrl: z.string().min(1, "Please enter an URL").url()
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

type AlertState = {
  show: boolean;
  type: 'success' | 'error';
  title: string;
  message: string;
  url?: string;
};

export const App =() => {
  const [alert, setAlert] = useState<AlertState>({
    show: false,
    type: 'success',
    title: '',
    message: '',
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema)
  })

  const dismissAlert = () => {
    setAlert(prev => ({ ...prev, show: false }));
  };

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
        setAlert({
          show: true,
          type: 'error',
          title: 'Error',
          message: errorMessages[code] ?? "Server error"
        });
        return;
      }

      if ((res.status === 201 || res.status === 200) && jsonResponse && 'data' in jsonResponse) {
        const shortUrl = `http://localhost:3000/${jsonResponse.data.slug}`;
        setAlert({
          show: true,
          type: 'success',
          title: 'Short URL Created!',
          message: 'Your new short URL is ready.',
          url: shortUrl
        });
      }
    } catch {
      setAlert({
        show: true,
        type: 'error',
        title: 'Error',
        message: errorMessages.err ?? "Unknown error"
      });
    }
  };

  return (
    <ThemeProvider defaultTheme="dark">

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl gap-4 sm:gap-6 flex flex-col mt-8 sm:mt-12 md:mt-16 lg:mt-20">

        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">URL Shortener</h1>

        {alert.show && (
          <Alert variant={alert.type === 'error' ? 'destructive' : 'default'} className="relative">
            {alert.type === 'success' ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <AlertTitle className="flex items-center justify-between">
              {alert.title}
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-1 hover:bg-transparent"
                onClick={dismissAlert}
              >
                <X className="h-4 w-4" />
              </Button>
            </AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{alert.message}</p>
              {alert.url && (
                <div className="flex items-center justify-center gap-2 p-2 bg-muted rounded-md">
                  <code className="flex-1 text-sm break-all overflow-hidden">{alert.url}</code>
                  <CopyButton
                    text={alert.url}
                  />
                </div>
              )}
            </AlertDescription>
          </Alert>
        )}

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
            <Button type="submit" className="hover:cursor-pointer">Shorten</Button>
          </form>
        </Form>
      </div>
      
    </ThemeProvider>

  );
}