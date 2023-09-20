import React, { useState } from "react";
import WeekViewStripCalendar from "../../components/week-strip-calendar/WeekStripCalendar";
import { Paper } from "@mantine/core";
import "./studyOverviewPage.scss";

const StudyOverviewPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    <Paper className="study-overview-page-container">
      <WeekViewStripCalendar
        initialDate={selectedDate}
        onDayClick={(date) => {
          setSelectedDate(date);
        }}
      />

      {/* TODO: Replace with a call to backend for sessions */}
      {selectedDate.toString()}
    </Paper>
  );
};

export default StudyOverviewPage;
