import React, { useState, useRef } from "react";
import { format, startOfWeek, addDays, isToday } from "date-fns";
import { Button, Group, Text, Card } from "@mantine/core";
import { ChevronRight, ChevronLeft } from "tabler-icons-react";
import "./weekStripCalendar.scss";

interface DayCardProps {
  day: Date;
  isSelected: boolean;
  onClick: () => void;
}

const DayCard = ({ day, isSelected, onClick }: DayCardProps) => {
  return (
    <Card
      shadow="sm"
      p={"0.3rem"}
      w={"3rem"}
      onClick={onClick}
      style={
        isToday(day) && !isSelected
          ? { borderColor: "var(--mantine-color-blue-6)" }
          : {}
      }
      className={isSelected ? "selected" : "day-card"}
    >
      <div className="day-info">
        <Text size="xs" weight={700}>
          {format(day, "EE")}
        </Text>
        <Text size="sm">{format(day, "dd")}</Text>
      </div>
    </Card>
  );
};

interface WeekViewStripCalendarProps {
  initialDate: Date;
  onDayClick: (date: Date) => void;
}

const WeekViewStripCalendar = ({
  initialDate,
  onDayClick,
}: WeekViewStripCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const navLeftRef = useRef<HTMLButtonElement>(null);
  const navRightRef = useRef<HTMLButtonElement>(null);

  // Function to navigate to the previous week
  const goToPreviousWeek = () => {
    setCurrentDate((prevDate) => addDays(prevDate, -7));
  };

  // Function to navigate to the next week
  const goToNextWeek = () => {
    setCurrentDate((prevDate) => addDays(prevDate, 7));
  };

  // Handle keyboard navigation
  const handleKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === "ArrowLeft") {
      navLeftRef.current?.click();
    } else if (event.key === "ArrowRight") {
      navRightRef.current?.click();
    }
  };

  return (
    <Group className="week-view-strip-calendar">
      {/* Navigation Left */}
      <Button
        color="blue"
        variant="light"
        onClick={goToPreviousWeek}
        className="nav-button"
        onKeyDown={handleKeyDown}
        ref={navLeftRef}
      >
        <ChevronLeft />
      </Button>

      {/* Week Strip */}
      <Group className="week-strip">
        {Array.from({ length: 7 }, (_, index) => {
          const day = addDays(startOfWeek(currentDate), index);
          const isSelected =
            (selectedDate &&
              selectedDate.toDateString() === day.toDateString()) ||
            false;
          return (
            <DayCard
              key={index}
              day={day}
              isSelected={isSelected}
              onClick={() => {
                setSelectedDate(day);
                onDayClick(day);
              }}
            />
          );
        })}
      </Group>

      {/* Navigation Right */}
      <Button
        color="blue"
        variant="light"
        onClick={goToNextWeek}
        className="nav-button"
        onKeyDown={handleKeyDown}
        ref={navRightRef}
      >
        <ChevronRight />
      </Button>
    </Group>
  );
};

export default WeekViewStripCalendar;
