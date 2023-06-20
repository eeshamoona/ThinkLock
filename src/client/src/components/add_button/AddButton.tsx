import React from "react";
import { ActionIcon, Menu, Title } from "@mantine/core";
import {
  IconFolders,
  IconPlus,
  IconBoxMultiple,
  IconCards,
} from "@tabler/icons-react";
import { useModals } from "@mantine/modals";
import AddThinkFolderModal from "../add_think_folder_modal/AddThinkFolderModal";
import AddThinkSessionModal from "../add_think_session_modal/AddThinkSessionModal";
import AddReviewSetModal from "../add_review_set_modal/AddReviewSetModal";

enum AddOptions {
  ThinkSession,
  ReviewSet,
  ThinkFolder,
}

interface AddButtonProps {
  changeTabCallback: (tab: string) => void;
}

const AddButton = ({ changeTabCallback }: AddButtonProps) => {
  const modals = useModals();

  const openAddThinkSessionModal = () => {
    changeTabCallback("study");
    openModal(AddOptions.ThinkSession);
  };

  const openAddReviewSetModal = () => {
    changeTabCallback("review");
    openModal(AddOptions.ReviewSet);
  };

  const openAddThinkFolderModel = () => {
    changeTabCallback("plan");
    openModal(AddOptions.ThinkFolder);
  };

  const getModalContent = (modalContent: AddOptions | null) => {
    switch (modalContent) {
      case AddOptions.ThinkSession:
        return <AddThinkSessionModal />;
      case AddOptions.ReviewSet:
        return <AddReviewSetModal />;
      case AddOptions.ThinkFolder:
        return <AddThinkFolderModal />;
      default:
        return <div></div>;
    }
  };

  const getModalTitle = (modalContent: AddOptions | null) => {
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
      default:
        return <div></div>;
    }
  };

  const openModal = (content: AddOptions) => {
    modals.openModal({
      title: getModalTitle(content),
      children: <>{getModalContent(content)}</>,
      sx: { borderRadius: "1rem" },
      size: "md",
    });
  };

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
