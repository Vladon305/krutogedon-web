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
import styles from "./LoginForm.module.scss";

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
    <Card className={styles.loginForm}>
      <CardHeader className={styles.loginForm__header}>
        <CardTitle className={styles.loginForm__title}>
          <LogIn className={styles.loginForm__titleIcon} /> Log In
        </CardTitle>
        <CardDescription className={styles.loginForm__description}>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <CardContent className={styles.loginForm__content}>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className={styles.loginForm__form}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className={styles.loginForm__inputWrapper}>
                      <Mail className={styles.loginForm__inputIcon} />
                      <Input
                        placeholder="you@example.com"
                        className={styles.loginForm__input}
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
                    <div className={styles.loginForm__inputWrapper}>
                      <Key className={styles.loginForm__inputIcon} />
                      <Input
                        type={showPassword ? "text" : "password"}
                        className={styles.loginForm__passwordInput}
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        className={styles.loginForm__togglePassword}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className={styles.loginForm__toggleIcon} />
                        ) : (
                          <Eye className={styles.loginForm__toggleIcon} />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className={styles.loginForm__submitButton}
              disabled={isLoading}
            >
              {isLoading ? "Вход..." : "Войти"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className={styles.loginForm__footer}>
        <div className={styles.loginForm__footerText}>
          Don't have an account?{" "}
          <Link to="/register" className={styles.loginForm__registerLink}>
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
