import React, { useEffect, useState } from "react";
import "./planOverviewPage.scss";
import ThinkFolderCard from "../../components/thinkfolder/ThinkFolderCard";
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
        />
      ))}
    </div>
  );
};

export default PlanOverviewPage;
