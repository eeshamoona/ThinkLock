import React, { useState, useRef } from "react";
import { format, startOfWeek, addDays, isToday } from "date-fns";
import { Button, Group, Text, Popover, ActionIcon, Grid } from "@mantine/core";
import {
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  Plus,
  Space,
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
    <Group position="apart">
      <Group className="week-view-strip-calendar">
        {/* Month Picker */}
        <Popover position="bottom-start" offset={10}>
          <Popover.Target>
            <Button
              h={"3rem"}
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
          p={0}
          onClick={goToPreviousWeek}
          className="nav-button"
          onKeyDown={handleKeyDown}
          ref={navLeftRef}
        >
          <ChevronLeft />
        </Button>

        {/* Week Strip */}
        <Grid className="week-strip" grow columns={7}>
          {Array.from({ length: 7 }, (_, index) => {
            const day = addDays(startOfWeek(currentDate), index);
            const isSelected =
              (selectedDate &&
                selectedDate.toDateString() === day.toDateString()) ||
              false;
            return (
              <Grid.Col span={1} key={index} p={"0.3rem"}>
                <DayCard
                  key={index}
                  day={day}
                  isSelected={isSelected}
                  onClick={() => {
                    setSelectedDate(day);
                    onDayClick(day);
                  }}
                />
              </Grid.Col>
            );
          })}
        </Grid>

        {/* Navigation Right */}
        <Button
          color="blue"
          variant="light"
          p={0}
          onClick={goToNextWeek}
          className="nav-button"
          onKeyDown={handleKeyDown}
          ref={navRightRef}
        >
          <ChevronRight />
        </Button>

        {/* Today Button */}
        <Button
          color="violet"
          variant="light"
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
        </Button>
      </Group>

      <Button
        color="blue"
        variant="light"
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
      </Button>
    </Group>
  );
};

export default WeekViewStripCalendar;
