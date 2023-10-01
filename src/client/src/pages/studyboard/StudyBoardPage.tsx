import React, { useState } from "react";
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
import { Prism } from "@mantine/prism";
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

const StudyBoardPage = () => {
  const [layout, setLayout] = useState<GridLayout.Layout[]>([
    {
      w: 12,
      h: 3,
      x: 0,
      y: 0,
      i: "a",
      moved: false,
      static: false,
    },
    {
      w: 4,
      h: 13,
      x: 0,
      y: 3,
      i: "b",
      moved: false,
      static: false,
    },
    {
      w: 5,
      h: 13,
      x: 4,
      y: 3,
      i: "c",
      moved: false,
      static: false,
    },
    {
      w: 3,
      h: 1,
      x: 9,
      y: 3,
      i: "d",
      moved: false,
      static: false,
    },
    {
      w: 3,
      h: 6,
      x: 9,
      y: 4,
      i: "e",
      moved: false,
      static: false,
    },
  ]);

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
        layout={layout}
        cols={12}
        rowHeight={39}
        containerPadding={[8, 8]}
        width={screenWidth}
        onLayoutChange={(layout) => setLayout(layout)}
      >
        <Card key="a" className="grid-item-container">
          <ActionIcon
            c="dimmed"
            className=" grid-item-drag grid-item-drag-handle"
          >
            <IconEqual />
          </ActionIcon>
          <Prism
            colorScheme={theme.colorScheme}
            language="json"
            copyLabel="Copy code to clipboard"
            copiedLabel="Code copied to clipboard"
            className="grid-item-content"
          >
            {JSON.stringify(layout, null, 2)}
          </Prism>
        </Card>
        <Card key="b" className="grid-item-container">
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
        <Card key="c" className="grid-item-container">
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
        <Card key="d" className=" grid-item-drag grid-item-container">
          <Menu shadow="md" trigger="hover" openDelay={100} closeDelay={400}>
            <Menu.Target>
              <Button fullWidth h={"100%"}>
                <IconLayoutGridAdd size={"1rem"} />
                {layout.find((item) => item.i === "d" && item.w > 1) ? (
                  <>
                    <Space w={"0.5rem"} />
                    <Text>Add Widget</Text>
                  </>
                ) : (
                  ""
                )}
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
        <Card key="e" className="grid-item-container">
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
              <ActionItemCard
                id="action-item-1"
                title={"Action Item 1"}
                description={"This is a description"}
                completed={false}
                draggable={false}
                index={0}
                thinkfolderColor="blue"
              />
              <ActionItemCard
                id="action-item-2"
                title={"Action Item 2"}
                description={"This is a description"}
                completed={false}
                draggable={false}
                index={1}
                thinkfolderColor="pink"
              />
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
