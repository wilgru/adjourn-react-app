import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { cn } from "src/utils/cn";
import { getNavigationDay } from "src/utils/getNavigationDay";

type CalendarProps = {
  year?: number;
  month?: number; // 0-indexed (0 = January)
};

type CalendarDay = {
  day: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const Calendar = ({ year, month }: CalendarProps): JSX.Element => {
  const navigate = useNavigate();

  const today = new Date();
  const initialYear = year ?? today.getFullYear();
  const initialMonth = month ?? today.getMonth();

  const [displayYear, setDisplayYear] = useState(initialYear);
  const [displayMonth, setDisplayMonth] = useState(initialMonth);

  // Get first day of the month (0 = Sunday)
  const firstDay = new Date(displayYear, displayMonth, 1).getDay();

  // Get number of days in the month
  const daysInMonth = new Date(displayYear, displayMonth + 1, 0).getDate();

  // Previous month info
  const prevMonth = displayMonth === 0 ? 11 : displayMonth - 1;
  const prevMonthYear = displayMonth === 0 ? displayYear - 1 : displayYear;
  const prevMonthDays = new Date(prevMonthYear, prevMonth + 1, 0).getDate();

  // Next month info
  const nextMonth = displayMonth === 11 ? 0 : displayMonth + 1;
  const nextMonthYear = displayMonth === 11 ? displayYear + 1 : displayYear;

  const days: CalendarDay[] = [];

  // Fill days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    days.push({
      day: prevMonthDays - i,
      month: prevMonth,
      year: prevMonthYear,
      isCurrentMonth: false,
    });
  }
  // Fill days of the current month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({
      day: d,
      month: displayMonth,
      year: displayYear,
      isCurrentMonth: true,
    });
  }
  // Fill days from next month
  while (days.length < 42) {
    const nextDay = days.length - (firstDay + daysInMonth) + 1;
    days.push({
      day: nextDay,
      month: nextMonth,
      year: nextMonthYear,
      isCurrentMonth: false,
    });
  }

  const isToday = (day: CalendarDay) =>
    day.year === today.getFullYear() &&
    day.month === today.getMonth() &&
    day.day === today.getDate();

  const handleSelect = (day: CalendarDay) => {
    // If selecting a day from prev/next month, update the displayed month
    if (!day.isCurrentMonth) {
      setDisplayYear(day.year);
      setDisplayMonth(day.month);
    }
  };

  const handlePrevMonth = () => {
    setDisplayMonth((prev) => {
      if (prev === 0) {
        setDisplayYear((y) => y - 1);
        return 11;
      }
      return prev - 1;
    });
  };

  const handleNextMonth = () => {
    setDisplayMonth((prev) => {
      if (prev === 11) {
        setDisplayYear((y) => y + 1);
        return 0;
      }
      return prev + 1;
    });
  };

  const handleToday = () => {
    const date = getNavigationDay(today);

    navigate({
      to: `/hey/${date}`,
    });

    setDisplayYear(today.getFullYear());
    setDisplayMonth(today.getMonth());
  };

  return (
    <div className="px-2">
      <div className="flex justify-between items-center mb-2">
        <span className="ml-1 font-title text-md text-slate-400">
          {MONTH_NAMES[displayMonth]} {displayYear}
        </span>

        <div className="flex items-center gap-1">
          <Button
            onClick={handlePrevMonth}
            iconName="caretLeft"
            variant="ghost"
            size="sm"
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="circle"
            onClick={handleToday}
          />
          <Button
            onClick={handleNextMonth}
            iconName="caretRight"
            variant="ghost"
            size="sm"
          />
        </div>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <h3
            key={d}
            className="font-medium text-sm text-slate-700 text-center"
          >
            {d}
          </h3>
        ))}

        {days.map((day, idx) => {
          const date = new Date(day.year, day.month, day.day);

          return (
            <Link
              to={`/day/${getNavigationDay(date)}`}
              key={idx}
              className={cn(
                "h-7 w-7 text-sm text-center leading-7 rounded-full cursor-pointer select-none hover:bg-orange-200 hover:text-orange-500",
                !day.isCurrentMonth &&
                  "text-slate-400 bg-transparent hover:bg-slate-100 hover:text-slate-500"
              )}
              activeProps={{ className: "bg-orange-200 text-orange-500" }}
              inactiveProps={{
                className: cn(
                  isToday(day)
                    ? "bg-slate-200 text-slate-500"
                    : day.isCurrentMonth
                      ? "text-slate-700 bg-transparent"
                      : ""
                ),
              }}
              onClick={() => handleSelect(day)}
              aria-hidden={false}
            >
              {day.day}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
