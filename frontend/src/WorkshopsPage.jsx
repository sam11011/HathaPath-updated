import { useEffect, useState } from "react";

function WorkshopsPage() {

  const [workshops, setWorkshops] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/workshops")
      .then(res => res.json())
      .then(data => setWorkshops(data))
      .catch(() => setWorkshops([]));
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Upcoming Workshops</h1>

      {workshops.length === 0 && (
        <p>No workshops available yet.</p>
      )}

      {workshops.map((w) => (
        <div key={w.id} style={{ marginBottom: "20px" }}>
          <h3>{w.title}</h3>
          <p>{w.dates}</p>
        </div>
      ))}

      <a href="/">Back to Home</a>
    </div>
  );
}

export default WorkshopsPage;