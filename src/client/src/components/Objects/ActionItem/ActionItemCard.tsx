import React, { useState } from "react";
import "./actionItemCard.scss";
import { Card, Checkbox, Text } from "@mantine/core";
import { RxDragHandleDots2 } from "react-icons/rx";
import { hexToColorNameMap } from "../../../utils/constants/hexCodeToColor.constant";
import { Draggable } from "react-beautiful-dnd";
import { toggleCompletedActionItem } from "../../../services/actionItemAPICallerService";

interface ActionItemProps {
  id: string;
  index: number;
  title: string;
  description: string;
  completed: boolean;
  draggable: boolean;
  thinkfolderColor: string;
}

/**
 * Action Item Card component that displays an action item
 * If draggable is true, it will be wrapped in a Draggable component so must be used in a Droppable component
 * @param id - id of the action item
 * @param index - index of the action item
 * @param title - title of the action item
 * @param description - description of the action item
 * @param completed - whether the action item is completed
 * @param draggable - whether the action item is draggable
 * @param thinkfolderColor - color of the thinkfolder
 * @returns
 */
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

  function getColorFromHex(): string {
    if (thinkfolderColor) {
      return hexToColorNameMap[thinkfolderColor];
    }
    return "blue";
  }

  function completeActionItem() {
    toggleCompletedActionItem(parseInt(id));
    setIsCompleted(!isCompleted);
  }

  if (draggable) {
    return (
      <Draggable draggableId={`action-item-id-${id}`} index={index} key={id}>
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
              <RxDragHandleDots2 color="gray" size={"1.75rem"} />
            </Card>
          </div>
        )}
      </Draggable>
    );
  } else {
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
          onChange={completeActionItem}
        />
      </Card>
    );
  }
};

export default ActionItemCard;
