import { Card, Textarea, ActionIcon, Group, Badge } from "@mantine/core";
import React, { useCallback, useRef, useState } from "react";
import { RiCheckboxLine } from "react-icons/ri";
import { RiEdit2Line } from "react-icons/ri";
import { RiBringForward } from "react-icons/ri";
import { RiSendBackward } from "react-icons/ri";
import "./flashcard.scss";

interface FlashcardProps {
  front: string;
  back: string;
  id: number;
  thinkfolder_color: string;
}

const Flashcard = ({ front, back, id, thinkfolder_color }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>(false);
  const [frontContent, setFrontContent] = useState<string>(front);
  const [backContent, setBackContent] = useState<string>(back);
  const [actionItemHovered, setActionItemHovered] = useState(false);
  const actionButtonRef = useRef(null);

  const handleCardClick = (event: React.MouseEvent) => {
    if (!editable) {
      setIsFlipped(!isFlipped);
    }
  };

  const getIcon = useCallback(
    () =>
      editable ? (
        <RiCheckboxLine />
      ) : actionItemHovered ? (
        <RiEdit2Line />
      ) : isFlipped ? (
        <RiSendBackward />
      ) : (
        <RiBringForward />
      ),
    [editable, actionItemHovered, isFlipped]
  );

  const getTooltipLabel = useCallback(
    () =>
      editable
        ? "Save"
        : actionItemHovered
        ? "Edit"
        : isFlipped
        ? "Back"
        : "Front",
    [actionItemHovered, editable, isFlipped]
  );

  function handleSaveClick(event: React.MouseEvent): void {
    event.stopPropagation();
    setEditable(false);
  }

  function handleEditClick(event: React.MouseEvent): void {
    event.stopPropagation();
    setEditable(true);
  }

  return (
    <div onClick={handleCardClick} className="flashcard-container">
      <div className={`flashcard ${isFlipped ? "flipped" : ""}`}>
        <Card withBorder={true} shadow="sm" className="flashcard-front">
          <Group>
            <Badge
              variant="light"
              color={thinkfolder_color}
              p={"xs"}
              pr={0}
              size="xs"
              radius="xs"
              ref={actionButtonRef}
              onMouseEnter={() => setActionItemHovered(true)}
              onMouseLeave={() => setActionItemHovered(false)}
              onClick={editable ? handleSaveClick : handleEditClick}
              className="flashcard-front-action-button"
              rightSection={<ActionIcon>{getIcon()}</ActionIcon>}
            >
              {getTooltipLabel()}
            </Badge>
          </Group>
          <Textarea
            variant="unstyled"
            value={frontContent}
            onChange={(event) => {
              setFrontContent(event.currentTarget.value);
            }}
            w={"100%"}
            p={"sm"}
            className={`flashcard-textarea-front ${editable ? "" : "static"}`}
          />
        </Card>
        <Card withBorder={true} shadow="sm" className="flashcard-back">
          <Group>
            <Badge
              ref={actionButtonRef}
              onMouseEnter={() => setActionItemHovered(true)}
              onMouseLeave={() => setActionItemHovered(false)}
              onClick={editable ? handleSaveClick : handleEditClick}
              variant="light"
              p={"xs"}
              pr={0}
              radius="xs"
              size="xs"
              color={thinkfolder_color}
              className="flashcard-back-action-button"
              rightSection={<ActionIcon>{getIcon()}</ActionIcon>}
            >
              {getTooltipLabel()}
            </Badge>
          </Group>
          <Textarea
            variant="unstyled"
            value={backContent}
            onChange={(event) => {
              if (editable) {
                setBackContent(event.currentTarget.value);
              }
            }}
            w={"100%"}
            p={"sm"}
            className={`flashcard-textarea-back ${editable ? "" : "static"}`}
          />
        </Card>
      </div>
    </div>
  );
};

export default Flashcard;
