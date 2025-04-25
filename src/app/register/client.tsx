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
import { registerValidator } from "./validators";
import { register } from "./actions";

export function Client() {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center">
        <div className="bg-background rounded-xl border p-5 space-y-5 w-full max-w-sm">
          <h1 className="text-2xl font-semibold tracking-tight">Register</h1>
          <RegisterForm />
        </div>
      </div>
    </>
  );
}

function RegisterForm() {
  const form = useForm<z.infer<typeof registerValidator>>({
    resolver: zodResolver(registerValidator),
    defaultValues: {
      email: "",
      password: "",
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof registerValidator>) => {
    const result = await register(data);
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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder={"Іванов Іван Іванович"} {...field} />
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
          <FormMessage />

          <Button type="submit" className="w-full">
            Register
          </Button>
        </form>
      </Form>
    </>
  );
}
