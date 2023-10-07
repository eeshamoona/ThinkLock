import { Card, Textarea, ActionIcon, Group } from "@mantine/core";
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
        <Card className="flashcard-front">
          <Group>
            <ActionIcon
              ref={actionButtonRef}
              onMouseEnter={() => setActionItemHovered(true)}
              onMouseLeave={() => setActionItemHovered(false)}
              onClick={editable ? handleSaveClick : handleEditClick}
              aria-label={editable ? "Save" : "Edit"}
              className="flashcard-front-action-button"
            >
              {getIcon()}
            </ActionIcon>
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
        <Card className="flashcard-back">
          <Group>
            <ActionIcon
              ref={actionButtonRef}
              onMouseEnter={() => setActionItemHovered(true)}
              onMouseLeave={() => setActionItemHovered(false)}
              onClick={editable ? handleSaveClick : handleEditClick}
              aria-label={editable ? "Save" : "Edit"}
              className="flashcard-back-action-button"
            >
              {getIcon()}
            </ActionIcon>
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
