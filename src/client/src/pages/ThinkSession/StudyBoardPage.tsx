import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  Header,
  useMantineTheme,
  Menu,
  Text,
  Button,
  Space,
  Stack,
  ActionIcon,
} from "@mantine/core";
import GridLayout from "react-grid-layout";
import CustomHeader from "../../components/Header/CustomHeader";
import {
  IconCards,
  IconNotes,
  IconFileTypePdf,
  IconAlarm,
  IconPhotoVideo,
  IconLayoutGridAdd,
  IconCode,
  IconPlus,
  IconEqual,
} from "@tabler/icons-react";
import "./studyboardpage.scss";
import ActionItemCard from "../../components/Objects/ActionItem/ActionItemCard";
import { useParams } from "react-router-dom";
import {
  getThinkSessionById,
  updateThinkSession,
} from "../../services/thinkSessionAPICallerService";
import { ThinkSession } from "../../utils/models/thinksession.model";
import { getAllActionItemsByThinkSessionId } from "../../services/actionItemAPICallerService";
import { ActionItem } from "../../utils/models/actionitem.model";
import { getThinkFolderById } from "../../services/thinkFolderAPICallerService";
import NotesWidget from "../../components/Widgets/NotesWidget/NotesWidget";
import { createNotesWidget } from "../../services/widgetsAPICallerService";

const StudyBoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const [thinkSession, setThinkSession] = useState<ThinkSession>(
    {} as ThinkSession
  );
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [widgetLayout, setWidgetLayout] = useState<any[]>([]);

  const fetchThinkSession = useCallback(async () => {
    if (!id) return;
    const res = await getThinkSessionById(parseInt(id));
    if (typeof res === "string") {
      console.log("No Think Session Found");
    } else {
      const thinkFolderRes = await getThinkFolderById(res.thinkfolder_id);
      if (typeof thinkFolderRes === "string") {
        console.log("No Think Folder Found");
      } else {
        const thinkSessionWithFolder = {
          ...res,
          thinkfolder_color: thinkFolderRes?.color,
        };
        setThinkSession(thinkSessionWithFolder);

        // Get layout options
        const layout = JSON.parse(res.layout as string);
        if (layout.length > 0) {
          const layoutOptions = layout.map((layoutItem: any) => {
            const lastDashIndex = layoutItem.i.lastIndexOf("-");
            const type = layoutItem.i.substring(0, lastDashIndex);
            const id = layoutItem.i.substring(lastDashIndex + 1);

            return {
              type,
              id,
            };
          });
          setWidgetLayout(layoutOptions);
        }
      }
    }
  }, [id]);

  const fetchActionItems = useCallback(async () => {
    if (!id) return;
    const actionItems = await getAllActionItemsByThinkSessionId(parseInt(id));
    if (typeof actionItems !== "string") {
      setActionItems(actionItems);
    }
  }, [id]);

  useEffect(() => {
    console.log("Study Board Page ID: ", id);
    if (!id) return;
    fetchThinkSession();
    fetchActionItems();
  }, [fetchActionItems, fetchThinkSession, id]);

  const handleLayoutChanged = (layout: any) => {
    updateThinkSession(thinkSession.id, { layout: JSON.stringify(layout) });
  };

  const theme = useMantineTheme();
  const screenWidth = window.innerWidth;

  return (
    <div
      style={{
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[1],
        minHeight: "100vh",
      }}
    >
      <Header height={"4rem"} p={"xs"}>
        <CustomHeader />
      </Header>
      <GridLayout
        draggableHandle=".grid-item-drag"
        useCSSTransforms={false}
        className="studyboard-layout"
        layout={thinkSession.layout ? JSON.parse(thinkSession.layout) : []}
        cols={12}
        rowHeight={39}
        containerPadding={[8, 8]}
        width={screenWidth}
        onLayoutChange={handleLayoutChanged}
      >
        {widgetLayout.map((layoutOption) => {
          const { type, id } = layoutOption;
          switch (type) {
            case "notes":
              return (
                <Card key={`${type}-${id}`} className="grid-item-container">
                  <ActionIcon
                    c="dimmed"
                    className="grid-item-drag grid-item-drag-handle"
                  >
                    <IconEqual />
                  </ActionIcon>
                  <div className="grid-item-content">
                    <NotesWidget id={id} />
                  </div>
                </Card>
              );
            case "flashcards":
              return (
                <Card key={`${type}-${id}`} className="grid-item-container">
                  <ActionIcon
                    c="dimmed"
                    className="grid-item-drag grid-item-drag-handle"
                  >
                    <IconEqual />
                  </ActionIcon>
                  <div className="grid-item-content">
                    <Text>Flashcard Section</Text>
                  </div>
                </Card>
              );
            case "action-items":
              return (
                <Card key={`${type}-${id}`} className="grid-item-container">
                  <ActionIcon
                    c="dimmed"
                    className="grid-item-drag grid-item-drag-handle"
                  >
                    <IconEqual />
                  </ActionIcon>
                  <div
                    className="grid-item-content action-item-container"
                    style={{
                      backgroundColor:
                        theme.colorScheme === "dark"
                          ? theme.colors.dark[8]
                          : theme.colors.gray[0],
                    }}
                  >
                    <Stack spacing={"0.5rem"}>
                      {actionItems?.map((actionItem, index) => (
                        <ActionItemCard
                          id={`${actionItem.id}`}
                          index={index}
                          key={actionItem.id}
                          title={actionItem.title}
                          description={actionItem.description}
                          completed={actionItem.completed}
                          draggable={false}
                          thinkfolderColor={
                            thinkSession.thinkfolder_color as string
                          }
                        />
                      ))}
                      <Button
                        onClick={() => console.log("Add Action Item")}
                        variant="default"
                        h={"3rem"}
                        leftIcon={<IconPlus size={"1rem"} />}
                      >
                        Add Action Item
                      </Button>
                    </Stack>
                  </div>
                </Card>
              );
            default:
              return null;
          }
        })}
        <Card key="add-widget" className="grid-item-drag grid-item-container">
          <Menu shadow="md" trigger="hover" openDelay={100} closeDelay={400}>
            <Menu.Target>
              <Button fullWidth h={"100%"} p={"0.5rem"}>
                <IconLayoutGridAdd size={"1rem"} />
                <Space w={"0.5rem"} />
                Add Widget
              </Button>
            </Menu.Target>

            <Menu.Dropdown
              style={{
                position: "fixed",
              }}
            >
              <Menu.Label>Study Widgets</Menu.Label>
              <Menu.Item icon={<IconCards size={14} />}>Flashcards</Menu.Item>
              <Menu.Item
                onClick={() => {
                  createNotesWidget(thinkSession.id).then((res) => {
                    if (
                      widgetLayout.findIndex(
                        (item) => item.i === `notes-${res}`
                      ) !== -1
                    ) {
                      console.log("Widget already exists");
                      return;
                    } else {
                      const notesWidgetLayout = {
                        x: 0,
                        y: 0,
                        w: 7,
                        h: 7,
                        i: `notes-${res}`,
                        moved: false,
                        static: false,
                      };
                      updateThinkSession(thinkSession.id, {
                        layout: JSON.stringify([
                          ...JSON.parse(thinkSession.layout as string),
                          notesWidgetLayout,
                        ]),
                      });
                      fetchThinkSession();
                    }
                  });
                }}
                icon={<IconNotes size={14} />}
              >
                Notes
              </Menu.Item>
              <Menu.Item icon={<IconFileTypePdf size={14} />}>PDF</Menu.Item>
              <Menu.Item icon={<IconAlarm size={14} />}>Timer</Menu.Item>

              <Menu.Divider />

              <Menu.Label>Extra Widgets</Menu.Label>
              <Menu.Item icon={<IconPhotoVideo size={14} />}>
                Video Player
              </Menu.Item>
              <Menu.Item icon={<IconCode size={14} />}>
                Code Playground
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Card>
      </GridLayout>
    </div>
  );
};

export default StudyBoardPage;
