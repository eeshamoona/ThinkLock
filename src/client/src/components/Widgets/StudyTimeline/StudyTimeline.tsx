import React, { useCallback, useEffect } from "react";
import { StudyEvent } from "../../../utils/models/studyevent.model";
import { getAllStudyEventsFromThinkSession } from "../../../services/studyEventsAPICallerService";
import { Timeline, Text, Accordion, useMantineTheme } from "@mantine/core";
import { studyEventTypes } from "../../../utils/constants/studyEventType.constant";
import moment from "moment";

interface StudyTimelineProps {
  thinkSessionID: number;
}
const StudyTimeline = ({ thinkSessionID }: StudyTimelineProps) => {
  const [studyEvents, setStudyEvents] = React.useState<StudyEvent[]>();
  const theme = useMantineTheme();

  const fetchStudyEvents = useCallback(async () => {
    const studyEvents = await getAllStudyEventsFromThinkSession(thinkSessionID);
    if (typeof studyEvents === "string") {
      setStudyEvents(studyEvents);
    }
  }, [thinkSessionID]);

  useEffect(() => {
    fetchStudyEvents();
  }, [fetchStudyEvents]);

  return (
    <Accordion
      radius={"xs"}
      variant="filled"
      className="study-timeline-acordion"
    >
      <Accordion.Item value="add">
        <Accordion.Control
          p={"0.5rem 1rem"}
          pos={"sticky"}
          top={0}
          onClick={fetchStudyEvents}
          style={{
            zIndex: 100,
            backgroundColor:
              theme.colorScheme === "dark"
                ? theme.colors.dark[7]
                : theme.colors.gray[0],
          }}
        >
          Study TimeLine
        </Accordion.Control>
        <Accordion.Panel p={0}>
          <Timeline
            pt={"0.5rem"}
            radius="sm"
            lineWidth={3}
            bulletSize={16}
            active={studyEvents?.length}
          >
            {studyEvents?.map((studyEvent) => {
              const time = moment(studyEvent.timestamp).fromNow();
              const title =
                studyEventTypes[
                  studyEvent.event_type as keyof typeof studyEventTypes
                ];
              return (
                <Timeline.Item title={title} key={studyEvent.id}>
                  <Text color="dimmed" size="sm">
                    {studyEvent.details}
                  </Text>
                  <Text size="xs" mt={4}>
                    {time}
                  </Text>
                </Timeline.Item>
              );
            })}
          </Timeline>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
};

export default StudyTimeline;
