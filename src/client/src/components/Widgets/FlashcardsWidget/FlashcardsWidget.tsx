import { Paper, SimpleGrid, useMantineTheme } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { getFlashcards } from "../../../services/widgetsAPICallerService";
import { FlashcardData } from "../../../utils/models/flashcard.model";
import Flashcard from "./Flashcard/Flashcard";
import "./flashcardsWidget.scss";

interface FlashcardsWidgetProps {
  id: number;
}
const FlashcardsWidget = ({ id }: FlashcardsWidgetProps) => {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>();
  const theme = useMantineTheme();

  useEffect(() => {
    const fetchFlashcards = async () => {
      const res = await getFlashcards(id);
      setFlashcards(res);
    };
    fetchFlashcards();
  });

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
        cols={2}
        p={"1rem"}
        breakpoints={[
          { maxWidth: "sm", cols: 1 },
          { maxWidth: "md", cols: 2 },
          { maxWidth: "xl", cols: 2 },
        ]}
      >
        {flashcards?.map((flashcard, index) => {
          return (
            <Flashcard
              key={index}
              front={flashcard.front}
              back={flashcard.back}
              id={flashcard.id}
            />
          );
        })}
      </SimpleGrid>
    </Paper>
  );
};

export default FlashcardsWidget;
