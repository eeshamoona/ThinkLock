import React, { useState, useRef } from "react";
import { format, startOfWeek, addDays, isToday } from "date-fns";
import { Button, Group, Text, Popover } from "@mantine/core";
import { ChevronRight, ChevronLeft, ChevronDown } from "tabler-icons-react";
import { MonthPicker } from "@mantine/dates";
import "./weekStripCalendar.scss";

interface DayCardProps {
  day: Date;
  isSelected: boolean;
  onClick: () => void;
}

const DayCard = ({ day, isSelected, onClick }: DayCardProps) => {
  return (
    <Button
      variant="light"
      color={isSelected ? "blue" : isToday(day) ? "indigo" : "gray"}
      p={"0.3rem"}
      w={"3rem"}
      h={"3rem"}
      onClick={onClick}
      className={`day-card`}
    >
      <div className="day-info">
        <Text size="xs" weight={700}>
          {format(day, "EE")}
        </Text>
        <Text size="sm">{format(day, "dd")}</Text>
      </div>
    </Button>
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
      {/* Month Picker */}
      <Popover position="bottom" offset={10}>
        <Popover.Target>
          <Button
            w={"8rem"}
            h={"2.5rem"}
            variant="light"
            rightIcon={<ChevronDown size={18} />}
          >
            <Text size="sm">{format(currentDate, "MMM yyyy")}</Text>
          </Button>
        </Popover.Target>
        <Popover.Dropdown>
          <MonthPicker
            value={currentDate}
            onChange={(date) => {
              if (date) {
                setCurrentDate(date as Date);
              }
            }}
          />
        </Popover.Dropdown>
      </Popover>
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
