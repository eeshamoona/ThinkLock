import React, { useEffect, useState } from "react";
import "./planOverviewPage.scss";
import { SimpleGrid } from "@mantine/core";
import ThinkFolderCard from "../../components/thinkfolder/ThinkFolderCard";
import { ThinkFolder } from "../../utils/models/thinkfolder.model";
import { getAllThinkFolders } from "../../services/thinkFolderAPICallerService";

const PlanOverviewPage = () => {
  const [folders, setFolders] = useState<ThinkFolder[]>([]);

  useEffect(() => {
    getAllThinkFolders().then((res) => setFolders(res as ThinkFolder[]));
  });

  return (
    <SimpleGrid
      cols={4}
      spacing="md"
      breakpoints={[
        { maxWidth: "85rem", cols: 3, spacing: "md" },
        { maxWidth: "65rem", cols: 2, spacing: "sm" },
      ]}
    >
      {folders?.map((folder) => (
        <ThinkFolderCard key={folder.id} folderColor={folder.color} />
      ))}
    </SimpleGrid>
  );
};

export default PlanOverviewPage;
