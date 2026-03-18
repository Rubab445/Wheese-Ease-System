import React, { useState, useCallback } from "react";
import InputField from "./InputField";
import GoogleButton from "./GoogleButton";
import { loginUser, loginWithGoogle } from "../../services/authService";

interface LoginFormProps {
  onSuccess?: (data: any) => void;
  onToast: (msg: string) => void;
}

interface FormErrors {
  identifier?: string;
  password?: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onSuccess, onToast }) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validate = useCallback(() => {
    const newErrors: FormErrors = {};
    const emailReg = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneReg = /^[+\d][\d\s-]{7,}$/;

    if (!identifier.trim()) {
      newErrors.identifier = "Email or phone number is required.";
    } else if (!emailReg.test(identifier) && !phoneReg.test(identifier)) {
      newErrors.identifier = "Please enter a valid email or phone number.";
    }

    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [identifier, password]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const data = await loginUser(identifier, password);
      onToast("Login successful! Redirecting...");
      onSuccess?.(data);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        "Invalid credentials. Please try again.";
      onToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = () => {
    onToast("Redirecting to Google...");
    loginWithGoogle();
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIdentifier(e.target.value);
    if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: "" }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) setErrors((prev) => ({ ...prev, password: "" }));
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      <InputField
        id="identifier"
        label="Email"
        type="text"
        value={identifier}
        onChange={handleIdentifierChange}
        placeholder="website@gmail.com"
        error={errors.identifier}
      />

      <InputField
        id="password"
        label="Password"
        type="password"
        value={password}
        onChange={handlePasswordChange}
        placeholder="Password"
        error={errors.password}
        isPassword
      />

      <button
        type="submit"
        disabled={loading}
        style={{
          width: "100%",
          height: "48px",
          borderRadius: "8px",
          border: "none",
          background: loading ? "#ccc" : "#4a90e2",
          color: "#fff",
          fontSize: "15px",
          fontWeight: "700",
          cursor: loading ? "not-allowed" : "pointer",
          transition: "background 0.2s",
          marginBottom: "12px",
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <GoogleButton onClick={handleGoogle} disabled={loading} />
    </form>
  );
};

export default LoginForm;
