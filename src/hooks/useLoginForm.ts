import { ChangeEvent, FormEvent, useState } from "react";

type LoginValues = {
  gmail: string;
  password: string;
};

type UseLoginFormOptions = {
  onSubmit?: (values: LoginValues, response: unknown) => void | Promise<void>;
};

const initialValues: LoginValues = {
  gmail: "",
  password: "",
};

const ADMIN_LOGIN_URL =
  "https://gbvpdhqscwuaymsddvms.supabase.co/functions/v1/admin-login";

export const useLoginForm = (options?: UseLoginFormOptions) => {
  const [values, setValues] = useState<LoginValues>(initialValues);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch(ADMIN_LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gmail: values.gmail,
          password: values.password,
        }),
      });
  
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const errorMessage =
          (data as { message?: string } | null)?.message ?? "Login request failed.";
        throw new Error(errorMessage);
      }

      const id =
        (data as { id?: string | number } | null)?.id ??
        (data as { data?: { id?: string | number } } | null)?.data?.id;

      console.log("Admin login success:", { id, response: data });
      await options?.onSubmit?.(values, data);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong during login.";
      setSubmitError(message);
      console.error("Admin login failed:", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => setValues(initialValues);

  return {
    values,
    isSubmitting,
    submitError,
    handleChange,
    handleSubmit,
    resetForm,
  };
};
