import { useEffect, useState } from "react";
import EventItem from "./components/EventItem";
import dayjs from "dayjs";
import "./App.css";
import { FaGithub } from "react-icons/fa";
import fallbackEvents from "./data/events.json";

function sortEvents(events) {
  const now = dayjs();

  return [...events].sort((a, b) => {
    const aStart = dayjs(a.start);
    const bStart = dayjs(b.start);

    const aEnded = now.isAfter(dayjs(a.end));
    const bEnded = now.isAfter(dayjs(b.end));

    if (aEnded !== bEnded) return aEnded ? 1 : -1;

    return aStart - bStart;
  });
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetch("https://evcdn.studiobutter.io.vn/events.json")
        .then((res) => {
          if (!res.ok) throw new Error("Fetch failed");
          return res.json();
        })
        .then(setEvents)
        .catch(() => {
          console.warn("Using fallback data");
          setEvents(fallbackEvents);
        })
        .finally(() => setLoading(false));
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearTimeout(timer);
  }, []);

  const sorted = sortEvents(events);

  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="brand">
            <span className="logo">Studio Butter</span>
            <span className="title">Event Tracker</span>
          </div>

          {loading && (
            <span className="loading-indicator">Loading events...</span>
          )}

          <div className="header-actions">
            <a
              href="https://github.com/studiobutter/event-tracker"
              target="_blank"
              rel="noopener noreferrer"
              className="github-btn"
              title="View on GitHub"
            >
              <FaGithub size={18} />
            </a>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="container">
        {sorted.map((e) => (
          <EventItem key={e.id} event={e} />
        ))}
      </main>
    </div>
  );
}
