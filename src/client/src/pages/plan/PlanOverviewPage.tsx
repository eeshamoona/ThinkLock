import React, { useEffect, useState } from "react";
import "./planOverviewPage.scss";
import ThinkFolderCard from "../../components/think_folder/ThinkFolderCard";
import { ThinkFolder } from "../../utils/models/thinkfolder.model";
import { getAllThinkFolders } from "../../services/thinkFolderAPICallerService";
import { ActionIcon, Paper, Text } from "@mantine/core";
import { ArrowLeft, Plus } from "tabler-icons-react";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";
import ActionItemCard from "../../components/action_item/ActionItemCard";
import { getAllActionItemsByThinkFolderId } from "../../services/actionItemAPICallerService";
import { getAllThinkSessionsByThinkFolderId } from "../../services/thinkSessionAPICallerService";
import ThinkSessionItem from "../../components/think_session/ThinkSessionItem";
import AddThinkSessionModal from "../../components/add_think_session_modal/AddThinkSessionModal";
import AddActionItemModal from "../../components/add_action_item_modal/AddActionItemModal";
import { useModals } from "@mantine/modals";
import { useMantineTheme } from "@mantine/core";

enum ModalOptions {
  ThinkSession,
  ActionItem,
}
const PlanOverviewPage = () => {
  const [folders, setFolders] = useState<ThinkFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<ThinkFolder | null>(
    null
  );
  const [showFolderDetails, setShowFolderDetails] = useState<boolean>(false);
  const [actionItems, setActionItems] = useState<any[]>([]);
  const [thinkSessions, setThinkSessions] = useState<any[]>([]);
  const modals = useModals();
  const theme = useMantineTheme();

  useEffect(() => {
    const fetchData = async () => {
      if (selectedFolder === null) {
        const res = await getAllThinkFolders();
        if (typeof res !== "string") {
          setFolders(res as ThinkFolder[]);
        }
      } else {
        const actionItemsRes = await getAllActionItemsByThinkFolderId(
          selectedFolder.id
        );
        if (typeof actionItemsRes !== "string") {
          setActionItems(actionItemsRes as any[]);
        }

        const thinkSessionsRes = await getAllThinkSessionsByThinkFolderId(
          selectedFolder.id
        );
        if (typeof thinkSessionsRes !== "string") {
          setThinkSessions(thinkSessionsRes as any[]);
        }
      }
    };

    fetchData();
  }, [selectedFolder, modals]);

  const handleFolderClick = (folder: ThinkFolder) => {
    setSelectedFolder(folder);
    setShowFolderDetails(true);
  };

  const handleBackClick = () => {
    setSelectedFolder(null);
    setShowFolderDetails(false);
    getAllThinkFolders().then((res) => {
      if (typeof res !== "string") {
        setFolders(res as ThinkFolder[]);
      }
    });
  };

  const getModalContent = (content: ModalOptions) => {
    switch (content) {
      case ModalOptions.ThinkSession:
        if (selectedFolder) {
          return (
            <AddThinkSessionModal
              thinkFolderId={selectedFolder.id.toString()}
            />
          );
        }
        return <AddThinkSessionModal />;
      case ModalOptions.ActionItem:
        if (selectedFolder) {
          return (
            <AddActionItemModal thinkFolderId={selectedFolder.id.toString()} />
          );
        }
        return <AddActionItemModal />;
      default:
        return <div></div>;
    }
  };

  const getModalTitle = (content: ModalOptions) => {
    switch (content) {
      case ModalOptions.ThinkSession:
        return (
          <div>
            <Text size="lg" weight={700}>
              Add Think Session
            </Text>
          </div>
        );
      case ModalOptions.ActionItem:
        return (
          <div>
            <Text size="lg" weight={700}>
              Add Action Item
            </Text>
          </div>
        );
      default:
        return <div></div>;
    }
  };

  const getModalSize = (content: ModalOptions) => {
    switch (content) {
      case ModalOptions.ThinkSession:
        return "md";
      case ModalOptions.ActionItem:
        return "lg";
      default:
        return "md";
    }
  };

  const openModal = (content: ModalOptions) => {
    modals.openModal({
      title: getModalTitle(content),
      children: <>{getModalContent(content)}</>,
      sx: { borderRadius: "1rem" },
      size: getModalSize(content),
    });
  };

  const openAddThinkSessionModal = () => {
    openModal(ModalOptions.ThinkSession);
  };

  const openAddActionItemModal = () => {
    openModal(ModalOptions.ActionItem);
  };

  return (
    <div className="plan-page-container">
      <div className="think-folders-container container">
        {showFolderDetails ? (
          selectedFolder && (
            <div className="folder-to-back-container">
              <div className="go-back-container">
                <ActionIcon
                  onClick={handleBackClick}
                  c={theme.colorScheme === "dark" ? "white" : "black"}
                >
                  <ArrowLeft />
                </ActionIcon>
                <Text size="sm">Back To Folders</Text>
              </div>
              <ThinkFolderCard
                key={selectedFolder.id}
                folderColor={selectedFolder.color}
                folderName={selectedFolder.name}
                folderSubtitle={selectedFolder.description}
                folderIcon={selectedFolder.icon}
                onClick={() => handleFolderClick(selectedFolder)}
                hoverActive={false}
              />
            </div>
          )
        ) : (
          <Paper p="md" className="container">
            {folders?.map((folder) => (
              <ThinkFolderCard
                key={folder.id}
                folderColor={folder.color}
                folderName={folder.name}
                folderSubtitle={folder.description}
                folderIcon={folder.icon}
                onClick={() => handleFolderClick(folder)}
                hoverActive={true}
              />
            ))}
          </Paper>
        )}
      </div>
      <div
        className={
          showFolderDetails ? "think-folders-action-items container" : "hidden"
        }
      >
        <div className="action-item-header">
          <Text size="lg" weight={700}>
            Action Items
          </Text>
          <ActionIcon
            color={hexToColorNameMap[selectedFolder?.color as string] || "gray"}
            size="lg"
            variant="light"
            onClick={openAddActionItemModal}
          >
            <Plus size="1.75rem" />
          </ActionIcon>
        </div>
        <Paper
          p="md"
          className="action-item-list-container"
          style={{
            backgroundColor:
              theme.colorScheme === "light" ? `${selectedFolder?.color}11` : "",
          }}
        >
          {actionItems?.map((actionItem) => (
            <ActionItemCard
              key={actionItem.id}
              title={actionItem.title}
              description={actionItem.description}
              completed={actionItem.completed}
              draggable={true}
              thinkfolderColor={selectedFolder?.color as string}
            />
          ))}
        </Paper>
      </div>
      <div
        className={
          showFolderDetails ? "think-folders-think-session container" : "hidden"
        }
      >
        <div className="think-session-header">
          <Text size="lg" weight={700}>
            Think Sessions
          </Text>
          <ActionIcon
            color={hexToColorNameMap[selectedFolder?.color as string] || "gray"}
            size="lg"
            variant="light"
            onClick={openAddThinkSessionModal}
          >
            <Plus size="1.75rem" />
          </ActionIcon>
        </div>
        <Paper
          p="md"
          className="action-item-list-container"
          style={{
            backgroundColor:
              theme.colorScheme === "light" ? `${selectedFolder?.color}11` : "",
          }}
        >
          {thinkSessions?.map((thinkSession) => (
            <ThinkSessionItem
              key={thinkSession.id}
              title={thinkSession.title}
              location={thinkSession.location}
              thinkfolderColor={selectedFolder?.color as string}
              date={new Date(thinkSession.date)}
              start_time={new Date(thinkSession.start_time)}
              end_time={new Date(thinkSession.end_time)}
              thinkfolderIcon={selectedFolder?.icon as string}
            />
          ))}
        </Paper>
      </div>
    </div>
  );
};

export default PlanOverviewPage;
