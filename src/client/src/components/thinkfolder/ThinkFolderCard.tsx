import React from "react";
import "./thinkFolder.scss";
import { ActionIcon } from "@mantine/core";
import { IconFolderFilled } from "@tabler/icons-react";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";
interface ThinkFolderProps {
  folderColor?: string;
}
const ThinkFolderCard = ({ folderColor }: ThinkFolderProps) => {
  const getColorFromHex = () => {
    if (folderColor) {
      return hexToColorNameMap[folderColor];
    }
    return "gray";
  };

  return (
    <div id="think-folder-container">
      <ActionIcon
        id="think-folder-button"
        variant="light"
        color={getColorFromHex()}
      >
        <IconFolderFilled id="folder-icon" />
      </ActionIcon>
    </div>
  );
};

export default ThinkFolderCard;
