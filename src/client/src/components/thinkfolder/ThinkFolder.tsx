import React from "react";
import "./thinkFolder.scss";
import { ActionIcon } from "@mantine/core";
import { Folder } from "tabler-icons-react";

const ThinkFolder = () => {
  return (
    <div id="think-folder-container">
      <ActionIcon id="think-folder-button">
        <Folder id="folder-icon" size={"md"} />
      </ActionIcon>
    </div>
  );
};

export default ThinkFolder;
