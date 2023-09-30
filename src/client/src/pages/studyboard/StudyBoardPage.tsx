import React, { useState } from "react";
import {
  Card,
  Header,
  useMantineTheme,
  Menu,
  Text,
  Button,
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
} from "@tabler/icons-react";
import "./studyboardpage.scss";

const StudyBoardPage = () => {
  const [layout, setLayout] = useState<GridLayout.Layout[]>([
    {
      w: 3,
      h: 20,
      x: 0,
      y: 0,
      i: "a",
      moved: false,
      static: false,
    },
    {
      w: 4,
      h: 9,
      x: 3,
      y: 0,
      i: "b",
      moved: false,
      static: false,
    },
    {
      w: 4,
      h: 8,
      x: 3,
      y: 9,
      i: "c",
      moved: false,
      static: false,
    },
    {
      w: 2,
      h: 3,
      x: 7,
      y: 0,
      i: "d",
      moved: false,
      static: false,
    },
  ]);

  const theme = useMantineTheme();

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
        rowHeight={30}
        width={1405}
        style={{ zIndex: "0" }}
        onLayoutChange={(layout) => setLayout(layout)}
      >
        <Card key="a">
          <Prism
            colorScheme={theme.colorScheme}
            language="json"
            copyLabel="Copy code to clipboard"
            copiedLabel="Code copied to clipboard"
          >
            {JSON.stringify(layout, null, 2)}
          </Prism>
        </Card>
        <Card key="b">Something A</Card>
        <Card key="c">Something B</Card>
        <Card key="d" style={{ zIndex: "-1" }}>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button>Toggle menu</Button>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>Application</Menu.Label>
              <Menu.Item icon={<IconSettings size={14} />}>Settings</Menu.Item>
              <Menu.Item icon={<IconMessageCircle size={14} />}>
                Messages
              </Menu.Item>
              <Menu.Item icon={<IconPhoto size={14} />}>Gallery</Menu.Item>
              <Menu.Item
                icon={<IconSearch size={14} />}
                rightSection={
                  <Text size="xs" variant="outline">
                    ⌘K
                  </Text>
                }
              >
                Search
              </Menu.Item>

              <Menu.Divider />

              <Menu.Label>Danger zone</Menu.Label>
              <Menu.Item icon={<IconArrowsLeftRight size={14} />}>
                Transfer my data
              </Menu.Item>
              <Menu.Item color="red" icon={<IconTrash size={14} />}>
                Delete my account
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Card>
      </GridLayout>
    </div>
  );
};

export default StudyBoardPage;
