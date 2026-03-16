import { useState } from "react";

function AdminDashboard() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(null);

  const login = async () => {

    const res = await fetch("http://127.0.0.1:8000/api/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await res.json();

    if (data.token) {
      setToken(data.token);
      alert("Login successful");
    } else {
      alert("Login failed");
    }
  };

  if (!token) {
    return (
      <div style={{ padding: "40px", fontFamily: "Arial" }}>
        <h1>Admin Login</h1>

        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <br /><br />

        <input
          placeholder="Password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <br /><br />

        <button onClick={login}>
          Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Admin Dashboard</h1>
      <p>You are logged in.</p>
    </div>
  );
}

export default AdminDashboard;