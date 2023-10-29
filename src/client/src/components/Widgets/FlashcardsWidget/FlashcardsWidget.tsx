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
  getAllFlashcardsByThinkSessionId,
  createFlashcardByThinkSessionId,
  deleteFlashcardById,
  updateFlashcardById,
} from "../../../services/flashcardsAPICallerService";
import { IconPlus } from "@tabler/icons-react";
import "./flashcardsWidget.scss";
import { useForm } from "@mantine/form";
import { v4 as uuidv4 } from "uuid";
import { showErrorNotification } from "../../../utils/notifications";
import { Flashcard } from "../../../utils/models/flashcard.model";
import FlashcardComponent from "./Flashcard/Flashcard";

interface FlashcardsWidgetProps {
  thinksession_id: number;
  thinkfolder_color: string;
}
const FlashcardsWidget = ({
  thinksession_id,
  thinkfolder_color,
}: FlashcardsWidgetProps) => {
  const [flashcards, setFlashcards] = useState<Flashcard[]>();
  const theme = useMantineTheme();

  const createFlashcard = useForm({
    initialValues: {
      back: "",
      front: "",
    },
  });

  function addFlashcard(front: string, back: string, index: number) {
    console.log("FlashcardsWidget onCreateSubmit");
    console.log(front);
    console.log(back);
    console.log(index);

    createFlashcardByThinkSessionId(thinksession_id, {
      front: front,
      back: back,
    })
      .then((response) => {
        console.log(response);
        // Update flashcards
      })
      .catch((error) => {
        showErrorNotification("Error", "Failed to create flashcard");
      });
  }

  function onDelete(index: number) {
    console.log("FlashcardsWidget onDelete");
    console.log(index);

    deleteFlashcardById(index)
      .then((response) => {
        console.log(response);
        // Update flashcards
      })
      .catch((error) => {
        showErrorNotification("Error", "Failed to delete flashcard");
      });
  }

  function getFlashcards() {
    getAllFlashcardsByThinkSessionId(thinksession_id)
      .then((response) => {
        console.log(response);
        setFlashcards(response as Flashcard[]);
      })
      .catch((error) => {
        showErrorNotification("Error", "Failed to get flashcards");
      });
  }

  useEffect(() => {
    getFlashcards();
  }, []);

  function updateFlashcardById() {
    console.log("FlashcardsWidget onUpdateSubmit");
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
            <div
              key={flashcard.id}
              className="flashcard-widget-flashcard-container"
            >
              <FlashcardComponent
                front={flashcard.front}
                back={flashcard.back}
                id={flashcard.id}
                index={index}
                thinkfolder_color={thinkfolder_color}
                onSubmitCallback={updateFlashcardById}
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
                  createFlashcard.values.back,
                  0
                );
                createFlashcard.reset();
              }}
              className="flashcard-create-form"
            >
              <div className="flashcard-create-container">
                <Textarea
                  w={"100%"}
                  placeholder="Front of the flashcard..."
                  {...createFlashcard.getInputProps("front")}
                />

                <Textarea
                  w={"100%"}
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
