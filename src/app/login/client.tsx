"use client";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Form,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { loginValidator } from "./validators";
import { login } from "./actions";

export function Client() {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <div className="bg-background rounded-xl border p-5 space-y-5 max-w-sm w-full">
          <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
          <LoginForm />
        </div>
      </div>
    </>
  );
}

function LoginForm() {
  const form = useForm<z.infer<typeof loginValidator>>({
    resolver: zodResolver(loginValidator),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof loginValidator>) => {
    const result = await login(data);
    if (result && result.error) {
      form.setError("root", {
        message: result.message,
      });
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder={"john@gmail.com"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder={"********"} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {form.formState.errors.root && (
            <p>{form.formState.errors.root.message}</p>
          )}

          <Button type="submit" className="w-full">
            Login
          </Button>
        </form>
      </Form>
    </>
  );
}
