import { Paper, SimpleGrid, useMantineTheme } from "@mantine/core";
import React, { useEffect, useState } from "react";
import { getFlashcards } from "../../../services/widgetsAPICallerService";
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

  useEffect(() => {
    const fetchFlashcards = async () => {
      const res = await getFlashcards(id);
      setFlashcards(res);
    };
    fetchFlashcards();
  }, [id]);

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
              thinkfolder_color={thinkfolder_color}
            />
          );
        })}
      </SimpleGrid>
    </Paper>
  );
};

export default FlashcardsWidget;
