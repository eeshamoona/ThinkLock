import React, { useState, useRef } from "react";
import { format, startOfWeek, addDays, isToday } from "date-fns";
import { Button, Group, Text, Popover, ActionIcon } from "@mantine/core";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Plus,
} from "tabler-icons-react";
import { MonthPicker } from "@mantine/dates";
import { TbCalendarBolt } from "react-icons/tb";
import "./weekStripCalendar.scss";
import { useModals } from "@mantine/modals";
import AddThinkSessionModal from "../add_think_session_modal/AddThinkSessionModal";
import { startOfDay } from "date-fns";

interface DayCardProps {
  day: Date;
  isSelected: boolean;
  onClick: () => void;
}

const DayCard = ({ day, isSelected, onClick }: DayCardProps) => {
  return (
    <Button
      variant="light"
      color={isSelected ? "blue" : isToday(day) ? "violet" : "gray"}
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
  addSuccessCallback?: () => Promise<void>;
}

const WeekViewStripCalendar = ({
  initialDate,
  onDayClick,
  addSuccessCallback,
}: WeekViewStripCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
  const navLeftRef = useRef<HTMLButtonElement>(null);
  const navRightRef = useRef<HTMLButtonElement>(null);
  const modals = useModals();

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
      <Popover position="bottom-start" offset={10}>
        <Popover.Target>
          <Button
            w={"8rem"}
            h={"3rem"}
            variant="light"
            p={"0.5rem"}
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
      <div className="week-view-container">
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
        <Group className="week-strip" spacing={"0.5rem"}>
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
      </div>

      <Group spacing={"0.5rem"}>
        {/* Today Button */}
        <ActionIcon
          color="violet"
          variant="light"
          w={"3.5rem"}
          h={"3rem"}
          onClick={() => {
            const today = startOfDay(new Date());
            setCurrentDate(today);
            setSelectedDate(today);
            onDayClick(today);
          }}
          className="nav-button"
        >
          <TbCalendarBolt />
        </ActionIcon>

        <ActionIcon
          color="blue"
          variant="light"
          w={"3.5rem"}
          h={"3rem"}
          onClick={() =>
            modals.openModal({
              title: "Add Think Session",
              size: "md",
              children: (
                <AddThinkSessionModal
                  thinkSessionDate={selectedDate as Date}
                  successCallback={addSuccessCallback}
                />
              ),
            })
          }
        >
          <Plus />
        </ActionIcon>
      </Group>
    </Group>
  );
};

export default WeekViewStripCalendar;
