import { Link, useNavigate } from "@tanstack/react-router";
import dayjs from "dayjs";
import { useState } from "react";
import { Button } from "src/components/controls/Button/Button";
import { cn } from "src/utils/cn";
import { getNavigationDay } from "src/utils/getNavigationDay";
import type { Dayjs } from "dayjs";

type CalendarProps = {
  year?: number;
  month?: number; // 0-indexed (0 = January)
};

type CalendarDay = {
  day: Dayjs;
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

  const today = dayjs();
  const initialYear = year ?? today.year();
  const initialMonth = month ?? today.month();

  const [displayYear, setDisplayYear] = useState(initialYear);
  const [displayMonth, setDisplayMonth] = useState(initialMonth);

  // Get first day of the month (0 = Sunday)
  const firstDay = dayjs().year(displayYear).month(displayMonth).date(1).day();

  // Get number of days in the month
  const daysInMonth = dayjs()
    .year(displayYear)
    .month(displayMonth)
    .daysInMonth();

  // Previous month info
  const prevMonth = displayMonth === 0 ? 11 : displayMonth - 1;
  const prevMonthYear = displayMonth === 0 ? displayYear - 1 : displayYear;
  const prevMonthDays = dayjs()
    .year(prevMonthYear)
    .month(prevMonth)
    .endOf("month")
    .date();

  // Next month info
  const nextMonth = displayMonth === 11 ? 0 : displayMonth + 1;
  const nextMonthYear = displayMonth === 11 ? displayYear + 1 : displayYear;

  const calendarDays: CalendarDay[] = [];

  // Fill days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: dayjs()
        .year(prevMonthYear)
        .month(prevMonth)
        .date(prevMonthDays - i),
      isCurrentMonth: false,
    });
  }
  // Fill days of the current month
  for (let d = 1; d <= daysInMonth; d++) {
    calendarDays.push({
      day: dayjs().year(displayYear).month(displayMonth).date(d),
      isCurrentMonth: true,
    });
  }
  // Fill days from next month
  while (calendarDays.length < 42) {
    const nextDay = calendarDays.length - (firstDay + daysInMonth) + 1;

    calendarDays.push({
      day: dayjs().year(nextMonthYear).month(nextMonth).date(nextDay),
      isCurrentMonth: false,
    });
  }

  const handleSelect = (day: CalendarDay) => {
    // If selecting a day from prev/next month, update the displayed month
    if (!day.isCurrentMonth) {
      setDisplayYear(day.day.year());
      setDisplayMonth(day.day.month());
    }
  };

  const handlePrevMonth = () => {
    setDisplayMonth((prevDisplayMonth) => {
      if (prevDisplayMonth === 0) {
        setDisplayYear((y) => y - 1);
        return 11;
      }
      return prevDisplayMonth - 1;
    });
  };

  const handleNextMonth = () => {
    setDisplayMonth((prevDisplayMonth) => {
      if (prevDisplayMonth === 11) {
        setDisplayYear((y) => y + 1);
        return 0;
      }
      return prevDisplayMonth + 1;
    });
  };

  const handleToday = () => {
    const date = getNavigationDay(today);

    navigate({
      to: `/day/${date}`,
    });

    setDisplayYear(today.year());
    setDisplayMonth(today.month());
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

        {calendarDays.map((calendarDay, index) => {
          return (
            <Link
              to={`/day/${getNavigationDay(calendarDay.day)}`}
              key={index}
              className={cn(
                "h-7 w-7 text-sm text-center leading-7 rounded-full cursor-pointer select-none hover:bg-orange-200 hover:text-orange-500",
                !calendarDay.isCurrentMonth &&
                  "text-slate-400 bg-transparent hover:bg-slate-100 hover:text-slate-500"
              )}
              activeProps={{ className: "bg-orange-200 text-orange-500" }}
              inactiveProps={{
                className: cn(
                  calendarDay.day.isSame(today, "day")
                    ? "bg-slate-200 text-slate-500"
                    : calendarDay.isCurrentMonth
                      ? "text-slate-700 bg-transparent"
                      : ""
                ),
              }}
              onClick={() => handleSelect(calendarDay)}
              aria-hidden={false}
            >
              {calendarDay.day.date()}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
