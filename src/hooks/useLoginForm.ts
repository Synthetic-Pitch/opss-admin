import { ChangeEvent, FormEvent, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type LoginValues = {
  gmail: string;
  password: string;
};

type UseLoginFormOptions = {
  onSubmit?: (values: LoginValues, role: string, name: string) => void | Promise<void>;
};

const initialValues: LoginValues = {
  gmail: "",
  password: "",
};

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
      console.log("Attempting login with:", values);
      // Step 1: Login with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: values.gmail,
        password: values.password,
      });
      
      if (authError) throw new Error(authError.message);
      
      // Step 2: Fetch role from your USER table
      const { data: userData, error: userError } = await supabase
        .from("Admin")
        .select("role,name")
        .eq("id", authData.user.id)
        .single();
      console.log(userData);
      
      if (userError) throw new Error("User not found in system.");
      // Store name in sessionStorage if not already set
      if (!sessionStorage.getItem("adminName")) {
        sessionStorage.setItem("adminName", userData.name);
      }
      console.log("Login success, role:", userData.role);
      await options?.onSubmit?.(values, userData.role,userData.name);

    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      setSubmitError(message);
      console.error("Login failed:", message);
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