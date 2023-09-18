import React from "react";
import "./thinkSessionItem.scss";
import { ActionIcon, Text } from "@mantine/core";
import * as allIcons from "tabler-icons-react";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";
import { MapPin } from "tabler-icons-react";

interface ThinkSessionProps {
  title: string;
  date: Date;
  start_time: Date;
  end_time: Date;
  location: string;
  thinkfolderColor: string;
  thinkfolderIcon: string;
}

type IconType = Record<
  string,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
>;

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
        <ActionIcon color={color} size="xl" variant="light" radius="md">
          {Icon && (
            <Icon className="think-folder-icon" color={thinkfolderColor} />
          )}
        </ActionIcon>
        <Text size="xl" className="think-session-date">
          {date.getDate()}
        </Text>
        <div className="think-session-day-time">
          <Text size="md">
            {date.toLocaleString("default", { weekday: "long" })}
          </Text>
          <Text size="md" color="gray">
            {formatTime(start_time)} - {formatTime(end_time)}
          </Text>
        </div>
      </div>
      <div className="think-session-bottom-section">
        <Text size={"lg"} weight={"500"}>
          {title}
        </Text>
        <div className="think-session-location">
          <MapPin />
          <Text size={"md"} color="gray">
            {location}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default ThinkSessionItem;
