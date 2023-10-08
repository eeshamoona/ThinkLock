import React, { useCallback, useEffect, useState } from "react";
import {
  Card,
  Header,
  useMantineTheme,
  Menu,
  Button,
  Space,
  Stack,
  ActionIcon,
} from "@mantine/core";
import GridLayout from "react-grid-layout";
import CustomHeader from "../../components/Header/CustomHeader";
import {
  IconCards,
  IconListCheck,
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
import {
  createFlashcardsWidget,
  createNotesWidget,
} from "../../services/widgetsAPICallerService";
import { useModals } from "@mantine/modals";

import AddActionItemModal from "../../components/Modals/AddActionItem/AddActionItemModal";
import { showErrorNotification } from "../../utils/notifications";
import FlashcardsWidget from "../../components/Widgets/FlashcardsWidget/FlashcardsWidget";

/**
 * Study Board Page displays a reactive grid layout of widgets
 * @returns
 */
const StudyBoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const [thinkSession, setThinkSession] = useState<ThinkSession>(
    {} as ThinkSession
  );
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);
  const [widgetLayout, setWidgetLayout] = useState<any[]>([]);

  const modals = useModals();

  const typeToString: {} = {
    "action-items": "Action Items",
    flashcards: "Flashcards",
    notes: "Notes",
  };

  const fetchThinkSession = useCallback(async () => {
    if (!id) return;
    const res = await getThinkSessionById(parseInt(id));
    if (typeof res === "string") {
      showErrorNotification(
        "Error",
        "No Think Session Found. Please try again."
      );
    } else {
      const thinkFolderRes = await getThinkFolderById(res.thinkfolder_id);
      if (typeof thinkFolderRes === "string") {
        showErrorNotification(
          "Error",
          "No Think Folder Found. Please try again."
        );
      } else {
        console.log("THE RESULT DATE", res.date as Date);
        console.log(new Date(res.date));
        const thinkSessionWithFolder = {
          ...res,
          date: res.date as Date,
          thinkfolder_color: thinkFolderRes?.color,
        };
        console.log(thinkSessionWithFolder);
        setThinkSession(thinkSessionWithFolder);

        // Get layout options
        if (res.layout !== undefined) {
          // Add a check to make sure that the res.layout property is not undefined
          const layout = JSON.parse(res.layout as string);
          if (layout.length > 0) {
            const layoutOptions = layout.map((layoutItem: any) => {
              const lastDashIndex = layoutItem.i.lastIndexOf("-");
              const type = layoutItem.i.substring(0, lastDashIndex);
              const id = layoutItem.i.substring(lastDashIndex + 1);

              return {
                type,
                id,
                width: layoutItem.w,
              };
            });
            setWidgetLayout(layoutOptions);
          }
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
    fetchThinkSession();
    fetchActionItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleLayoutChanged(layout: any) {
    console.log(layout);
    updateThinkSession(thinkSession.id, { layout: JSON.stringify(layout) });
  }

  const handleActionItemAdded = useCallback(() => {
    modals.openModal({
      title: "Add Think Session",
      size: "lg",
      children: (
        <AddActionItemModal
          thinkSessionId={thinkSession.id.toString()}
          thinkFolderId={thinkSession.thinkfolder_id.toString()}
          successCallback={fetchActionItems}
        />
      ),
    });
  }, [fetchActionItems, modals, thinkSession.id, thinkSession.thinkfolder_id]);

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
                    {
                      // @ts-ignore
                      typeToString[type]
                    }
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
                    {
                      // @ts-ignore
                      typeToString[type]
                    }
                    <IconEqual />
                  </ActionIcon>
                  <div className="grid-item-content">
                    <FlashcardsWidget id={id} />
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
                    {
                      // @ts-ignore
                      typeToString[type]
                    }
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
                        onClick={handleActionItemAdded}
                        variant="outline"
                        color={theme.colorScheme === "dark" ? "gray" : "blue"}
                        style={{
                          color:
                            theme.colorScheme === "light"
                              ? theme.colors.dark[3]
                              : theme.colors.gray[6],

                          borderColor:
                            theme.colorScheme === "light"
                              ? theme.colors.gray[4]
                              : theme.colors.dark[4],
                        }}
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
              <Menu.Item
                icon={<IconListCheck size={14} />}
                onClick={() => {
                  if (
                    widgetLayout.findIndex(
                      (item) => item.type === "action-items"
                    ) !== -1
                  ) {
                    showErrorNotification(
                      "Error",
                      "Action Items Widget already exists"
                    );
                    return;
                  } else {
                    const actionItemsWidgetLayout = {
                      x: 0,
                      y: 0,
                      w: 7,
                      h: 7,
                      i: `action-items-${thinkSession.id}`,
                      moved: false,
                      static: false,
                    };
                    updateThinkSession(thinkSession.id, {
                      layout: JSON.stringify([
                        ...JSON.parse(thinkSession.layout as string),
                        actionItemsWidgetLayout,
                      ]),
                    });
                    fetchThinkSession();
                  }
                }}
              >
                Action Items
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  createFlashcardsWidget(thinkSession.id).then((res) => {
                    if (
                      widgetLayout.findIndex(
                        (item) => item.type === "flashcards"
                      ) !== -1
                    ) {
                      showErrorNotification(
                        "Error",
                        "Flashcards Widget already exists"
                      );
                      return;
                    } else {
                      const flashcardsWidgetLayout = {
                        x: 0,
                        y: 0,
                        w: 7,
                        h: 7,
                        i: `flashcards-${res}`,
                        moved: false,
                        static: false,
                      };
                      updateThinkSession(thinkSession.id, {
                        layout: JSON.stringify([
                          ...JSON.parse(thinkSession.layout as string),
                          flashcardsWidgetLayout,
                        ]),
                      });
                      fetchThinkSession();
                    }
                  });
                }}
                icon={<IconCards size={14} />}
              >
                Flashcards
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  createNotesWidget(thinkSession.id).then((res) => {
                    if (
                      widgetLayout.findIndex(
                        (item) => item.type === "notes"
                      ) !== -1
                    ) {
                      showErrorNotification(
                        "Error",
                        "Notes Widget already exists"
                      );
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
