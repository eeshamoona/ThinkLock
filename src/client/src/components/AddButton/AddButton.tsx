import React from "react";
import { ActionIcon, Menu, Title } from "@mantine/core";
import {
  IconFolders,
  IconPlus,
  IconBoxMultiple,
  IconCards,
  IconListDetails,
} from "@tabler/icons-react";
import { useModals } from "@mantine/modals";
import AddThinkFolderModal from "../Modals/AddThinkFolder/AddThinkFolderModal";
import AddThinkSessionModal from "../Modals/AddThinkSession/AddThinkSessionModal";
import AddReviewSetModal from "../Modals/AddReviewSet/AddReviewSetModal";
import AddActionItemModal from "../Modals/AddActionItem/AddActionItemModal";
import { useMantineTheme } from "@mantine/core";

enum AddOptions {
  ThinkSession,
  ReviewSet,
  ThinkFolder,
  ActionItem,
}

interface AddButtonProps {
  changeTabCallback?: (tab: string) => void;
}

/**
 * AddButton component that displays the add button and its options to add a think session,
 * review set, think folder, or action item
 * @param changeTabCallback - callback function to change the tab
 * @returns
 */
const AddButton = ({ changeTabCallback }: AddButtonProps) => {
  const modals = useModals();
  const theme = useMantineTheme();

  function openAddThinkSessionModal() {
    if (changeTabCallback) {
      changeTabCallback("study");
      openModal(AddOptions.ThinkSession);
    }
  }

  function openAddReviewSetModal() {
    if (changeTabCallback) {
      changeTabCallback("review");
      openModal(AddOptions.ReviewSet);
    }
  }

  function openAddThinkFolderModel() {
    if (changeTabCallback) {
      changeTabCallback("plan");
      openModal(AddOptions.ThinkFolder);
    }
  }

  function openAddActionItemModal() {
    if (changeTabCallback) {
      changeTabCallback("plan");
      openModal(AddOptions.ActionItem);
    }
  }

  function getModalContent(modalContent: AddOptions | null) {
    switch (modalContent) {
      case AddOptions.ThinkSession:
        return <AddThinkSessionModal />;
      case AddOptions.ReviewSet:
        return <AddReviewSetModal />;
      case AddOptions.ThinkFolder:
        return <AddThinkFolderModal />;
      case AddOptions.ActionItem:
        return <AddActionItemModal />;
      default:
        return <div></div>;
    }
  }

  function getModalTitle(modalContent: AddOptions | null) {
    switch (modalContent) {
      case AddOptions.ThinkSession:
        return (
          <div>
            <Title order={4}>Create a Think Session</Title>
          </div>
        );
      case AddOptions.ReviewSet:
        return (
          <div>
            <Title order={4}>Create a Review Set</Title>
          </div>
        );
      case AddOptions.ThinkFolder:
        return (
          <div>
            <Title order={4}>Create a Think Folder</Title>
          </div>
        );
      case AddOptions.ActionItem:
        return (
          <div>
            <Title order={4}>Create an Action Item</Title>
          </div>
        );
      default:
        return <div></div>;
    }
  }

  function getModalSize(modalContent: AddOptions | null) {
    switch (modalContent) {
      case AddOptions.ThinkSession:
        return "md";
      case AddOptions.ReviewSet:
        return "md";
      case AddOptions.ThinkFolder:
        return "md";
      case AddOptions.ActionItem:
        return "lg";
      default:
        return "md";
    }
  }

  function openModal(content: AddOptions) {
    modals.openModal({
      title: getModalTitle(content),
      children: <>{getModalContent(content)}</>,
      sx: { borderRadius: "1rem" },
      size: getModalSize(content),
    });
  }

  return (
    <>
      <Menu
        shadow="md"
        width={200}
        withArrow
        trigger="hover"
        openDelay={100}
        closeDelay={400}
      >
        <Menu.Target>
          <ActionIcon
            id="add-think-button"
            size={"2.5rem"}
            radius={"50%"}
            c={theme.colorScheme === "dark" ? "cream" : "slategray"}
          >
            <IconPlus id="plus-icon" size={"1.5rem"} />
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
          <Menu.Item
            onClick={() => openAddActionItemModal()}
            icon={<IconListDetails />}
          >
            Add Action Item
          </Menu.Item>
          <Menu.Item
            onClick={() => openAddReviewSetModal()}
            icon={<IconCards />}
          >
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
    </>
  );
};

export default AddButton;
