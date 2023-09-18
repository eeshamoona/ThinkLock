import React, { forwardRef, useEffect, useState } from "react";
import "./addActionItemModal.scss";
import { isNotEmpty, useForm } from "@mantine/form";
import {
  Button,
  Group,
  Select,
  SelectItem,
  Space,
  TextInput,
  Text,
  Textarea,
  ThemeIcon,
} from "@mantine/core";
import { closeAllModals } from "@mantine/modals";
import { IconFolder } from "@tabler/icons-react";
import { getAllThinkFolders } from "../../services/thinkFolderAPICallerService";
import { ThinkFolder } from "../../utils/models/thinkfolder.model";
import { addActionItem } from "../../services/actionItemAPICallerService";
import { showSuccessNotification } from "../../utils/notifications";
import { showErrorNotification } from "../../utils/notifications";
import * as allIcons from "tabler-icons-react";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";

interface ThinkFolderItemProps extends React.ComponentPropsWithoutRef<"div"> {
  color: string;
  icon: string;
  label: string;
  description: string;
  value: string;
}

type IconType = Record<
  string,
  React.FunctionComponent<React.SVGProps<SVGSVGElement>>
>;

const ThinkFolderItem = forwardRef<HTMLDivElement, ThinkFolderItemProps>(
  (
    { color, label, description, value, icon, ...others }: ThinkFolderItemProps,
    ref
  ) => {
    const Icon = (allIcons as IconType)[icon];
    const colorString = hexToColorNameMap[color] || "gray";

    return (
      <div ref={ref} {...others}>
        <Group noWrap>
          <ThemeIcon color={colorString} size="lg" variant="light" radius="sm">
            {Icon && <Icon className="think-folder-icon" color={color} />}
          </ThemeIcon>

          <div>
            <Text size="sm">{label}</Text>
            <Text size="xs" opacity={0.65}>
              {description}
            </Text>
          </div>
        </Group>
      </div>
    );
  }
);

const AddActionItemModal = () => {
  const [thinkFolders, setThinkFolders] = useState<ThinkFolder[]>([]);

  const newActionItemForm = useForm({
    initialValues: {
      title: "",
      description: "",
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
  }, []);

  const getThinkFolderData = () => {
    const thinkFolderData = thinkFolders.map((folder) => {
      return {
        value: folder.id,
        label: folder.name,
        color: folder.color,
        icon: folder.icon,
        description: folder.description,
      } as unknown as SelectItem;
    });
    return thinkFolderData;
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
            closeAllModals();
          } else {
            showErrorNotification("Error", "Action Item Creation Failed");
            console.log(values);
          }
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

        <Space h="lg" />

        <div className="modal-buttons-container">
          <div className="additional-buttons-container">
            <Select
              placeholder="Think Folder"
              itemComponent={ThinkFolderItem}
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
