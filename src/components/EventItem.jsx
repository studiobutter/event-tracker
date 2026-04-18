import { useEffect, useState } from "react";
import dayjs from "./time.jsx";

const UPDATE_INTERVAL_MS = 1000;

function getStatus(now, start, end) {
  if (now.isBefore(start)) return "upcoming";
  if (now.isAfter(end)) return "ended";
  return "ongoing";
}

function formatDiff(now, target) {
  const diff = target.diff(now);

  if (diff <= 0) return "0s";

  const d = Math.floor(diff / (1000 * 60 * 60 * 24));
  const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const m = Math.floor((diff / (1000 * 60)) % 60);
  const s = Math.floor((diff / 1000) % 60);

  return `${d}d ${h}h ${m}m ${s}s`;
}

export default function EventItem({ event }) {
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const interval = setInterval(() => setNow(dayjs()), UPDATE_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const start = event.timezone
    ? dayjs.tz(event.start, event.timezone)
    : dayjs(event.start);

  const end = event.timezone
    ? dayjs.tz(event.end, event.timezone)
    : dayjs(event.end);
  const status = getStatus(now, start, end);

  let label;
  if (status === "upcoming") label = `Starts in ${formatDiff(now, start)}`;
  else if (status === "ongoing") label = `Ends in ${formatDiff(now, end)}`;
  else if (status === "ended") label = "Event ended";

  const localStart = start.local();
  const localOffset = localStart.format("ZZ");
  return (
    <div
      className={`card ${status}`}
      style={{ borderLeft: `4px solid ${event.color || "#666"}` }}
    >
      <h3>{event.title}</h3>
      <p aria-live="polite">{label}</p>
      <small className="event-time">
        {start.format("DD MMM YYYY, HH:mm")} ({event.timezone || "Local"})
      </small>

      {event.timezone && (
        <small className="event-time">
          Your time: {localStart.format("DD MMM HH:mm")} ({localOffset})
        </small>
      )}
    </div>
  );
}
