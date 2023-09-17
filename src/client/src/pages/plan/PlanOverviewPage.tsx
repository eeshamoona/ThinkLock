import React, { useEffect, useState } from "react";
import "./planOverviewPage.scss";
import ThinkFolderCard from "../../components/think_folder/ThinkFolderItem";
import { ThinkFolder } from "../../utils/models/thinkfolder.model";
import { getAllThinkFolders } from "../../services/thinkFolderAPICallerService";
import { ActionIcon, Text } from "@mantine/core";
import { ArrowLeft, Plus } from "tabler-icons-react";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";
import ActionItemCard from "../../components/action_item/ActionItemCard";
import { getAllActionItemsByThinkFolderId } from "../../services/actionItemAPICallerService";
import { getAllThinkSessionsByThinkFolderId } from "../../services/thinkSessionAPICallerService";
import ThinkSessionItem from "../../components/think_session/ThinkSessionItem";

const PlanOverviewPage = () => {
  const [folders, setFolders] = useState<ThinkFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<ThinkFolder | null>(
    null
  );
  const [showFolderDetails, setShowFolderDetails] = useState<boolean>(false);
  const [actionItems, setActionItems] = useState<any[]>([]);
  const [thinkSessions, setThinkSessions] = useState<any[]>([]);

  useEffect(() => {
    if (selectedFolder === null || !showFolderDetails) {
      getAllThinkFolders().then((res) => {
        if (typeof res !== "string") {
          setFolders(res as ThinkFolder[]);
        }
      });
    } else {
      // Get action items for selected folder
      getAllActionItemsByThinkFolderId(selectedFolder.id).then((res) => {
        if (typeof res !== "string") {
          setActionItems(res as any[]);
        }
      });

      getAllThinkSessionsByThinkFolderId(selectedFolder.id).then((res) => {
        if (typeof res !== "string") {
          setThinkSessions(res as any[]);
        }
      });
    }
  }, [selectedFolder, showFolderDetails]);

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

  return (
    <div className="plan-page-container">
      <div className="think-folders-container container">
        {showFolderDetails ? (
          selectedFolder && (
            <div className="folder-to-back-container">
              <div className="go-back-container">
                <ActionIcon onClick={handleBackClick}>
                  <ArrowLeft color="black" />
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
          <>
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
          </>
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
          >
            <Plus size="1.75rem" />
          </ActionIcon>
        </div>
        <div className="action-item-list-container">
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
        </div>
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
          >
            <Plus size="1.75rem" />
          </ActionIcon>
        </div>
        <div className="action-item-list-container">
          <ThinkSessionItem
            title="Think Session Title"
            location="Think Session Description"
            thinkfolderColor={selectedFolder?.color as string}
            date={new Date()}
            start_time={new Date()}
            end_time={new Date()}
            thinkfolderIcon={selectedFolder?.icon as string}
          />
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
        </div>
      </div>
    </div>
  );
};

export default PlanOverviewPage;
