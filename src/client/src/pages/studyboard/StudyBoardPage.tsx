import React, { useEffect, useState } from "react";
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
import CustomHeader from "../../components/header/CustomHeader";
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
import ActionItemCard from "../../components/action_item/ActionItemCard";
import { useParams } from "react-router-dom";
import {
  getThinkSessionById,
  updateThinkSession,
} from "../../services/thinkSessionAPICallerService";
import { ThinkSession } from "../../utils/models/thinksession.model";
import { getAllActionItemsByThinkSessionId } from "../../services/actionItemAPICallerService";
import { ActionItem } from "../../utils/models/actionitem.model";
import { getThinkFolderById } from "../../services/thinkFolderAPICallerService";

const StudyBoardPage = () => {
  const { id } = useParams<{ id: string }>();
  const [thinkSession, setThinkSession] = useState<ThinkSession>(
    {} as ThinkSession
  );
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);

  useEffect(() => {
    console.log("Study Board Page ID: ", id);
    if (!id) return;

    const fetchThinkSession = async () => {
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
        }
      }
    };
    fetchThinkSession();

    const fetchActionItems = async () => {
      if (!id) return;
      const actionItems = await getAllActionItemsByThinkSessionId(parseInt(id));
      if (typeof actionItems !== "string") {
        setActionItems(actionItems);
      }
    };
    fetchActionItems();
  }, [id]);

  const handleLayoutChanged = (layout: any) => {
    console.log("Layout Changed: ", layout);
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
        <Card key="notes-3" className="grid-item-container">
          <ActionIcon
            c="dimmed"
            className=" grid-item-drag grid-item-drag-handle"
          >
            <IconEqual />
          </ActionIcon>
          <div className="grid-item-content">
            <Text>Notes Section</Text>
          </div>
        </Card>
        <Card key="flashcards-2" className="grid-item-container">
          <ActionIcon
            c="dimmed"
            className=" grid-item-drag grid-item-drag-handle"
          >
            <IconEqual />
          </ActionIcon>
          <div className="grid-item-content">
            <Text>Flashcard Section</Text>
          </div>
        </Card>
        <Card
          key="add-widget-1"
          className=" grid-item-drag grid-item-container"
        >
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
              <Menu.Item icon={<IconNotes size={14} />}>Notes</Menu.Item>
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
        <Card key="action-items-1" className="grid-item-container">
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
                  thinkfolderColor={thinkSession.thinkfolder_color as string}
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
      </GridLayout>
    </div>
  );
};

export default StudyBoardPage;
