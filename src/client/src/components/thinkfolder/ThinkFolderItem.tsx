import React, { useState, useEffect } from "react";
import "./thinkFolderItem.scss";
import { ActionIcon } from "@mantine/core";
import { IconFolderFilled } from "@tabler/icons-react";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";

interface ThinkFolderProps {
  folderColor: string;
  folderName: string;
  folderSubtitle: string;
  folderIcon?: string;
}

const ThinkFolderCard = ({
  folderColor,
  folderName,
  folderSubtitle,
  folderIcon,
}: ThinkFolderProps) => {
  const getColorFromHex = () => {
    if (folderColor) {
      return hexToColorNameMap[folderColor];
    }
    return "gray";
  };

  const [hoverColor, setHoverColor] = useState(
    folderColor ? `${folderColor}22` : ""
  );

  useEffect(() => {
    setHoverColor(folderColor ? `${folderColor}22` : "");
  }, [folderColor]);

  const handleMouseEnter = () => {
    // Set the hover color when mouse enters
    if (folderColor) {
      document.documentElement.style.setProperty(
        "--hover-background-color",
        hoverColor
      );
    }
  };

  const handleMouseLeave = () => {
    // Reset to default hover color when mouse leaves
    document.documentElement.style.setProperty(
      "--hover-background-color",
      getColorFromHex()
    );
  };

  return (
    <div
      className="think-folder-item-container"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="think-folder-icon-container">
        <ActionIcon
          variant="light"
          color={getColorFromHex()}
          size="xl"
          style={{
            backgroundColor: folderColor + "55",
          }}
        >
          <IconFolderFilled color={getColorFromHex()} />
        </ActionIcon>
      </div>
      <div className="think-folder-title-container">
        <span className="think-folder-title">{folderName}</span>
        <span className="think-folder-subtitle">{folderSubtitle}</span>
      </div>
    </div>
  );
};

export default ThinkFolderCard;
