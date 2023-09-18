import React from "react";
import "./addThinkFolderModal.scss";
import { isNotEmpty, useForm } from "@mantine/form";
import {
  Button,
  ColorPicker,
  ColorSwatch,
  CopyButton,
  Group,
  Space,
  TextInput,
  Textarea,
  Tooltip,
} from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import { addThinkFolder } from "../../services/thinkFolderAPICallerService";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";
import { IconCheck, IconCopy } from "@tabler/icons-react";
import IconSelector from "../icon_selector/IconSelector";
import { showErrorNotification } from "../../utils/notifications";
import { showSuccessNotification } from "../../utils/notifications";

const AddThinkFolderModal = () => {
  const newThinkFolderForm = useForm({
    initialValues: {
      name: "",
      description: "",
      color: "",
      icon: "",
    },

    validate: {
      name: isNotEmpty("Name"),
      icon: isNotEmpty("Icon"),
      color: isNotEmpty("Color"),
    },
  });
  return (
    <div id="add-think-folder-modal-container">
      <form
        onSubmit={newThinkFolderForm.onSubmit((values) => {
          addThinkFolder(values)
            .then((res) => {
              if (typeof res !== "string") {
                showSuccessNotification(
                  "Success",
                  `Think Folder Added ID: ${res}`
                );
                closeAllModals();
              } else {
                showErrorNotification("Failed", res);
              }
            })
            .catch((err) => {
              showErrorNotification("Failed", err);
            });
        })}
      >
        <TextInput
          withAsterisk
          label="Name"
          placeholder="Think Folder Name"
          {...newThinkFolderForm.getInputProps("name")}
        />
        <Space h="sm" />

        <Textarea
          label="Description"
          placeholder="Think Folder Description"
          {...newThinkFolderForm.getInputProps("description")}
        />
        <Space h={"sm"} />

        <IconSelector
          {...newThinkFolderForm.getInputProps("icon")}
          color={newThinkFolderForm.getInputProps("color").value || "gray"}
        />

        <Space h="sm" />
        <ColorPicker
          format="hex"
          withPicker={false}
          swatchesPerRow={Object.keys(hexToColorNameMap).length}
          fullWidth
          swatches={Object.keys(hexToColorNameMap)}
          {...newThinkFolderForm.getInputProps("color")}
        />
        <Space h={"sm"} />

        <div
          className={
            newThinkFolderForm.isValid("color")
              ? "color-swatch-selected"
              : "color-swatch-hidden"
          }
        >
          <CopyButton value={newThinkFolderForm.getInputProps("color").value}>
            {({ copied, copy }) => (
              <Tooltip
                label={copied ? "Copied" : "Copy"}
                withArrow
                position="right"
              >
                <Button
                  variant="light"
                  color={
                    hexToColorNameMap[
                      newThinkFolderForm.getInputProps("color").value
                    ]
                  }
                  radius="xl"
                  compact
                  onClick={copy}
                >
                  {copied ? (
                    <IconCheck size="1.25rem" />
                  ) : (
                    <IconCopy size="1.25rem" />
                  )}
                  <Space w="sm" />

                  <ColorSwatch
                    size={"1.25rem"}
                    color={newThinkFolderForm.getInputProps("color").value}
                  />
                  <Space w="sm" />
                  <p>{newThinkFolderForm.getInputProps("color").value}</p>
                  <Space w="sm" />
                  <p id="color-label">
                    {
                      hexToColorNameMap[
                        newThinkFolderForm.getInputProps("color").value
                      ]
                    }
                  </p>
                </Button>
              </Tooltip>
            )}
          </CopyButton>
        </div>
        <Group position="right" mt="md">
          <Button type="reset" variant="light" onClick={() => closeAllModals()}>
            Cancel
          </Button>
          <Button type="submit" disabled={!newThinkFolderForm.isValid()}>
            Create
          </Button>
        </Group>
      </form>
    </div>
  );
};

export default AddThinkFolderModal;
