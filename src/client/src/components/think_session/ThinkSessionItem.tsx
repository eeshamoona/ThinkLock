import React from "react";
import "./thinkSessionItem.scss";
import { ActionIcon, Badge, Text } from "@mantine/core";
import * as allIcons from "tabler-icons-react";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";
import { TbMapPinFilled } from "react-icons/tb";
import IconType from "../../utils/constants/iconType.constant";

interface ThinkSessionProps {
  title: string;
  date: Date;
  start_time: Date;
  end_time: Date;
  location: string;
  thinkfolderColor: string;
  thinkfolderIcon: string;
}

const ThinkSessionItem = ({
  title,
  date,
  start_time,
  end_time,
  location,
  thinkfolderColor,
  thinkfolderIcon,
}: ThinkSessionProps) => {
  const Icon = (allIcons as IconType)[thinkfolderIcon];
  const color = hexToColorNameMap[thinkfolderColor] || "gray";

  const formatTime = (time: Date) => {
    const formattedHours = time.getHours() % 12 || 12;
    const formattedMinutes = time.getMinutes().toString().padStart(2, "0");
    const ampm = time.getHours() >= 12 ? "PM" : "AM";
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };

  document.documentElement.style.setProperty(
    "--border-color",
    `${thinkfolderColor}22`
  );

  return (
    <div className="think-session-item-container">
      <div className="think-session-top-section">
        <ActionIcon color={color} size={45} variant="light" radius="md">
          {Icon && (
            <Icon className="think-session-icon" color={thinkfolderColor} />
          )}
        </ActionIcon>
        <div className="think-session-title-info">
          <Text size={"lg"} weight={"500"}>
            {title}
          </Text>
          <div className="think-session-location">
            <TbMapPinFilled size={18} color={`${thinkfolderColor}BB`} />
            <Text size={"sm"} color="gray">
              {location}
            </Text>
          </div>
        </div>
      </div>
      <div className="think-session-bottom-section">
        <div className="think-session-date-container">
          <Badge size="xs" radius="xs" color="gray">
            {date
              .toLocaleString("default", { month: "short" })
              .toLocaleUpperCase()}
          </Badge>
          <Text size="xl" className="think-session-date">
            {date.getDate()}
          </Text>
        </div>
        <div className="think-session-day-time">
          <Text size="md">
            {date.toLocaleString("default", { weekday: "long" })}
          </Text>
          <Text size="md" color="gray" className="think-session-time">
            {formatTime(start_time)} - {formatTime(end_time)}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ThinkSessionItem;
