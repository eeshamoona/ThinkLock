import React, { useEffect, useState } from "react";
import "./planOverviewPage.scss";
import ThinkFolderCard from "../../components/think_folder/ThinkFolderCard";
import { ThinkFolder } from "../../utils/models/thinkfolder.model";
import { getAllThinkFolders } from "../../services/thinkFolderAPICallerService";
import { ActionIcon, Paper, Text } from "@mantine/core";
import { ArrowLeft, Plus } from "tabler-icons-react";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";
import ActionItemCard from "../../components/action_item/ActionItemCard";
import { getActionItemsWithNullThinkSessionId } from "../../services/actionItemAPICallerService";
import { getAllThinkSessionsByThinkFolderId } from "../../services/thinkSessionAPICallerService";
import { updateActionItem } from "../../services/actionItemAPICallerService";
import ThinkSessionItem from "../../components/think_session/ThinkSessionItem";
import AddThinkSessionModal from "../../components/add_think_session_modal/AddThinkSessionModal";
import AddActionItemModal from "../../components/add_action_item_modal/AddActionItemModal";
import { useModals } from "@mantine/modals";
import { useMantineTheme } from "@mantine/core";
import { DragDropContext, Droppable } from "react-beautiful-dnd";

enum ModalOptions {
  ThinkSession,
  ActionItem,
}

const PlanOverviewPage = () => {
  const [folders, setFolders] = useState<ThinkFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<ThinkFolder | null>(null);
  const [showFolderDetails, setShowFolderDetails] = useState<boolean>(false);
  const [actionItems, setActionItems] = useState<any[]>([]);
  const [thinkSessions, setThinkSessions] = useState<any[]>([]);
  const [updateDataFlag, setUpdateDataFlag] = useState<boolean>(false);
  const modals = useModals();
  const theme = useMantineTheme();

  const handleFolderClick = (folder: ThinkFolder) => {
    setSelectedFolder(folder);
    setShowFolderDetails(true);
  };

  const handleBackClick = () => {
    setSelectedFolder(null);
    setShowFolderDetails(false);
  };

  const openModal = (content: ModalOptions) => {
    modals.openModal({
      title: (
        <div>
          <Text size="lg" weight={700}>
            {content === ModalOptions.ThinkSession ? "Add Think Session" : "Add Action Item"}
          </Text>
        </div>
      ),
      children: (
        <>
          {content === ModalOptions.ThinkSession ? (
            selectedFolder ? (
              <AddThinkSessionModal thinkFolderId={selectedFolder.id.toString()} />
            ) : (
              <AddThinkSessionModal />
            )
          ) : selectedFolder ? (
            <AddActionItemModal thinkFolderId={selectedFolder.id.toString()} />
          ) : (
            <AddActionItemModal />
          )}
        </>
      ),
      sx: { borderRadius: "1rem" },
      size: content === ModalOptions.ThinkSession ? "md" : "lg",
    });
  };

  const onDragEnd = (result: any) => {
    if (!result.destination) return; // Drop outside of droppable area

    const destination = result.destination.droppableId.split("-")[3];
    const source = result.source.droppableId.split("-")[3];
    const actionItemId = result.draggableId.split("-")[3];

    if (destination === source) return; // No change in order

    setUpdateDataFlag(!updateDataFlag);

    updateActionItem(actionItemId, {
      thinksession_id: destination,
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      if (selectedFolder === null) {
        const res = await getAllThinkFolders();
        if (typeof res !== "string") {
          setFolders(res as ThinkFolder[]);
        }
      } else {
        const [actionItemsRes, thinkSessionsRes] = await Promise.all([
          getActionItemsWithNullThinkSessionId(selectedFolder.id),
          getAllThinkSessionsByThinkFolderId(selectedFolder.id),
        ]);
        if (typeof actionItemsRes !== "string") {
          setActionItems(actionItemsRes as any[]);
        }
        if (typeof thinkSessionsRes !== "string") {
          setThinkSessions(thinkSessionsRes as any[]);
        }
      }
    };

    fetchData();
  }, [selectedFolder, modals, updateDataFlag]);

  return (
    <div className="plan-page-container">
      <div className="think-folders-container container">
        {showFolderDetails ? (
          selectedFolder && (
            <div className="folder-to-back-container">
              <div className="go-back-container">
                <ActionIcon onClick={handleBackClick} c={theme.colorScheme === "dark" ? "white" : "black"}>
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
      <DragDropContext onDragEnd={onDragEnd}>
        <div className={showFolderDetails ? "think-folders-action-items container" : "hidden"}>
          <div className="action-item-header">
            <Text size="lg" weight={700}>
              Action Items
            </Text>
            <ActionIcon
              color={hexToColorNameMap[selectedFolder?.color as string] || "gray"}
              size="lg"
              variant="light"
              onClick={() => openModal(ModalOptions.ActionItem)}
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
            <Droppable
              droppableId={`action-item-list-folder-${selectedFolder?.id}`}
              direction="vertical"
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="action-item-list"
                >
                  {actionItems?.map((actionItem, index) => (
                    <ActionItemCard
                      id={actionItem.id}
                      index={index}
                      key={actionItem.id}
                      title={actionItem.title}
                      description={actionItem.description}
                      completed={actionItem.completed}
                      draggable={true}
                      thinkfolderColor={selectedFolder?.color as string}
                    />
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </Paper>
        </div>
        <div className={showFolderDetails ? "think-folders-think-session container" : "hidden"}>
          <div className="think-session-header">
            <Text size="lg" weight={700}>
              Think Sessions
            </Text>
            <ActionIcon
              color={hexToColorNameMap[selectedFolder?.color as string] || "gray"}
              size="lg"
              variant="light"
              onClick={() => openModal(ModalOptions.ThinkSession)}
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
                id={thinkSession.id}
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
      </DragDropContext>
    </div>
  );
};

export default PlanOverviewPage;