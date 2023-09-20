import React, { useState } from "react";
import WeekViewStripCalendar from "../../components/week-strip-calendar/WeekStripCalendar";
import { getAllThinkSessionsByDate } from "../../services/thinkSessionAPICallerService";
import { Paper, SimpleGrid } from "@mantine/core";
import ThinkSessionCard from "../../components/think_session/ThinkSessionItem";
import "./studyOverviewPage.scss";
import { ThinkSession } from "../../utils/models/thinksession.model";

const StudyOverviewPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [thinkSessions, setThinkSessions] = useState<ThinkSession[]>([]);
  const [updateDataFlag, setUpdateDataFlag] = useState<boolean>(false);

  const getThinkSessionsWithDate = async (date: Date) => {
    const thinkSessions = await getAllThinkSessionsByDate(date);
    if (typeof thinkSessions !== "string") {
      setThinkSessions(thinkSessions);
      setUpdateDataFlag(!updateDataFlag);
    }
  };

  return (
    <Paper className="study-overview-page-container">
      <WeekViewStripCalendar
        initialDate={selectedDate}
        onDayClick={(date) => {
          setSelectedDate(date);
          getThinkSessionsWithDate(date);
        }}
      />

      <SimpleGrid
        className="think-session-grid"
        spacing="sm"
        cols={2}
        p={"1rem"}
      >
        {thinkSessions?.map((thinkSession) => (
          <>
            <ThinkSessionCard
              key={thinkSession.id}
              id={thinkSession.id.toString()}
              title={thinkSession.title}
              date={thinkSession.date}
              start_time={new Date(thinkSession.start_time)}
              end_time={new Date(thinkSession.end_time)}
              location={thinkSession.location}
              thinkfolderColor={thinkSession.thinkfolder_color as string}
              thinkfolderIcon={thinkSession.thinkfolder_icon as string}
              isDroppable={false}
            />
          </>
        ))}
      </SimpleGrid>
    </Paper>
  );
};

export default StudyOverviewPage;
