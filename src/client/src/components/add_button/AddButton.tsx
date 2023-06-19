import React from "react";
import { ActionIcon, Menu } from "@mantine/core";
import {
  IconFolders,
  IconPlus,
  IconBoxMultiple,
  IconCards,
} from "@tabler/icons-react";

interface AddButtonProps {
  changeTabCallback: (tab: string) => void;
}

const AddButton = ({ changeTabCallback }: AddButtonProps) => {
  const openAddThinkSessionModal = () => {
    console.log("Add Think Session");
    changeTabCallback("study");
  };

  const openAddReviewSetModal = () => {
    console.log("Add Review Set");
    changeTabCallback("review");
  };

  const openAddThinkFolderModel = () => {
    console.log("Add Think Folder");
    changeTabCallback("plan");
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
        <Menu.Item
          onClick={() => openAddThinkSessionModal()}
          icon={<IconBoxMultiple />}
        >
          Add Think Session
        </Menu.Item>
        <Menu.Item onClick={() => openAddReviewSetModal()} icon={<IconCards />}>
          Add Review Set
        </Menu.Item>
        <Menu.Item
          onClick={() => openAddThinkFolderModel()}
          icon={<IconFolders />}
        >
          Add Think Folder
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};

export default AddButton;
