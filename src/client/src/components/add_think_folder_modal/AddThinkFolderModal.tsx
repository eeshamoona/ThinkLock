import React from "react";
import "./addThinkFolderModal.scss";
import { isNotEmpty, useForm } from "@mantine/form";
import {
  Button,
  ColorPicker,
  ColorSwatch,
  Group,
  TextInput,
  useMantineTheme,
} from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import { addThinkFolder } from "../../services/thinkFolderAPICallerService";

const AddThinkFolderModal = () => {
  const theme = useMantineTheme();
  const hexToColorNameMap: Record<string, string> = {
    "#FF0000": "Red",
    "#FFA500": "Orange",
    "#FFFF00": "Yellow",
    "#008000": "Green",
    "#0000FF": "Blue",
    "#4B0082": "Indigo",
    "#EE82EE": "Violet",
    "#000000": "Black",
    "#808080": "Gray",
  };

  const hexCodes = Object.keys(hexToColorNameMap);
  const newThinkFolderForm = useForm({
    initialValues: {
      name: "",
      description: "",
      color: "",
    },

    validate: {
      name: isNotEmpty("Name"),
      description: isNotEmpty("Description"),
      color: isNotEmpty("Color"),
    },
  });

  return (
    <div id="add-think-folder-modal-container">
      <form
        onSubmit={newThinkFolderForm.onSubmit((values) => {
          addThinkFolder(values);
          closeAllModals();
        })}
      >
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Think Folder Name"
          {...newThinkFolderForm.getInputProps("name")}
        />

        <TextInput
          withAsterisk
          label="Description"
          placeholder="Think Folder Description"
          {...newThinkFolderForm.getInputProps("description")}
        />

        <ColorPicker
          format="hex"
          size="md"
          withPicker={false}
          fullWidth
          swatches={Object.keys(hexToColorNameMap)}
          //   swatches={Object.keys(theme.colors).map(
          //     (color) => theme.colors[color][6]
          //   )}

          onColorSwatchClick={(color) =>
            newThinkFolderForm.setFieldValue("color", hexToColorNameMap[color])
          }
          {...newThinkFolderForm.getInputProps("color")}
        />
        <div
          className={
            newThinkFolderForm.isValid("color")
              ? "color-swatch-selected"
              : "color-swatch-hidden"
          }
        >
          <ColorSwatch
            color={newThinkFolderForm.getInputProps("color").value}
          />
          <p>{newThinkFolderForm.getInputProps("color").value}</p>
          <p>{"THE HEX CODE TO COPY?"}</p>
        </div>
        <Group position="right" mt="md">
          <Button type="reset" variant="light" onClick={() => closeAllModals()}>
            Cancel
          </Button>
          <Button type="submit">Create</Button>
        </Group>
      </form>
    </div>
  );
};

export default AddThinkFolderModal;
