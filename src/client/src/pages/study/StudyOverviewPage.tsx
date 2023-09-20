import React, { useEffect, useState } from "react";
import WeekViewStripCalendar from "../../components/week-strip-calendar/WeekStripCalendar";
import { getAllThinkSessionsByDate } from "../../services/thinkSessionAPICallerService";
import { Paper, ScrollArea, SimpleGrid, Text } from "@mantine/core";
import ThinkSessionCard from "../../components/think_session/ThinkSessionItem";
import "./studyOverviewPage.scss";
import { ThinkSession } from "../../utils/models/thinksession.model";
import { getAllActionItemsByThinkSessionId } from "../../services/actionItemAPICallerService";
import { ActionItem } from "../../utils/models/actionitem.model";

const StudyOverviewPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [thinkSessions, setThinkSessions] = useState<ThinkSession[]>([]);
  const [selectedThinkSession, setSelectedThinkSession] =
    useState<ThinkSession | null>(null);

  const getThinkSessionsWithDate = async (date: Date) => {
    const thinkSessions = await getAllThinkSessionsByDate(date);
    if (typeof thinkSessions !== "string") {
      setThinkSessions(thinkSessions);
    }
  };

  const handleOnSessionClick = async (id: string) => {
    const thinkSession = thinkSessions.find(
      (thinkSession) => thinkSession.id.toString() === id
    );
    if (!thinkSession) return;

    const actionItems = await getAllActionItemsByThinkSessionId(parseInt(id));
    if (typeof actionItems === "string") return;

    setSelectedThinkSession({
      ...thinkSession,
      action_items: actionItems as unknown as ActionItem[],
    });
  };

  useEffect(() => {
    getThinkSessionsWithDate(selectedDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="study-overview-page-container">
      <Paper className="session-day-picker-container">
        <WeekViewStripCalendar
          initialDate={selectedDate}
          onDayClick={(date) => {
            setSelectedDate(date);
            getThinkSessionsWithDate(date);
          }}
        />
        <ScrollArea h={"18rem"} offsetScrollbars>
          <SimpleGrid
            spacing="sm"
            cols={2}
            p={"1rem"}
            pb={0}
            breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          >
            {thinkSessions?.map((thinkSession) => (
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
                onClick={handleOnSessionClick}
              />
            ))}
          </SimpleGrid>
        </ScrollArea>
      </Paper>
      <Paper className="session-detail-container">
        {selectedThinkSession ? (
          <div className="detail-container">
            <Text>{selectedThinkSession?.title}</Text>
            <Text>{selectedThinkSession?.location}</Text>
          </div>
        ) : (
          <div className="no-session-container">
            <Text size={20} weight={200}>
              Click on a think session to see more details
            </Text>
          </div>
        )}
      </Paper>
    </div>
  );
};

export default StudyOverviewPage;
