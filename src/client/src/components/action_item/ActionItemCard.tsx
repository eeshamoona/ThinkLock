import React, { useState } from "react";
import "./actionItemCard.scss";
import { Card, Checkbox, Text } from "@mantine/core";
import { RxDragHandleDots2 } from "react-icons/rx";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";

interface ActionItemProps {
  title: string;
  description: string;
  completed: boolean;
  draggable: boolean;
  thinkfolderColor: string;
}

const ActionItemCard = ({
  title,
  description,
  completed,
  draggable,
  thinkfolderColor,
}: ActionItemProps) => {
  const [isCompleted, setIsCompleted] = useState<boolean>(completed);
  const textClassName = isCompleted ? "textCompleted" : "textNotCompleted";

  const getColorFromHex = () => {
    if (thinkfolderColor) {
      return hexToColorNameMap[thinkfolderColor];
    }
    return "blue";
  };

  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="sm"
      className="action-item-card-container"
    >
      <Checkbox
        label={<Text className={textClassName}>{description}</Text>}
        description={<Text className={textClassName}>{title}</Text>}
        size="md"
        color={getColorFromHex()}
        checked={isCompleted}
        onChange={() => setIsCompleted(!isCompleted)}
      />
      {draggable ? (
        <RxDragHandleDots2 color="gray" size={"1.75rem"} />
      ) : (
        <div className="empty-space"></div>
      )}
    </Card>
  );
};

export default ActionItemCard;
