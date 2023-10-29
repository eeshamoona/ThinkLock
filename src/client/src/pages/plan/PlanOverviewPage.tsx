import React, { useCallback, useEffect, useMemo, useState } from "react";
import ThinkFolderCard from "../../components/Objects/ThinkFolder/ThinkFolderCard";
import { ThinkFolder } from "../../utils/models/thinkfolder.model";
import { getAllThinkFolders } from "../../services/thinkFolderAPICallerService";
import { ActionIcon, Paper, Text } from "@mantine/core";
import { ArrowLeft, Plus } from "tabler-icons-react";
import ActionItemCard from "../../components/Objects/ActionItem/ActionItemCard";
import { getActionItemsWithNoThinkSession } from "../../services/actionItemAPICallerService";
import {
  getAllThinkSessionsByThinkFolderId,
  getThinkSessionHeatMapByYear,
} from "../../services/thinkSessionAPICallerService";
import { updateActionItem } from "../../services/actionItemAPICallerService";
import ThinkSessionItem from "../../components/Objects/ThinkSession/ThinkSessionItem";
import AddThinkSessionModal from "../../components/Modals/AddThinkSession/AddThinkSessionModal";
import AddActionItemModal from "../../components/Modals/AddActionItem/AddActionItemModal";
import { useModals } from "@mantine/modals";
import { useMantineTheme } from "@mantine/core";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import "./planOverviewPage.scss";
import Heatmap from "../../components/Heatmap/Heatmap";
import { HeatmapData } from "../../utils/models/heatmapdata.model";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";

enum ModalOptions {
  ThinkSession,
  ActionItem,
}

/**
 * Plan Overview Page displays think folders and their action items and think sessions
 * @returns
 */
