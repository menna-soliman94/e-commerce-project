import {
  AuthResponseI,
  ForgotPasswordDataI,
  ResetPasswordDataI,
  SignInDataI,
  SignUpDataI,
  VerifyResetCodeDataI,
} from "@/types/auth";

const API_URL = process.env.NEXT_PUBLIC_BASE_URL;

class AuthError extends Error {
  param?: string;

  constructor(message: string, param?: string) {
    super(message);
    this.param = param;
  }
}

async function signUp(values: SignUpDataI): Promise<AuthResponseI> {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new AuthError(
      data.errors?.msg || data.message || "Failed to register",
      data.errors?.param,
    );
  }

  return data;
}

async function signIn(values: SignInDataI): Promise<AuthResponseI> {
  const response = await fetch(`${API_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new AuthError(
      data.errors?.msg || data.message || "Failed to login",
      data.errors?.param,
    );
  }

  return data;
}

async function forgotPassword(
  values: ForgotPasswordDataI,
): Promise<AuthResponseI> {
  const response = await fetch(`${API_URL}/auth/forgotPasswords`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new AuthError(
      data.errors?.msg || data.message || "Failed to send reset code",
      data.errors?.param,
    );
  }

  return data;
}

async function verifyResetCode(
  values: VerifyResetCodeDataI,
): Promise<AuthResponseI> {
  const response = await fetch(`${API_URL}/auth/verifyResetCode`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new AuthError(
      data.errors?.msg || data.message || "Failed to verify reset code",
      data.errors?.param,
    );
  }

  return data;
}

async function resetPassword(
  values: ResetPasswordDataI,
): Promise<AuthResponseI> {
  const response = await fetch(`${API_URL}/auth/resetPassword`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  });
  const data = await response.json();

  if (!response.ok) {
    throw new AuthError(
      data.errors?.msg || data.message || "Failed to reset password",
      data.errors?.param,
    );
  }

  return data;
}

export {
  signUp,
  signIn,
  forgotPassword,
  verifyResetCode,
  resetPassword,
  AuthError,
};
