import React, { useState, useEffect } from "react";
import "./thinkFolderCard.scss";
import { ThemeIcon, Text } from "@mantine/core";
import * as allIcons from "tabler-icons-react";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";
import IconType from "../../utils/constants/iconType.constant";

interface ThinkFolderProps {
  folderColor: string;
  folderName: string;
  folderSubtitle: string;
  folderIcon: string;
  onClick?: any;
  hoverActive?: boolean;
}

const ThinkFolderCard = ({
  folderColor,
  folderName,
  folderSubtitle,
  folderIcon,
  onClick,
  hoverActive,
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
  }, [folderColor, hoverActive, hoverColor]);

  const handleMouseEnter = () => {
    if (hoverActive) {
      if (folderColor) {
        document.documentElement.style.setProperty(
          "--hover-background-color",
          hoverColor
        );
      }
    }
  };

  const handleMouseLeave = () => {
    if (hoverActive) {
      // Reset to default hover color when mouse leaves
      document.documentElement.style.setProperty(
        "--hover-background-color",
        getColorFromHex()
      );
    }
  };

  const handleOnClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const Icon = (allIcons as IconType)[folderIcon];

  return (
    <div
      className={`think-folder-item-container ${
        hoverActive ? "" : "hover-inactive"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleOnClick}
    >
      <div className="think-folder-icon-container">
        <ThemeIcon
          variant="light"
          color={getColorFromHex()}
          size="xl"
          style={{
            color: folderColor,
            backgroundColor: folderColor + "33",
          }}
        >
          {Icon && <Icon className="think-folder-icon" />}
        </ThemeIcon>
      </div>
      <div className="think-folder-title-container">
        <span className="think-folder-title">{folderName}</span>
        <Text c="dimmed">{folderSubtitle}</Text>
      </div>
    </div>
  );
};

export default ThinkFolderCard;
