import React, { useState } from "react";
import "./actionItemCard.scss";
import { Card, Checkbox, Text } from "@mantine/core";
import { RxDragHandleDots2 } from "react-icons/rx";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";
import { Draggable } from "react-beautiful-dnd";

interface ActionItemProps {
  id: string;
  index: number;
  title: string;
  description: string;
  completed: boolean;
  draggable: boolean;
  thinkfolderColor: string;
}

const ActionItemCard = ({
  id,
  index,
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
    <Draggable draggableId={id.toString()} index={index}>
      {(provided: any) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="action-item-card-draggable-container"
        >
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
              <></>
            )}
          </Card>
        </div>
      )}
    </Draggable>
  );
};

export default ActionItemCard;
