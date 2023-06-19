import React from "react";
import "./planOverviewPage.scss";
import { SimpleGrid } from "@mantine/core";
import ThinkFolder from "../../components/thinkfolder/ThinkFolder";

const PlanOverviewPage = () => {
  return (
    <SimpleGrid
      cols={5}
      spacing="md"
      breakpoints={[
        { maxWidth: "85rem", cols: 4, spacing: "md" },
        { maxWidth: "65rem", cols: 3, spacing: "sm" },
      ]}
    >
      <ThinkFolder folderKey={1} folderColor="red" />
      <ThinkFolder folderKey={2} folderColor="#21DA22" />
      <ThinkFolder folderKey={3} />
    </SimpleGrid>
  );
};

export default PlanOverviewPage;