const PlanOverviewPage = () => {
  const [folders, setFolders] = useState<ThinkFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<ThinkFolder | null>(
    null
  );
  const [showFolderDetails, setShowFolderDetails] = useState<boolean>(false);
  const [actionItems, setActionItems] = useState<any[]>([]);
  const [thinkSessions, setThinkSessions] = useState<any[]>([]);
  const [heatmapData, setHeatmapData] = useState<{
    [folderId: string]: HeatmapData[];
  }>({});
  const [heatmapMax, setHeatmapMax] = useState<{ [folderId: string]: number }>(
    {}
  );
  const modals = useModals();
  const theme = useMantineTheme();

  const handleFolderClick = useCallback((folder: ThinkFolder) => {
    setSelectedFolder(folder);
    setShowFolderDetails(true);
  }, []);

  const handleFolderHover = useCallback((folder: ThinkFolder) => {
    setSelectedFolder(folder);
    setShowFolderDetails(false);
  }, []);

  const handleBackClick = useCallback(() => {
    setSelectedFolder(null);
    setShowFolderDetails(false);
  }, []);

  const refreshActionItems = useCallback(async () => {
    if (!selectedFolder) return;
    const actionItemsRes = await getActionItemsWithNoThinkSession(
      selectedFolder.id as number
    );
    if (typeof actionItemsRes !== "string") {
      setActionItems(actionItemsRes as any[]);
    }
  }, [selectedFolder]);

  const refreshThinkSessions = useCallback(async () => {
    if (!selectedFolder) return;
    const thinkSessionsRes = await getAllThinkSessionsByThinkFolderId(
      selectedFolder.id as number
    );
    if (typeof thinkSessionsRes !== "string") {
      setThinkSessions(thinkSessionsRes as any[]);
    }
  }, [selectedFolder]);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedFolder === null) {
        const res = await getAllThinkFolders();
        console.log("HELOOOOOO", res);
        if (typeof res !== "string") {
          setFolders(res as ThinkFolder[]);
        }
      } else {
        await Promise.all([refreshActionItems(), refreshThinkSessions()]);
      }
    };
    fetchData();
  }, [selectedFolder, refreshActionItems, refreshThinkSessions]);

  useEffect(() => {
    //Get all heatmap data and save it to state
    folders.forEach((folder) => {
      getThinkSessionHeatMapByYear(
        folder.id as number,
        new Date().getFullYear()
      ).then((res) => {
        if (typeof res !== "string") {
          setHeatmapData((prevState) => ({
            ...prevState,
            [folder.id as number]: res as HeatmapData[],
          }));
        }
      });
    });
  }, [folders]);

  const memoizedHeatmapData = useMemo(() => {
    if (!selectedFolder) return [];
    return heatmapData[selectedFolder.id as number] || [];
  }, [heatmapData, selectedFolder]);

  const openModal = useCallback(
    (content: ModalOptions) => {
      modals.openModal({
        title: (
          <div>
            <Text size="lg" weight={700}>
              {content === ModalOptions.ThinkSession
                ? "Add Think Session"
                : "Add Action Item"}
            </Text>
          </div>
        ),
        children: (
          <>
            {content === ModalOptions.ThinkSession ? (
              selectedFolder ? (
                <AddThinkSessionModal
                  thinkFolderId={(selectedFolder.id as number).toString()}
                  successCallback={refreshThinkSessions}
                />
              ) : (
                <AddThinkSessionModal />
              )
            ) : selectedFolder ? (
              <AddActionItemModal
                thinkFolderId={(selectedFolder.id as number).toString()}
                successCallback={refreshActionItems}
              />
            ) : (
              <AddActionItemModal />
            )}
          </>
        ),
        sx: { borderRadius: "1rem" },
        size: content === ModalOptions.ThinkSession ? "md" : "lg",
      });
    },
    [modals, refreshActionItems, refreshThinkSessions, selectedFolder]
  );

  const onDragEnd = useCallback(
    async (result: any) => {
      if (!result.destination) return; // Drop outside of droppable area

      const destination = result.destination.droppableId.split("-")[3];
      const source = result.source.droppableId.split("-")[3];
      const actionItemId = result.draggableId.split("-")[3];

      if (destination === source) return; // No change in order

      // Temporarily remove action item from list
      const newActionItems = actionItems.filter(
        (actionItem) => actionItem.id !== parseInt(actionItemId)
      );

      setActionItems(newActionItems);
      await updateActionItem(actionItemId, { thinksession_id: destination });
      await refreshActionItems();
    },
    [actionItems, refreshActionItems]
  );

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
            {folders.map((folder) => (
              <ThinkFolderCard
                key={folder.id}
                folderColor={folder.color}
                folderName={folder.name}
                folderSubtitle={folder.description}
                folderIcon={folder.icon}
                onClick={() => handleFolderClick(folder)}
                hoverActive={true}
                onHover={() => {
                  handleFolderHover(folder);
                }}
              />
            ))}
          </Paper>
        )}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className={
            showFolderDetails
              ? "think-folders-action-items container"
              : "hidden"
          }
        >
          <div className="action-item-header">
            <Text size="lg" weight={700}>
              Action Items
            </Text>
            <ActionIcon
              color={
                hexToColorNameMap[selectedFolder?.color as string] || "gray"
              }
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
                theme.colorScheme === "light"
                  ? `${selectedFolder?.color}11`
                  : "",
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
        {showFolderDetails ? (
          <div className={"think-folders-think-session container"}>
            <div className="think-session-header">
              <Text size="lg" weight={700}>
                Think Sessions
              </Text>
              <ActionIcon
                color={
                  hexToColorNameMap[selectedFolder?.color as string] || "gray"
                }
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
                  theme.colorScheme === "light"
                    ? `${selectedFolder?.color}11`
                    : "",
              }}
            >
              {thinkSessions?.map((thinkSession) => (
                <ThinkSessionItem
                  id={thinkSession.id}
                  key={thinkSession.id}
                  title={thinkSession.title}
                  location={thinkSession.location}
                  thinkfolderColor={selectedFolder?.color as string}
                  date={thinkSession.date}
                  start_time={new Date(thinkSession.start_time)}
                  end_time={new Date(thinkSession.end_time)}
                  thinkfolderIcon={selectedFolder?.icon as string}
                  isDroppable={true}
                />
              ))}
            </Paper>
          </div>
        ) : (
          selectedFolder && (
            <Heatmap
              numOfShades={6}
              heatmapData={memoizedHeatmapData}
              max={heatmapMax[selectedFolder.id as number] || 0}
              thinkfolder_color={selectedFolder ? selectedFolder.color : "red"}
            />
          )
        )}
      </DragDropContext>
    </div>
  );
};

export default PlanOverviewPage;
