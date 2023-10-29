import React, { useEffect, useState } from "react";
import "./addActionItemModal.scss";
import { isNotEmpty, useForm } from "@mantine/form";
import { Button, Select, Space, TextInput, Textarea } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import { IconFolder } from "@tabler/icons-react";
import { getAllThinkFolders } from "../../../services/thinkFolderAPICallerService";
import { ThinkFolder } from "../../../utils/models/thinkfolder.model";
import { createActionItem } from "../../../services/actionItemAPICallerService";
import { showSuccessNotification } from "../../../utils/notifications";
import { showErrorNotification } from "../../../utils/notifications";
import ThinkFolderSelectItem from "../../Objects/ThinkFolder/ThinkFolderSelectItem";
import { FailureResponse } from "../../../utils/models/responses.model";
import { ActionItem } from "../../../utils/models/actionitem.model";

interface AddActionItemModalProps {
  thinkSessionId?: string;
  thinkFolderId?: string;
  successCallback?: () => Promise<void>;
}

/**
 * Add Action Item Modal component displays a modal to add an action item
 * Only the think folder id is required, but if the think session id is provided, thinkfolder will be disabled
 * OnSubmit, it calls the addActionItem API and closes the modal
 * @param thinkSessionId - id of the think session
 * @param thinkFolderId - id of the think folder
 * @param successCallback - callback function to trigger when the action item is created
 * @returns
 */
const AddActionItemModal = ({
  thinkSessionId,
  thinkFolderId,
  successCallback,
}: AddActionItemModalProps) => {
  const [thinkFolders, setThinkFolders] = useState<ThinkFolder[]>([]);

  const newActionItemForm = useForm({
    initialValues: {
      title: "",
      description: "",
      thinkfolderId: thinkFolderId || "",
      thinksessionId: thinkSessionId || "",
    },

    validate: {
      title: isNotEmpty("Title"),
      thinkfolderId: isNotEmpty("Think Folder ID"),
    },
  });

  useEffect(() => {
    getAllThinkFolders().then((res) => {
      if (typeof res !== "string") {
        setThinkFolders(res as ThinkFolder[]);
      }
    });
  }, []);

  function getThinkFolderData(): {
    value: string;
    label: string;
    color: string;
    icon: string;
    description: string;
  }[] {
    return thinkFolders.map(({ id, name, color, icon, description }) => ({
      value: (id as number).toString(),
      label: name,
      color,
      icon,
      description,
    }));
  }

  return (
    <div id="add-action-item-modal-container">
      <form
        onSubmit={newActionItemForm.onSubmit(async (values) => {
          const actionItem: FailureResponse | ActionItem =
            await createActionItem({
              title: values.title,
              description: values.description,
              thinkfolder_id: parseInt(values.thinkfolderId),
              thinksession_id: parseInt(values.thinksessionId),
            });

          if (typeof actionItem !== "string") {
            showSuccessNotification(
              "Action Item Created",
              `TODO: ${(actionItem as ActionItem).title}`
            );
            if (successCallback) await successCallback();
            closeAllModals();
          } else {
            showErrorNotification("Error", "Action Item Creation Failed");
            console.log(values);
          }
        })}
      >
        <TextInput
          data-autofocus
          withAsterisk
          width={"100%"}
          label="Title"
          placeholder="Action Item Title"
          {...newActionItemForm.getInputProps("title")}
        />
        <Space h="lg" />

        <Textarea
          label="Description"
          placeholder="Action Item Description"
          {...newActionItemForm.getInputProps("description")}
        />

        <Space h="lg" />

        <div className="modal-buttons-container">
          <div className="additional-buttons-container">
            <Select
              disabled={thinkSessionId !== undefined}
              placeholder="Think Folder"
              itemComponent={ThinkFolderSelectItem}
              searchable
              withAsterisk
              maxDropdownHeight={200}
              label="Think Folder"
              nothingFound="No folders found"
              data={getThinkFolderData()}
              dropdownComponent="div"
              clearable
              dropdownPosition="bottom"
              icon={<IconFolder />}
              {...newActionItemForm.getInputProps("thinkfolderId")}
            />
          </div>
          <div className="submit-buttons-container">
            <Button
              type="reset"
              variant="light"
              onClick={() => closeAllModals()}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={!newActionItemForm.isValid()}>
              Create
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default AddActionItemModal;
