import { Card, Textarea, ActionIcon, Group, Tooltip } from "@mantine/core";
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
}

const Flashcard = ({ front, back, id }: FlashcardProps) => {
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [editable, setEditable] = useState<boolean>(false);
  const [frontContent, setFrontContent] = useState<string>(front);
  const [backContent, setBackContent] = useState<string>(back);
  const [actionItemHovered, setActionItemHovered] = useState(false);
  const actionButtonRef = useRef(null);

  const handleCardClick = (event: React.MouseEvent) => {
    if (event.target !== actionButtonRef.current && !editable) {
      setIsFlipped(!isFlipped);
    }
  };

  function handleSaveClick(): void {
    setEditable(false);
  }

  function handleEditClick(): void {
    setEditable(true);
  }

  const getIcon = useCallback(
    () =>
      editable ? (
        <Tooltip label={isFlipped ? "Save Back" : "Save Front"}>
          <RiCheckboxLine size={"2rem"} />
        </Tooltip>
      ) : actionItemHovered ? (
        <RiEdit2Line size={"2rem"} />
      ) : isFlipped ? (
        <RiSendBackward size={"2rem"} />
      ) : (
        <RiBringForward size={"2rem"} />
      ),
    [editable, actionItemHovered, isFlipped]
  );

  return (
    <div onClick={handleCardClick} className="flashcard-container">
      <Card
        shadow="sm"
        className={`flashcard-card ${isFlipped ? "flipped" : ""}`}
      >
        <div className="flashcard-info">
          <Textarea
            value={isFlipped ? backContent : frontContent}
            onChange={(event) => {
              if (isFlipped) {
                setBackContent(event.currentTarget.value);
              } else {
                setFrontContent(event.currentTarget.value);
              }
            }}
            className="flashcard-textarea"
            disabled={!editable}
          />
        </div>
        <Group className="action-button-group">
          <ActionIcon
            onMouseEnter={() => setActionItemHovered(true)}
            onMouseLeave={() => setActionItemHovered(false)}
            onClick={editable ? handleSaveClick : handleEditClick}
            aria-label={editable ? "Save" : "Edit"}
            className="flashcard-action-button"
          >
            {getIcon()}
          </ActionIcon>
        </Group>
      </Card>
    </div>
  );
};

export default Flashcard;
