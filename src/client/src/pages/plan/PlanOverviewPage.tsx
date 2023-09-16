import React, { useEffect, useState } from "react";
import "./planOverviewPage.scss";
import ThinkFolderCard from "../../components/think_folder/ThinkFolderItem";
import { ThinkFolder } from "../../utils/models/thinkfolder.model";
import { getAllThinkFolders } from "../../services/thinkFolderAPICallerService";
import { ActionIcon, Text } from "@mantine/core";
import { ArrowLeft } from "tabler-icons-react";

const PlanOverviewPage = () => {
  const [folders, setFolders] = useState<ThinkFolder[]>([]);
  const [selectedFolder, setSelectedFolder] = useState<ThinkFolder | null>(
    null
  );
  const [showFolderDetails, setShowFolderDetails] = useState<boolean>(false);

  useEffect(() => {
    getAllThinkFolders().then((res) => {
      if (typeof res !== "string") {
        setFolders(res as ThinkFolder[]);
      }
    });
  });

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
        <Text size="md" weight={700}>
          Action Items
        </Text>
      </div>
      <div
        className={
          showFolderDetails ? "think-folders-think-session container" : "hidden"
        }
      >
        <Text size="md" weight={700}>
          Think Sessions
        </Text>
      </div>
    </div>
  );
};

export default PlanOverviewPage;
