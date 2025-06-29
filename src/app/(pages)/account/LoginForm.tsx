"use client";
import { useState } from "react";
import axios from "axios";
import { useAppContext } from "../../context/AppContext";
import { setToken, setUser as saveUserToStorage } from "../../utils/storage";

type LoginFormProps = {
  onLoginSuccess: () => void;
  onSwitchToRegister: () => void;
};

export default function LoginForm({
  onLoginSuccess,
  onSwitchToRegister,
}: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { setUser } = useAppContext();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email,
        password,
      });

      const { access_token, user } = res.data;

      // Lưu token & user
      setToken(access_token);
      setUser(res.data.user);
      saveUserToStorage(user);

      console.log("✔️ Đăng nhập thành công");
      // 👉 Reload lại để MainMenu lấy đúng role
      window.location.href = "/";
      onLoginSuccess();
    } catch (err: any) {
      console.error(err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Đăng nhập</h2>

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          style={styles.input}
          required
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mật khẩu"
          style={styles.input}
          required
        />

        {error && <p style={styles.error}>{error}</p>}

        <button
          type="submit"
          style={{ ...styles.button, opacity: loading ? 0.7 : 1 }}
          disabled={loading}
        >
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>

        <button
          type="button"
          style={{ ...styles.button, backgroundColor: "#DB4437" }}
          onClick={() => {
            window.location.href = "http://localhost:8000/auth/google/redirect";
          }}
        >
          Đăng nhập với Google
        </button>

        <p style={styles.switchText}>
          Bạn chưa có tài khoản?{" "}
          <span onClick={onSwitchToRegister} style={styles.link}>
            Đăng ký
          </span>
        </p>
      </form>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "80vh",
    backgroundColor: "#f9f9f9",
  },
  form: {
    backgroundColor: "white",
    padding: "32px",
    borderRadius: "12px",
    boxShadow: "0 0 16px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "400px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    marginBottom: "8px",
    color: "#333",
  },
  input: {
    padding: "12px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
  },
  button: {
    padding: "12px",
    fontSize: "16px",
    backgroundColor: "#0070f3",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  switchText: {
    textAlign: "center",
    fontSize: "14px",
  },
  link: {
    color: "#0070f3",
    cursor: "pointer",
    fontWeight: "bold",
  },
  error: {
    color: "red",
    fontSize: "14px",
    textAlign: "center",
    marginTop: "-8px",
  },
};
