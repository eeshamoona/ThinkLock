import { Card, Textarea, ActionIcon, Group, Badge } from "@mantine/core";
import React, { useCallback, useRef, useState } from "react";
import { IconKey, IconCheck, IconEdit, IconLock } from "@tabler/icons-react";
import "./flashcard.scss";

interface FlashcardProps {
  front: string;
  back: string;
  id: number;
  index: number;
  thinkfolder_color: string;
  onSubmitCallback: (front: string, back: string, index: number) => void;
}

const Flashcard = ({
  front,
  back,
  id,
  index,
  thinkfolder_color,
  onSubmitCallback,
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
      }, 300); // Match the duration of half the flip transition
    }
  };

  const getIcon = useCallback(
    () =>
      editable ? (
        <IconCheck size={"0.85rem"} />
      ) : actionItemHovered ? (
        <IconEdit size={"0.85rem"} />
      ) : showBackText ? (
        <IconLock size={"0.85rem"} />
      ) : (
        <IconKey size={"0.85rem"} />
      ),
    [editable, actionItemHovered, showBackText]
  );

  const getTooltipLabel = useCallback(
    () =>
      editable
        ? "Save"
        : actionItemHovered
        ? "Edit"
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
              size="sm"
              radius="xs"
              ref={actionButtonRef}
              onMouseEnter={() => setActionItemHovered(true)}
              onMouseLeave={() => setActionItemHovered(false)}
              onClick={editable ? handleSaveClick : handleEditClick}
              className={`flashcard-front-action-button `}
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
              size="sm"
              color={thinkfolder_color}
              className={`flashcard-back-action-button `}
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
