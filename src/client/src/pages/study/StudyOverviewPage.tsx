import React, { useEffect, useState } from "react";
import WeekViewStripCalendar from "../../components/week-strip-calendar/WeekStripCalendar";
import { getAllThinkSessionsByDate } from "../../services/thinkSessionAPICallerService";
import { Button, Paper, ScrollArea, SimpleGrid, Text } from "@mantine/core";
import ThinkSessionCard from "../../components/think_session/ThinkSessionItem";
import "./studyOverviewPage.scss";
import { ThinkSession } from "../../utils/models/thinksession.model";
import { getAllActionItemsByThinkSessionId } from "../../services/actionItemAPICallerService";
import { ActionItem } from "../../utils/models/actionitem.model";
import { Tabs, Stack } from "@mantine/core";
import ActionItemCard from "../../components/action_item/ActionItemCard";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";
import AddActionItemModal from "../../components/add_action_item_modal/AddActionItemModal";
import { useModals } from "@mantine/modals";

const StudyOverviewPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [thinkSessions, setThinkSessions] = useState<ThinkSession[]>([]);
  const [selectedThinkSession, setSelectedThinkSession] =
    useState<ThinkSession | null>(null);
  const modals = useModals();

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

  const handleActionItemAdded = async () => {
    modals.openModal({
      title: "Add Think Session",
      size: "lg",
      children: (
        <AddActionItemModal
          thinkSessionId={selectedThinkSession?.id.toString()}
          thinkFolderId={selectedThinkSession?.thinkfolder_id.toString()}
        />
      ),
    });
  };

  const [activeTab, setActiveTab] = useState<string | null>("plan");

  const changeTab = (tab: string) => {
    setActiveTab(tab);
  };

  const getBackgroundColor = () => {
    if (selectedThinkSession?.thinkfolder_color) {
      const colorName =
        hexToColorNameMap[selectedThinkSession?.thinkfolder_color];
      return `var(--mantine-color-${colorName}-0)`;
    }
  };

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
            <Paper className="detail-tabs-container">
              <Tabs
                value={activeTab}
                keepMounted={false}
                h={"100%"}
                onTabChange={setActiveTab}
              >
                <Tabs.List grow id="tab-list">
                  <Tabs.Tab
                    value="summary"
                    onClick={() => changeTab("summary")}
                  >
                    Summary
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="actionItems"
                    onClick={() => changeTab("actionItems")}
                  >
                    Action Items
                  </Tabs.Tab>
                  <Tabs.Tab
                    value="scribbles"
                    onClick={() => changeTab("scribbles")}
                  >
                    Scribbles
                  </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="summary" pt="md">
                  <Text>{selectedThinkSession?.summary}</Text>
                </Tabs.Panel>
                <Tabs.Panel
                  value="actionItems"
                  pt="md"
                  className="action-items-tab"
                >
                  <ScrollArea
                    h={"12rem"}
                    pt={"0.5rem"}
                    offsetScrollbars
                    className="action-items-scroll-area"
                    hidden={selectedThinkSession?.action_items?.length === 0}
                  >
                    <Stack
                      spacing={"0.5rem"}
                      p={"0.5rem"}
                      bg={getBackgroundColor()}
                      hidden={selectedThinkSession?.action_items?.length === 0}
                    >
                      {selectedThinkSession?.action_items?.map(
                        (actionItem, index) => (
                          <ActionItemCard
                            index={index}
                            key={actionItem.id}
                            id={actionItem.id.toString()}
                            title={actionItem.title}
                            description={actionItem.description}
                            completed={actionItem.completed}
                            draggable={false}
                            thinkfolderColor={
                              selectedThinkSession?.thinkfolder_color as string
                            }
                          />
                        )
                      )}
                    </Stack>
                  </ScrollArea>
                  <Button
                    mt={"1rem"}
                    mb={0}
                    pb={0}
                    fullWidth
                    onClick={handleActionItemAdded}
                  >
                    Add Action Item
                  </Button>
                </Tabs.Panel>
                <Tabs.Panel value="scribbles" pt="md">
                  <Text>{"Scribbles"}</Text>
                </Tabs.Panel>
              </Tabs>
            </Paper>
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
