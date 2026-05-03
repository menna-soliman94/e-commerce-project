"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthError, signIn } from "@/services/auth.services";
import { saveAuthData } from "@/lib/storage";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    setFieldErrors((prev) => ({
      ...prev,
      [event.target.name]: "",
    }));

    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setFieldErrors({});

    try {
      setIsLoading(true);
      const data = await signIn(formData);
      const userId = data.user?._id || data.user?.id || "";
      const userName = data.user?.name || "";

      if (!data.token) {
        throw new Error("Login failed");
      }

      saveAuthData(data.token, userId, userName);
      router.push("/products");
    } catch (error) {
      if (error instanceof AuthError) {
        if (error.param) {
          setFieldErrors({
            [error.param]: error.message,
          });
          return;
        }
        setError(error.message);
      } else if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="min-h-screen pt-28 pb-12">
      <div className="mx-auto max-w-5xl px-6">
        <h1 className="mb-4 text-5xl font-bold">Welcome to ShopMart</h1>
        <p className="mb-10 text-2xl font-medium">Login Now!</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className="h-12"
            />
            {fieldErrors.email ? (
              <p className="text-sm text-red-500">{fieldErrors.email}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <Input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className="h-12"
            />
            {fieldErrors.password ? (
              <p className="text-sm text-red-500">{fieldErrors.password}</p>
            ) : null}
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-black text-white hover:bg-black/90"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Login"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-black">
            Register
          </Link>
        </p>

        <p className="mt-3 text-sm text-gray-600">
          Forgot your password?{" "}
          <Link href="/forgetpassword" className="font-semibold text-black">
            Reset it
          </Link>
        </p>
      </div>
    </main>
  );
}
