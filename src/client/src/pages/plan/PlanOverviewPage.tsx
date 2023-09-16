import React, { useEffect, useState } from "react";
import "./planOverviewPage.scss";
import ThinkFolderCard from "../../components/thinkfolder/ThinkFolderItem";
import { ThinkFolder } from "../../utils/models/thinkfolder.model";
import { getAllThinkFolders } from "../../services/thinkFolderAPICallerService";

const PlanOverviewPage = () => {
  const [folders, setFolders] = useState<ThinkFolder[]>([]);

  useEffect(() => {
    getAllThinkFolders().then((res) => {
      if (typeof res !== "string") {
        setFolders(res as ThinkFolder[]);
      }
    });
  });

  return (
    <div className="think-folder-container">
      {folders?.map((folder) => (
        <ThinkFolderCard
          key={folder.id}
          folderColor={folder.color}
          folderName={folder.name}
          folderSubtitle={folder.description}
          folderIcon={folder.icon}
        />
      ))}
    </div>
  );
};

export default PlanOverviewPage;
