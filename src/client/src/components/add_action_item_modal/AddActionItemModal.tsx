import React, { forwardRef, useEffect, useState } from "react";
import "./addActionItemModal.scss";
import { isNotEmpty, useForm } from "@mantine/form";
import {
  Button,
  ColorSwatch,
  Group,
  Select,
  SelectItem,
  Space,
  TextInput,
  Text,
  Textarea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { closeAllModals } from "@mantine/modals";
import { IconCalendar, IconFolder } from "@tabler/icons-react";
import { getAllThinkFolders } from "../../services/thinkFolderAPICallerService";
import { ThinkFolder } from "../../utils/models/thinkfolder.model";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";

interface ActionItemProps extends React.ComponentPropsWithoutRef<"div"> {
  color: string;
  label: string;
  description: string;
  value: string;
}

const ThinkFolderItem = forwardRef<HTMLDivElement, ActionItemProps>(
  ({ color, label, description, value, ...others }: ActionItemProps, ref) => (
    <div ref={ref} {...others}>
      <Group noWrap>
        <ColorSwatch color={color} />

        <div>
          <Text size="sm">{label}</Text>
          <Text size="xs" opacity={0.65}>
            {description}
          </Text>
        </div>
      </Group>
    </div>
  )
);

const AddActionItemModal = () => {
  const [thinkFolders, setThinkFolders] = useState<ThinkFolder[]>([]);

  const newActionItemForm = useForm({
    initialValues: {
      title: "",
      description: "",
      dueDate: new Date(),
      thinkfolderId: "",
      thinksessionId: "",
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
  });

  const getThinkFolderData = () => {
    const thinkFolderData = thinkFolders.map((folder) => {
      return {
        value: folder.id,
        label: folder.name,
        color: folder.color,
        description: folder.description,
      } as unknown as SelectItem;
    });
    return thinkFolderData;
  };

  return (
    <div id="add-action-item-modal-container">
      <form
        onSubmit={newActionItemForm.onSubmit((values) => {
          console.log(values);
        })}
      >
        <TextInput
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

        <Space h="xl" />

        <div className="modal-buttons-container">
          <div className="additional-buttons-container">
            <DatePickerInput
              valueFormat="MMM DD, YYYY"
              clearable
              label="Due Date"
              placeholder="Due Date"
              w={175}
              size="sm"
              icon={<IconCalendar />}
              {...newActionItemForm.getInputProps("dueDate")}
            />
            <Select
              placeholder="Think Folder"
              itemComponent={ThinkFolderItem}
              searchable
              withAsterisk
              label="Think Folder"
              nothingFound="No folders found"
              data={getThinkFolderData()}
              dropdownComponent="div"
              maxDropdownHeight={100}
              w={175}
              clearable
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
