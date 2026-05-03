"use client";

import Link from "next/link";
import { ChangeEvent, FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AuthError,
  forgotPassword,
  resetPassword,
  verifyResetCode,
} from "@/services/auth.services";

export default function ForgetPassword() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [resetCode, setResetCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function clearFieldError(name: string) {
    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  }

  function handleEmailChange(event: ChangeEvent<HTMLInputElement>) {
    clearFieldError("email");
    setEmail(event.target.value);
  }

  function handleCodeChange(event: ChangeEvent<HTMLInputElement>) {
    clearFieldError("resetCode");
    setResetCode(event.target.value);
  }

  function handlePasswordChange(event: ChangeEvent<HTMLInputElement>) {
    clearFieldError("newPassword");
    setNewPassword(event.target.value);
  }

  async function handleSendCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    try {
      setIsLoading(true);
      const data = await forgotPassword({ email });
      setSuccess(data.message || "Reset code sent successfully");
      setStep(2);
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

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    try {
      setIsLoading(true);
      const data = await verifyResetCode({ resetCode });
      setSuccess(data.statusMsg || data.message || "Code verified successfully");
      setStep(3);
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

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setFieldErrors({});

    try {
      setIsLoading(true);
      const data = await resetPassword({
        email,
        newPassword,
      });

      setSuccess(data.message || "Password reset successfully");

      setTimeout(() => {
        router.push("/login");
      }, 1200);
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
        <p className="mb-10 text-2xl font-medium">Reset Your Password</p>

        <div className="mb-8 flex items-center gap-3 text-sm text-gray-600">
          <span className={step >= 1 ? "font-semibold text-black" : ""}>
            1. Email
          </span>
          <span>/</span>
          <span className={step >= 2 ? "font-semibold text-black" : ""}>
            2. Code
          </span>
          <span>/</span>
          <span className={step >= 3 ? "font-semibold text-black" : ""}>
            3. New Password
          </span>
        </div>

        {step === 1 ? (
          <form className="space-y-6" onSubmit={handleSendCode}>
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={handleEmailChange}
                className="h-12"
              />
              {fieldErrors.email ? (
                <p className="text-sm text-red-500">{fieldErrors.email}</p>
              ) : null}
            </div>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            {success ? <p className="text-sm text-green-600">{success}</p> : null}

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-black text-white hover:bg-black/90"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Code"}
            </Button>
          </form>
        ) : null}

        {step === 2 ? (
          <form className="space-y-6" onSubmit={handleVerifyCode}>
            <div className="space-y-2">
              <label htmlFor="resetCode" className="block text-sm font-medium">
                Reset Code
              </label>
              <Input
                id="resetCode"
                name="resetCode"
                value={resetCode}
                onChange={handleCodeChange}
                className="h-12"
              />
              {fieldErrors.resetCode ? (
                <p className="text-sm text-red-500">{fieldErrors.resetCode}</p>
              ) : null}
            </div>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            {success ? <p className="text-sm text-green-600">{success}</p> : null}

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-black text-white hover:bg-black/90"
              disabled={isLoading}
            >
              {isLoading ? "Verifying..." : "Verify Code"}
            </Button>
          </form>
        ) : null}

        {step === 3 ? (
          <form className="space-y-6" onSubmit={handleResetPassword}>
            <div className="space-y-2">
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium"
              >
                New Password
              </label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={newPassword}
                onChange={handlePasswordChange}
                className="h-12"
              />
              {fieldErrors.newPassword ? (
                <p className="text-sm text-red-500">
                  {fieldErrors.newPassword}
                </p>
              ) : null}
              {fieldErrors.password ? (
                <p className="text-sm text-red-500">{fieldErrors.password}</p>
              ) : null}
            </div>

            {error ? <p className="text-sm text-red-500">{error}</p> : null}
            {success ? <p className="text-sm text-green-600">{success}</p> : null}

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-black text-white hover:bg-black/90"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        ) : null}

        <p className="mt-6 text-sm text-gray-600">
          Back to{" "}
          <Link href="/login" className="font-semibold text-black">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
