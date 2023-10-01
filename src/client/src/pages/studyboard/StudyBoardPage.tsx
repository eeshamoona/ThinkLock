import React, { useState } from "react";
import {
  Card,
  Header,
  useMantineTheme,
  Menu,
  Text,
  Button,
  Space,
} from "@mantine/core";
import GridLayout from "react-grid-layout";
import CustomHeader from "../../components/header/CustomHeader";
import { Prism } from "@mantine/prism";
import {
  IconSettings,
  IconMessageCircle,
  IconPhoto,
  IconSearch,
  IconArrowsLeftRight,
  IconTrash,
  IconLayoutGridAdd,
} from "@tabler/icons-react";
import "./studyboardpage.scss";

const StudyBoardPage = () => {
  const [layout, setLayout] = useState<GridLayout.Layout[]>([
    {
      w: 3,
      h: 16,
      x: 0,
      y: 0,
      i: "a",
      moved: false,
      static: false,
    },
    {
      w: 7,
      h: 9,
      x: 3,
      y: 0,
      i: "b",
      moved: false,
      static: false,
    },
    {
      w: 7,
      h: 7,
      x: 3,
      y: 9,
      i: "c",
      moved: false,
      static: false,
    },
    {
      w: 2,
      h: 1,
      x: 10,
      y: 0,
      i: "d",
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
          <Prism
            colorScheme={theme.colorScheme}
            language="json"
            copyLabel="Copy code to clipboard"
            copiedLabel="Code copied to clipboard"
          >
            {JSON.stringify(layout, null, 2)}
          </Prism>
        </Card>
        <Card key="b" className="grid-item-container">
          Something A
        </Card>
        <Card key="c" className="grid-item-container">
          Something B
        </Card>
        <Card key="d" className="grid-item-container">
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
              <Menu.Item icon={<IconSettings size={14} />}>
                Flashcards
              </Menu.Item>
              <Menu.Item icon={<IconMessageCircle size={14} />}>
                Notes
              </Menu.Item>
              <Menu.Item icon={<IconPhoto size={14} />}>PDF</Menu.Item>
              <Menu.Item icon={<IconSearch size={14} />}>Timer</Menu.Item>

              <Menu.Divider />

              <Menu.Label>Extra Widgets</Menu.Label>
              <Menu.Item icon={<IconArrowsLeftRight size={14} />}>
                Video Player
              </Menu.Item>
              <Menu.Item icon={<IconTrash size={14} />}>
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
