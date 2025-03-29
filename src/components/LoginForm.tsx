import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Mail, Key, Eye, EyeOff, LogIn } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useDispatch } from "react-redux";
import { loginUser } from "@/features/auth/authSlice";
import { useAuth } from "@/hooks/useAuth";

// Login form schema
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

export const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const { login, isLoading, isAuthenticated } = useAuth();

  const params = new URLSearchParams(location.search);
  const redirect = params.get("redirect") || "/";

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async ({ email, password }: z.infer<typeof loginSchema>) => {
    // This would connect to your auth system
    console.log("Login submitted:", email, password);
    try {
      await login(email, password);
      if (isAuthenticated) {
        toast.success("Logged in successfully");
      }
      navigate(redirect);
    } catch (error) {
      toast.error(error.message || "Failed to login");
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-0 glass-panel overflow-hidden">
      <CardHeader className="space-y-1 text-center bg-gradient-to-r from-purple-500 to-indigo-600 text-white">
        <CardTitle className="text-2xl font-bold">
          <LogIn className="w-6 h-6 inline mr-2" /> Log In
        </CardTitle>
        <CardDescription className="text-white/80">
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="you@example.com"
                        className="pl-10"
                        {...field}
                      />
                    </div>
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
                    <div className="relative">
                      <Key className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        className="pl-10 pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className="absolute right-0 top-0 h-full px-3 py-2 text-muted-foreground"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2 border-t pt-4">
        <div className="text-sm text-center text-muted-foreground">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
