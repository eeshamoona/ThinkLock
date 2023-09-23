import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Paper,
  ScrollArea,
  SimpleGrid,
  Text,
  useMantineTheme,
  Tabs,
  Stack,
  ActionIcon,
  Group,
} from "@mantine/core";
import { Droppable, DragDropContext } from "react-beautiful-dnd";
import { format, startOfDay } from "date-fns";
import { useModals } from "@mantine/modals";
import WeekViewStripCalendar from "../../components/week-strip-calendar/WeekStripCalendar";
import ThinkSessionCard from "../../components/think_session/ThinkSessionItem";
import ActionItemCard from "../../components/action_item/ActionItemCard";
import AddActionItemModal from "../../components/add_action_item_modal/AddActionItemModal";
import { getAllThinkSessionsByDate } from "../../services/thinkSessionAPICallerService";
import { getAllActionItemsByThinkSessionId } from "../../services/actionItemAPICallerService";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";
import { ThinkSession } from "../../utils/models/thinksession.model";
import { ActionItem } from "../../utils/models/actionitem.model";
import IconType from "../../utils/constants/iconType.constant";
import * as allIcons from "tabler-icons-react";
import "./studyOverviewPage.scss";
import { TbArrowRight, TbClockFilled, TbMapPinFilled } from "react-icons/tb";

const StudyOverviewPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(
    startOfDay(new Date())
  );
  const [thinkSessions, setThinkSessions] = useState<ThinkSession[]>([]);
  const [selectedThinkSession, setSelectedThinkSession] =
    useState<ThinkSession | null>(null);
  const [selectedThinkSessionActionItems, setSelectedThinkSessionActionItems] =
    useState<ActionItem[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>("actionItems");
  const modals = useModals();
  const theme = useMantineTheme();

  const getThinkSessionsOnDate = useCallback(async () => {
    const thinkSessions = await getAllThinkSessionsByDate(selectedDate);
    if (typeof thinkSessions !== "string") {
      setThinkSessions(thinkSessions);
    }
  }, [selectedDate]);

  const refreshSelectedThinkSessionActionItems = useCallback(async () => {
    const actionItems = await getAllActionItemsByThinkSessionId(
      selectedThinkSession?.id as number
    );
    if (typeof actionItems !== "string") {
      setSelectedThinkSessionActionItems(actionItems);
    }
  }, [selectedThinkSession]);

  const handleOnSessionClick = useCallback(
    async (id: string) => {
      const thinkSession = thinkSessions.find(
        (thinkSession) => thinkSession.id.toString() === id
      );
      if (!thinkSession) return;

      setSelectedThinkSession(thinkSession);

      const actionItems = await getAllActionItemsByThinkSessionId(
        thinkSession.id
      );
      if (typeof actionItems !== "string") {
        setSelectedThinkSessionActionItems(actionItems);
      }
    },
    [thinkSessions]
  );

  const handleActionItemAdded = useCallback(() => {
    modals.openModal({
      title: "Add Think Session",
      size: "lg",
      children: (
        <AddActionItemModal
          thinkSessionId={selectedThinkSession?.id?.toString()}
          thinkFolderId={selectedThinkSession?.thinkfolder_id?.toString()}
          successCallback={refreshSelectedThinkSessionActionItems}
        />
      ),
    });
  }, [
    modals,
    refreshSelectedThinkSessionActionItems,
    selectedThinkSession?.id,
    selectedThinkSession?.thinkfolder_id,
  ]);

  useEffect(() => {
    getThinkSessionsOnDate();
  }, [selectedDate, getThinkSessionsOnDate]);

  const onDragEnd = useCallback(
    (result: any) => {
      if (!result.destination) {
        return;
      }

      const items = Array.from(selectedThinkSessionActionItems || []);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      setSelectedThinkSessionActionItems(items);
    },
    [selectedThinkSessionActionItems]
  );

  const colorName = hexToColorNameMap[
    selectedThinkSession?.thinkfolder_color as string
  ] as any;

  const variantExpanded =
    theme.colorScheme === "dark" && colorName === "dark" ? "filled" : "light";

  const tabColorExpanded =
    theme.colorScheme === "dark" && colorName === "dark"
      ? "white"
      : `${selectedThinkSession?.thinkfolder_color as string}`;

  document.documentElement.style.setProperty(
    "--tab-selector-color",
    `${tabColorExpanded}`
  );

  const getBackgroundColor = useCallback(() => {
    if (selectedThinkSession?.thinkfolder_color) {
      return theme.colorScheme === "dark"
        ? `var(--mantine-color-dark-8)`
        : `var(--mantine-color-${colorName}-0)`;
    }
  }, [selectedThinkSession?.thinkfolder_color, theme.colorScheme, colorName]);

  const Icon = (allIcons as IconType)[
    selectedThinkSession?.thinkfolder_icon as string
  ];

  const thinkFolderColorExpanded =
    theme.colorScheme === "dark" && colorName === "dark"
      ? "#FFFFFFAA"
      : `${selectedThinkSession?.thinkfolder_color}AA`;

  const formatTime = (time: Date) => {
    const formattedHours = time.getHours() % 12 || 12;
    const formattedMinutes = time.getMinutes().toString().padStart(2, "0");
    const ampm = time.getHours() >= 12 ? "PM" : "AM";
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  return (
    <div className="study-overview-page-container">
      <Paper className="session-day-picker-container">
        <WeekViewStripCalendar
          initialDate={selectedDate}
          onDayClick={(date) => {
            setSelectedDate(date);
          }}
          addSuccessCallback={getThinkSessionsOnDate}
        />
        <ScrollArea h={"18.6rem"} offsetScrollbars>
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
          <>
            <div className="detail-container">
              <div className="session-detail-info-container">
                <ActionIcon
                  color={colorName}
                  size={45}
                  variant={variantExpanded}
                  radius="md"
                >
                  {Icon && <Icon className="think-session-icon" />}
                </ActionIcon>
                <div className="location-time-container">
                  <Text size={"lg"} weight={"500"}>
                    {selectedThinkSession?.title}
                  </Text>
                  <Group position="apart">
                    <div
                      className={
                        selectedThinkSession?.location
                          ? "think-session-location"
                          : "no-location"
                      }
                    >
                      <TbMapPinFilled
                        size={18}
                        color={`${thinkFolderColorExpanded}`}
                      />
                      <Text size={"xs"} c="dimmed" className="location-text">
                        {selectedThinkSession?.location}
                      </Text>
                    </div>
                    <div className="think-session-location">
                      <TbClockFilled
                        size={18}
                        color={`${thinkFolderColorExpanded}`}
                      />
                      <Text size={"xs"} c="dimmed">
                        {format(
                          new Date(selectedThinkSession.date),
                          "EEE, MMM d"
                        )}{" "}
                        {` | `}
                        {`${formatTime(
                          new Date(selectedThinkSession?.start_time)
                        )} - ${formatTime(
                          new Date(selectedThinkSession?.end_time)
                        )}`}
                      </Text>
                    </div>
                  </Group>
                </div>
              </div>
              <Paper className="detail-tabs-container">
                <Tabs
                  value={activeTab}
                  keepMounted={false}
                  h={"100%"}
                  onTabChange={setActiveTab}
                  color={colorName}
                >
                  <Tabs.List grow id="tab-list">
                    <Tabs.Tab
                      value="summary"
                      onClick={() => setActiveTab("summary")}
                    >
                      Summary
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="actionItems"
                      onClick={() => setActiveTab("actionItems")}
                    >
                      Action Items
                    </Tabs.Tab>
                    <Tabs.Tab
                      value="scribbles"
                      onClick={() => setActiveTab("scribbles")}
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
                    <DragDropContext onDragEnd={onDragEnd}>
                      <ScrollArea
                        h={"13.75rem"}
                        mt={"0.5rem"}
                        pb={"1rem"}
                        offsetScrollbars
                        className="action-items-scroll-area"
                        bg={getBackgroundColor()}
                        hidden={selectedThinkSessionActionItems?.length === 0}
                      >
                        <Droppable
                          droppableId={`action-item-think-session-${selectedThinkSession?.id}`}
                          direction="vertical"
                        >
                          {(provided) => (
                            <Stack
                              spacing={"0.5rem"}
                              p={"0.5rem"}
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                            >
                              {selectedThinkSessionActionItems?.map(
                                (actionItem, index) => (
                                  <ActionItemCard
                                    id={`${actionItem.id}`}
                                    index={index}
                                    key={actionItem.id}
                                    title={actionItem.title}
                                    description={actionItem.description}
                                    completed={actionItem.completed}
                                    draggable={true}
                                    thinkfolderColor={
                                      selectedThinkSession?.thinkfolder_color as string
                                    }
                                  />
                                )
                              )}
                              {provided.placeholder}
                              <Button
                                onClick={handleActionItemAdded}
                                variant="default"
                                fullWidth
                                className="add-action-item-button"
                              >
                                Add Action Item
                              </Button>
                            </Stack>
                          )}
                        </Droppable>
                      </ScrollArea>
                    </DragDropContext>
                  </Tabs.Panel>
                  <Tabs.Panel value="scribbles" pt="md">
                    <Text>{"Scribbles"}</Text>
                  </Tabs.Panel>
                </Tabs>
              </Paper>
            </div>
            <Button
              variant="subtle"
              mt={"1rem"}
              mb={"auto"}
              onClick={() => {}}
              rightIcon={<TbArrowRight size={18} />}
            >
              Enter Think Session
            </Button>
          </>
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
