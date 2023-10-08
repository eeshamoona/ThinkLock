import { Card, Textarea, ActionIcon, Badge } from "@mantine/core";
import React, { useCallback, useRef, useState } from "react";
import {
  IconKey,
  IconCheck,
  IconEdit,
  IconLock,
  IconTrash,
} from "@tabler/icons-react";
import "./flashcard.scss";

interface FlashcardProps {
  front: string;
  back: string;
  id: number;
  index: number;
  thinkfolder_color: string;
  onSubmitCallback: (front: string, back: string, index: number) => void;
  onDeleteCallback: (id: number) => void;
}

const Flashcard = ({
  front,
  back,
  id,
  index,
  thinkfolder_color,
  onSubmitCallback,
  onDeleteCallback,
}: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>(false);
  const [frontContent, setFrontContent] = useState<string>(front);
  const [backContent, setBackContent] = useState<string>(back);
  const [actionItemHovered, setActionItemHovered] = useState(false);
  const actionButtonRef = useRef(null);

  const [showBackText, setShowBackText] = useState<boolean>(false);

  const handleCardClick = (event: React.MouseEvent) => {
    if (!editable) {
      // Start the fade-out transition
      setIsFlipped(!isFlipped);

      // After a short delay, change the text
      setTimeout(() => {
        setShowBackText(!showBackText);
      }, 200); // Match the duration of half the flip transition
    }
  };

  const getIcon = useCallback(
    () =>
      editable ? (
        <IconCheck size={"0.75rem"} />
      ) : actionItemHovered ? (
        <IconEdit size={"0.75rem"} />
      ) : showBackText ? (
        <IconLock size={"0.75rem"} />
      ) : (
        <IconKey size={"0.75rem"} />
      ),
    [editable, actionItemHovered, showBackText]
  );

  const getTooltipLabel = useCallback(
    () =>
      editable
        ? showBackText
          ? "Edit Back"
          : "Edit Front"
        : actionItemHovered
        ? ""
        : showBackText
        ? "Back"
        : "Front",
    [actionItemHovered, editable, showBackText]
  );

  function handleSaveClick(event: React.MouseEvent): void {
    event.stopPropagation();
    onSubmitCallback(frontContent, backContent, index);
    setEditable(false);
  }

  function handleEditClick(event: React.MouseEvent): void {
    event.stopPropagation();
    setEditable(true);
  }

  function handleDeleteClick(event: React.MouseEvent): void {
    event.stopPropagation();
    onDeleteCallback(id);
  }

  return (
    <div onClick={handleCardClick} className="flashcard-container">
      <div className={`flashcard ${isFlipped ? "flipped" : ""}`}>
        <Card withBorder={true} shadow="sm" className="flashcard-front">
          <Badge
            variant="light"
            color={editable ? "gray" : thinkfolder_color}
            p={"xs"}
            pr={0}
            size="xs"
            radius="xs"
            fullWidth
            ref={actionButtonRef}
            onMouseEnter={() => setActionItemHovered(true)}
            onMouseLeave={() => setActionItemHovered(false)}
            onClick={editable ? handleSaveClick : handleEditClick}
            className={`flashcard-front-action-button ${
              editable ? "editable" : ""
            } `}
            leftSection={
              editable ? (
                <ActionIcon
                  variant="light"
                  color={"red"}
                  onClick={handleDeleteClick}
                >
                  {<IconTrash size={"0.75rem"} />}
                </ActionIcon>
              ) : null
            }
            rightSection={
              <ActionIcon
                variant={editable ? "light" : undefined}
                color={editable ? "blue" : thinkfolder_color}
              >
                {getIcon()}
              </ActionIcon>
            }
          >
            {getTooltipLabel()}
          </Badge>
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
          <Badge
            ref={actionButtonRef}
            onMouseEnter={() => setActionItemHovered(true)}
            onMouseLeave={() => setActionItemHovered(false)}
            onClick={editable ? handleSaveClick : handleEditClick}
            variant="light"
            p={"xs"}
            fullWidth
            radius="xs"
            size="xs"
            color={editable ? "gray" : thinkfolder_color}
            className={`flashcard-back-action-button ${
              editable ? "editable" : ""
            } `}
            leftSection={
              editable ? (
                <ActionIcon
                  variant="light"
                  color={"red"}
                  onClick={handleDeleteClick}
                >
                  {<IconTrash size={"0.75rem"} />}
                </ActionIcon>
              ) : null
            }
            rightSection={
              <ActionIcon
                variant={editable ? "light" : undefined}
                color={editable ? "blue" : thinkfolder_color}
              >
                {getIcon()}
              </ActionIcon>
            }
          >
            {getTooltipLabel()}
          </Badge>
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
