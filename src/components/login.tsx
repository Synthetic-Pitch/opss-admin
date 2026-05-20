import { useLoginForm } from "../hooks/useLoginForm";

const Login = () => {
  const { values, isSubmitting, submitError, handleChange, handleSubmit } =
    useLoginForm();

  return (
    <form onSubmit={handleSubmit} className="w-[58%] text-white">
      <div className="mb-[7%] border-b border-white/70 pb-[1.2%]">
        <label htmlFor="gmail" className="mb-[2%] block text-[2.2vh]">
          gmail
        </label>
        <input
          id="gmail"
          name="gmail"
          type="email"
          value={values.gmail}
          onChange={handleChange}
          className="w-full bg-transparent text-[2.2vh] outline-none"
          autoComplete="email"
          disabled={isSubmitting}
        />
      </div>

      <div className="border-b border-white/70 pb-[1.2%]">
        <label htmlFor="password" className="mb-[2%] block text-[2.2vh]">
          password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          value={values.password}
          onChange={handleChange}
          className="w-full bg-transparent text-[2.2vh] outline-none"
          autoComplete="current-password"
          disabled={isSubmitting}
        />
      </div>

      {submitError ? (
        <p className="mt-[3%] text-[1.8vh] text-[#ffd4d4]">{submitError}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="mt-[6%] w-[38%] rounded-full border border-white/80 py-[2%] text-[2vh] font-medium tracking-wide text-white transition hover:bg-white/15 cursor-pointer disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
};

export default Login;