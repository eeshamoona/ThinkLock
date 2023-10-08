import React from "react";
import "./thinkSessionItem.scss";
import { ActionIcon, Badge, Text, Card, useMantineTheme } from "@mantine/core";
import * as allIcons from "tabler-icons-react";
import { hexToColorNameMap } from "../../../utils/constants/hexCodeToColor.constant";
import { TbMapPinFilled } from "react-icons/tb";
import IconType from "../../../utils/constants/iconType.constant";
import { Droppable } from "react-beautiful-dnd";

interface ThinkSessionProps {
  id: string;
  title: string;
  date: Date;
  start_time: Date;
  end_time: Date;
  location: string;
  thinkfolderColor: string;
  thinkfolderIcon: string;
  isDroppable: boolean;
  onClick?: (id: string) => void;
}

/**
 * Think Session Item component that displays a think session
 * If isDroppable is true, it will be wrapped in a Droppable
 * component so it must be used in DragDropContext and Droppable components
 * @param id - id of the think session
 * @param title - title of the think session
 * @param date - date of the think session
 * @param start_time - start time of the think session
 * @param end_time - end time of the think session
 * @param location - location of the think session
 * @param thinkfolderColor - color of the thinkfolder
 * @param thinkfolderIcon - icon of the thinkfolder
 * @param isDroppable - whether the think session is droppable
 * @param onClick - callback function to trigger when the think session is clicked
 * @returns
 */
const ThinkSessionItem = ({
  id,
  title,
  date,
  start_time,
  end_time,
  location,
  thinkfolderColor,
  thinkfolderIcon,
  isDroppable,
  onClick,
}: ThinkSessionProps) => {
  const Icon = (allIcons as IconType)[thinkfolderIcon];
  const color = hexToColorNameMap[thinkfolderColor] || "gray";
  const theme = useMantineTheme();
  const darkMode = theme.colorScheme === "dark";

  function formatTime(time: Date): string {
    const formattedHours = time.getHours() % 12 || 12;
    const formattedMinutes = time.getMinutes().toString().padStart(2, "0");
    const ampm = time.getHours() >= 12 ? "PM" : "AM";
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  }

  console.log(date);
  // Convert date to local date
  date = new Date(date.toString().replace(/-/g, "/").replace(/T.+/, ""));
  console.log(date);

  document.documentElement.style.setProperty(
    "--border-color",
    `${thinkfolderColor}AA`
  );

  const thinkFolderColorExpanded =
    darkMode && color === "dark" ? "#FFFFFFAA" : `${thinkfolderColor}AA`;

  const variantExpanded = darkMode && color === "dark" ? "filled" : "light";

  const content = (
    <>
      <div
        className="think-session-top-section"
        style={{ borderRight: `5px solid ${thinkFolderColorExpanded}` }}
      >
        <ActionIcon
          color={color}
          size={45}
          variant={variantExpanded}
          radius="md"
        >
          {Icon && <Icon className="think-session-icon" />}
        </ActionIcon>
        <div className="think-session-title-info">
          <Text size={"lg"} weight={"500"}>
            {title}
          </Text>
          <div className={location ? "think-session-location" : "no-location"}>
            <TbMapPinFilled size={18} color={`${thinkFolderColorExpanded}`} />
            <Text size={"sm"} c="dimmed" className="location-text">
              {location}
            </Text>
          </div>
        </div>
      </div>
      <div className="think-session-bottom-section">
        <div className="think-session-date-container">
          <Badge size="xs" radius="xs" color={color} variant={variantExpanded}>
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
          <Text size="md" c="dimmed" className="think-session-time">
            {formatTime(start_time)} - {formatTime(end_time)}
          </Text>
        </div>
      </div>
    </>
  );

  if (isDroppable) {
    return (
      <Droppable droppableId={`think-session-id-${id.toString()}`}>
        {(provided, snapshot) => (
          <Card
            shadow="sm"
            padding="xs"
            pr={0}
            radius="xs"
            className="think-session-item-container"
          >
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {content}

              <div
                className={`action-item-drop-zone ${
                  snapshot.isDraggingOver ? "dragging-over" : ""
                }`}
              >
                {provided.placeholder}
              </div>
            </div>
          </Card>
        )}
      </Droppable>
    );
  } else {
    return (
      <Card
        shadow="sm"
        padding="xs"
        pr={0}
        radius="xs"
        className="think-session-item-container"
        onClick={() => onClick && onClick(id)}
      >
        {content}
      </Card>
    );
  }
};

export default ThinkSessionItem;
