import { useEffect } from "react";

function LandingPage() {

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/analytics/visit", {
      method: "POST"
    });
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Hatha Path</h1>
      <p>Classical Yoga for Peak Physical Fitness & Mental Wellbeing</p>

      <h2>Practices</h2>
      <ul>
        <li>Surya Kriya</li>
        <li>Yogasanas</li>
        <li>Angamardana</li>
        <li>Bhuta Shuddhi</li>
        <li>Wellness Modules</li>
      </ul>

      <p>
        <a href="/workshops">View Upcoming Workshops</a>
      </p>
    </div>
  );
}

export default LandingPage;