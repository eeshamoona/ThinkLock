import React from "react";
import { ActionIcon, Menu } from "@mantine/core";
import {
  IconFolders,
  IconPlus,
  IconBoxMultiple,
  IconCards,
} from "@tabler/icons-react";

const AddButton = () => {
  const addThinkSession = () => {
    console.log("Add Think Session");
  };

  const addReviewSet = () => {
    console.log("Add Review Set");
  };

  const addThinkFolder = () => {
    console.log("Add Think Folder");
  };

  return (
    <Menu
      shadow="md"
      width={200}
      withArrow
      trigger="hover"
      openDelay={100}
      closeDelay={400}
    >
      <Menu.Target>
        <ActionIcon id="add-think-button" size={"3rem"}>
          <IconPlus id="plus-icon" size={"2rem"} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label sx={{ float: "left" }}>Add Options:</Menu.Label>
        <Menu.Item onClick={() => addThinkSession()} icon={<IconBoxMultiple />}>
          Add Think Session
        </Menu.Item>
        <Menu.Item onClick={() => addReviewSet()} icon={<IconCards />}>
          Add Review Set
        </Menu.Item>
        <Menu.Item onClick={() => addThinkFolder()} icon={<IconFolders />}>
          Add Think Folder
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default AddButton;
