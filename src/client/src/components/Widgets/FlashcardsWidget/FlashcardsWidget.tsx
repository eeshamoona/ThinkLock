import {
  Accordion,
  Button,
  Group,
  Paper,
  Textarea,
  useMantineTheme,
} from "@mantine/core";
import React, { useCallback, useEffect, useState } from "react";
import {
  getFlashcards,
  updateFlashcardsWidget,
} from "../../../services/widgetsAPICallerService";
import { FlashcardData } from "../../../utils/models/flashcard.model";
import Flashcard from "./Flashcard/Flashcard";
import { IconPlus } from "@tabler/icons-react";
import "./flashcardsWidget.scss";
import { useForm } from "@mantine/form";

interface FlashcardsWidgetProps {
  id: number;
  thinkfolder_color: string;
}
const FlashcardsWidget = ({ id, thinkfolder_color }: FlashcardsWidgetProps) => {
  const [flashcards, setFlashcards] = useState<FlashcardData[]>();
  const theme = useMantineTheme();

  const createFlashcard = useForm({
    initialValues: {
      back: "",
      front: "",
    },
  });

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

  function onDelete(flashcardID: number) {
    const index = flashcards!.findIndex(
      (flashcard) => flashcard.id === flashcardID
    );
    if (index !== -1) {
      const updatedFlashcards = [...flashcards!];
      updatedFlashcards.splice(index, 1);
      updateFlashcardsWidget(id, updatedFlashcards);
      fetchFlashcards();
    }
  }

  function addFlashcard(front: string, back: string) {
    const updatedFlashcards = [...flashcards!];
    updatedFlashcards.push({ front, back, id: updatedFlashcards.length });
    updateFlashcardsWidget(id, updatedFlashcards);
    fetchFlashcards();
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
      <div className="flashcards-widget-grid">
        {flashcards?.map((flashcard, index) => {
          return (
            <div key={index} className="flashcard-widget-flashcard-container">
              <Flashcard
                front={flashcard.front}
                back={flashcard.back}
                id={flashcard.id}
                index={index}
                thinkfolder_color={thinkfolder_color}
                onSubmitCallback={onSubmit}
                onDeleteCallback={onDelete}
              />
            </div>
          );
        })}
      </div>
      <Accordion
        radius={"xs"}
        variant="default"
        className="flashcards-widget-accordion"
        chevron={<IconPlus size="1rem" />}
        styles={{
          chevron: {
            "&[data-rotate]": {
              transition: "transform 500ms ease",
              transform: "rotate(45deg)",
            },
          },
        }}
      >
        <Accordion.Item value="add">
          <Accordion.Control
            p={"0.5rem 1rem"}
            style={{
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            }}
          >
            Add Flashcard
          </Accordion.Control>
          <Accordion.Panel p={0}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                addFlashcard(
                  createFlashcard.values.front,
                  createFlashcard.values.back
                );
                createFlashcard.reset();
              }}
              className="flashcard-create-form"
            >
              <div className="flashcard-create-container">
                <Textarea
                  placeholder="Front of the flashcard..."
                  {...createFlashcard.getInputProps("front")}
                />

                <Textarea
                  placeholder="Back of the flashcard..."
                  {...createFlashcard.getInputProps("back")}
                />
              </div>

              <Group position="center">
                <Button
                  variant="outline"
                  color={theme.colorScheme === "dark" ? "gray" : "blue"}
                  style={{
                    color:
                      theme.colorScheme === "light"
                        ? theme.colors.dark[3]
                        : theme.colors.gray[6],

                    borderColor:
                      theme.colorScheme === "light"
                        ? theme.colors.gray[4]
                        : theme.colors.dark[4],
                  }}
                  fullWidth
                  mt={"0.5rem"}
                  leftIcon={<IconPlus size={"1rem"} />}
                  type="submit"
                >
                  Add Flashcard
                </Button>
              </Group>
            </form>
          </Accordion.Panel>
        </Accordion.Item>
      </Accordion>
    </Paper>
  );
};

export default FlashcardsWidget;
