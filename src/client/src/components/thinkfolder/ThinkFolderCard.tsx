import React from "react";
import "./thinkFolder.scss";
import { ActionIcon } from "@mantine/core";
import { IconFolderFilled } from "@tabler/icons-react";
interface ThinkFolderProps {
  folderColor?: string;
}
const ThinkFolderCard = ({ folderColor }: ThinkFolderProps) => {
  return (
    <div id="think-folder-container">
      <ActionIcon id="think-folder-button" variant="light" color={folderColor}>
        <IconFolderFilled id="folder-icon" />
      </ActionIcon>
    </div>
  );
};

export default ThinkFolderCard;
