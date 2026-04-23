"use client";

import { useState } from "react";

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  type: "campaign" | "content" | "reminder";
}

export default function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [events] = useState<CalendarEvent[]>([
    {
      id: "1",
      title: "Launch Instagram Campaign",
      date: new Date(2026, 3, 25),
      type: "campaign",
    },
    {
      id: "2",
      title: "YouTube Video Release",
      date: new Date(2026, 3, 28),
      type: "content",
    },
    {
      id: "3",
      title: "Review Analytics",
      date: new Date(2026, 3, 30),
      type: "reminder",
    },
  ]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const hasEvent = (day: number) => {
    return events.some(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const getEventsForDate = (day: number) => {
    return events.filter(
      (event) =>
        event.date.getDate() === day &&
        event.date.getMonth() === currentDate.getMonth() &&
        event.date.getFullYear() === currentDate.getFullYear()
    );
  };

  const renderCalendarDays = () => {
    const days = [];
    const totalDays = daysInMonth(currentDate);
    const firstDay = firstDayOfMonth(currentDate);

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="calendar-day empty" />
      );
    }

    // Days of the month
    for (let day = 1; day <= totalDays; day++) {
      const isSelected =
        selectedDate?.getDate() === day &&
        selectedDate?.getMonth() === currentDate.getMonth() &&
        selectedDate?.getFullYear() === currentDate.getFullYear();

      days.push(
        <button
          key={day}
          className={`calendar-day ${isToday(day) ? "today" : ""} ${
            isSelected ? "selected" : ""
          } ${hasEvent(day) ? "has-event" : ""}`}
          onClick={() =>
            setSelectedDate(
              new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
            )
          }
          aria-label={`${monthNames[currentDate.getMonth()]} ${day}, ${currentDate.getFullYear()}`}
        >
          <span className="day-number">{day}</span>
          {hasEvent(day) && <span className="event-dot" />}
        </button>
      );
    }

    return days;
  };

  return (
    <section className="calendar-section" style={{ padding: "4rem 0" }}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 style={{ fontSize: "2.5rem", fontWeight: 700, marginBottom: "1rem" }}>
            📅 Campaign Calendar
          </h2>
          <p style={{ fontSize: "1.125rem", opacity: 0.7 }}>
            Plan and schedule your content strategy
          </p>
        </div>

        <div className="calendar-container" style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div className="calendar-card" style={{
            background: "var(--card)",
            borderRadius: "16px",
            padding: "2rem",
            border: "1px solid var(--border)",
            boxShadow: "0 20px 60px rgba(124, 77, 255, 0.1)"
          }}>
            {/* Calendar Header */}
            <div className="calendar-header" style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "2rem"
            }}>
              <button
                onClick={previousMonth}
                className="calendar-nav"
                style={{
                  padding: "0.5rem 1rem",
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1.25rem"
                }}
                aria-label="Previous month"
              >
                ←
              </button>
              <h3 style={{ fontSize: "1.5rem", fontWeight: 600, color: "var(--text)" }}>
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={nextMonth}
                className="calendar-nav"
                style={{
                  padding: "0.5rem 1rem",
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "1.25rem"
                }}
                aria-label="Next month"
              >
                →
              </button>
            </div>

            {/* Day Labels */}
            <div className="calendar-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "0.5rem",
              marginBottom: "0.5rem"
            }}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                <div
                  key={day}
                  className="day-label"
                  style={{
                    textAlign: "center",
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    color: "var(--text)",
                    opacity: 0.6,
                    padding: "0.5rem"
                  }}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Days */}
            <div className="calendar-grid" style={{
              display: "grid",
              gridTemplateColumns: "repeat(7, 1fr)",
              gap: "0.5rem"
            }}>
              {renderCalendarDays()}
            </div>

            {/* Selected Date Events */}
            {selectedDate && (
              <div className="calendar-events" style={{
                marginTop: "2rem",
                padding: "1.5rem",
                background: "rgba(124, 77, 255, 0.05)",
                borderRadius: "12px",
                border: "1px solid rgba(124, 77, 255, 0.2)"
              }}>
                <h4 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem" }}>
                  Events for {selectedDate.toLocaleDateString()}
                </h4>
                {getEventsForDate(selectedDate.getDate()).length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                    {getEventsForDate(selectedDate.getDate()).map((event) => (
                      <div
                        key={event.id}
                        className="event-item"
                        style={{
                          padding: "0.75rem",
                          background: "var(--card)",
                          borderRadius: "8px",
                          border: "1px solid var(--border)",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.75rem"
                        }}
                      >
                        <span style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          background: event.type === "campaign"
                            ? "#7C4DFF"
                            : event.type === "content"
                            ? "#35E3FF"
                            : "#FFD76A"
                        }} />
                        <span style={{ flex: 1, fontSize: "0.9375rem" }}>{event.title}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={{ opacity: 0.6, fontSize: "0.9375rem" }}>No events scheduled</p>
                )}
              </div>
            )}
          </div>
        </div>

        <style jsx>{`
          .calendar-day {
            aspect-ratio: 1;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: var(--card);
            border: 1px solid var(--border);
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
            position: relative;
            min-height: 60px;
          }

          .calendar-day:not(.empty):hover {
            background: rgba(124, 77, 255, 0.1);
            border-color: rgba(124, 77, 255, 0.3);
            transform: translateY(-2px);
          }

          .calendar-day.empty {
            cursor: default;
            opacity: 0.3;
          }

          .calendar-day.today {
            background: linear-gradient(135deg, rgba(124, 77, 255, 0.2) 0%, rgba(53, 227, 255, 0.2) 100%);
            border-color: #7C4DFF;
            font-weight: 700;
          }

          .calendar-day.selected {
            background: linear-gradient(135deg, #7C4DFF 0%, #35E3FF 100%);
            color: white;
            border-color: #7C4DFF;
          }

          .calendar-day.has-event .day-number {
            font-weight: 600;
          }

          .day-number {
            font-size: 0.9375rem;
            color: var(--text);
          }

          .calendar-day.selected .day-number {
            color: white;
          }

          .event-dot {
            position: absolute;
            bottom: 6px;
            width: 4px;
            height: 4px;
            border-radius: 50%;
            background: #7C4DFF;
          }

          .calendar-day.selected .event-dot {
            background: white;
          }

          .calendar-nav:hover {
            background: rgba(124, 77, 255, 0.1);
            border-color: rgba(124, 77, 255, 0.3);
          }

          @media (max-width: 640px) {
            .calendar-day {
              min-height: 50px;
              font-size: 0.875rem;
            }

            .day-number {
              font-size: 0.875rem;
            }
          }
        `}</style>
      </div>
    </section>
  );
}
