import React from "react";
import "./thinkFolder.scss";
import { ActionIcon } from "@mantine/core";
import { Folder } from "tabler-icons-react";
interface ThinkFolderProps {
  folderKey: number;
  folderColor?: string;
}
const ThinkFolder = ({ folderKey, folderColor }: ThinkFolderProps) => {
  return (
    <div id="think-folder-container">
      <ActionIcon id="think-folder-button" variant="light" color={folderColor}>
        <Folder id="folder-icon" />
      </ActionIcon>
    </div>
  );
};

export default ThinkFolder;
