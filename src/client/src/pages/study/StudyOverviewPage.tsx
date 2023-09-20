import React from "react";
import WeekViewStripCalendar from "../../components/week-strip-calendar/WeekStripCalendar";
const StudyOverviewPage = () => {
  return (
    <div id="study-overview-page-container">
      <WeekViewStripCalendar initialDate={new Date()} onDayClick={() => {}} />
    </div>
  );
};

export default StudyOverviewPage;
