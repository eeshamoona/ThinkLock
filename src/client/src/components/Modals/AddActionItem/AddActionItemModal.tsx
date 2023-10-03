import React, { useEffect, useState } from "react";
import "./addActionItemModal.scss";
import { isNotEmpty, useForm } from "@mantine/form";
import { Button, Select, Space, TextInput, Textarea } from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import { IconFolder } from "@tabler/icons-react";
import { getAllThinkFolders } from "../../../services/thinkFolderAPICallerService";
import { ThinkFolder } from "../../../utils/models/thinkfolder.model";
import { addActionItem } from "../../../services/actionItemAPICallerService";
import { showSuccessNotification } from "../../../utils/notifications";
import { showErrorNotification } from "../../../utils/notifications";
import ThinkFolderSelectItem from "../../Objects/ThinkFolder/ThinkFolderSelectItem";

interface AddActionItemModalProps {
  thinkSessionId?: string;
  thinkFolderId?: string;
  successCallback?: () => Promise<void>;
}

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

  const getThinkFolderData = () => {
    return thinkFolders.map(({ id, name, color, icon, description }) => ({
      value: id.toString(),
      label: name,
      color,
      icon,
      description,
    }));
  };

  return (
    <div id="add-action-item-modal-container">
      <form
        onSubmit={newActionItemForm.onSubmit(async (values) => {
          const actionItemId = await addActionItem({
            title: values.title,
            description: values.description,
            thinkfolder_id: parseInt(values.thinkfolderId),
            thinksession_id: parseInt(values.thinksessionId),
          });

          if (actionItemId !== null) {
            showSuccessNotification(
              "Success",
              `Action Item Created ID:${actionItemId as string} `
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
