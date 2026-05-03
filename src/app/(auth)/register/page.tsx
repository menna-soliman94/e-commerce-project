"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AuthError, signUp } from "@/services/auth.services";
import { saveAuthData } from "@/lib/storage";

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    rePassword: "",
    phone: "",
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

    if (formData.password !== formData.rePassword) {
      setFieldErrors({
        rePassword: "Passwords do not match",
      });
      return;
    }

    try {
      setIsLoading(true);
      const data = await signUp(formData);
      const userId = data.user?._id || data.user?.id || "";
      const userName = data.user?.name || formData.name;

      if (!data.token) {
        throw new Error("Register failed");
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
        <p className="mb-10 text-2xl font-medium">Register Now!</p>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Name
            </label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="h-12"
            />
            {fieldErrors.name ? (
              <p className="text-sm text-red-500">{fieldErrors.name}</p>
            ) : null}
          </div>

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

          <div className="space-y-2">
            <label htmlFor="rePassword" className="block text-sm font-medium">
              RePassword
            </label>
            <Input
              id="rePassword"
              name="rePassword"
              type="password"
              value={formData.rePassword}
              onChange={handleChange}
              className="h-12"
            />
            {fieldErrors.rePassword ? (
              <p className="text-sm text-red-500">{fieldErrors.rePassword}</p>
            ) : null}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              Phone Number
            </label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="h-12"
            />
            {fieldErrors.phone ? (
              <p className="text-sm text-red-500">{fieldErrors.phone}</p>
            ) : null}
          </div>

          {error ? <p className="text-sm text-red-500">{error}</p> : null}

          <Button
            type="submit"
            className="h-12 w-full rounded-xl bg-black text-white hover:bg-black/90"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Register"}
          </Button>
        </form>

        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-black">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
