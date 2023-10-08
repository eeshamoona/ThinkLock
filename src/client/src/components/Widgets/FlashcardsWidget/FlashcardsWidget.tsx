import { Paper, SimpleGrid, useMantineTheme } from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import {
  getFlashcards,
  updateFlashcardsWidget,
} from "../../../services/widgetsAPICallerService";
import { FlashcardData } from "../../../utils/models/flashcard.model";
import Flashcard from "./Flashcard/Flashcard";
import "./flashcardsWidget.scss";

interface FlashcardsWidgetProps {
  id: number;
  thinkfolder_color: string;
}
const FlashcardsWidget = ({ id, thinkfolder_color }: FlashcardsWidgetProps) => {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>();
  const theme = useMantineTheme();

  const fetchFlashcards = useCallback(async () => {
    const res = await getFlashcards(id);
    setFlashcards(res);
  }, [id]);

  useEffect(() => {
    fetchFlashcards();
  }, [fetchFlashcards, id]);

  function onSubmit(front: string, back: string, index: number) {
    const flashcardToUpdate = flashcards![index];
    if (flashcardToUpdate) {
      const updatedFlashcards = [...flashcards!];
      updatedFlashcards[index] = { ...flashcardToUpdate, front, back };
      updateFlashcardsWidget(id, updatedFlashcards);
      fetchFlashcards();
    }
  }

  return (
    <Paper
      className="flashcards-widget-container"
      style={{
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[8]
            : theme.colors.gray[0],
      }}
    >
      <SimpleGrid
        className="flashcards-widget-grid"
        p={"1rem"}
        spacing="xs"
        cols={1}
      >
        {flashcards?.map((flashcard, index) => {
          return (
            <Flashcard
              key={index}
              front={flashcard.front}
              back={flashcard.back}
              id={flashcard.id}
              index={index}
              thinkfolder_color={thinkfolder_color}
              onSubmitCallback={onSubmit}
            />
          );
        })}
      </SimpleGrid>
    </Paper>
  );
};

export default FlashcardsWidget;
