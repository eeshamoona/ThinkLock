import React, {
  useRef,
  RefObject,
  forwardRef,
  useEffect,
  useState,
} from "react";
import "./addThinkSessionModal.scss";
import { isNotEmpty, useForm } from "@mantine/form";
import { closeAllModals } from "@mantine/modals";
import { DateInput, TimeInput } from "@mantine/dates";
import { IconClock } from "@tabler/icons-react";
import {
  Button,
  Group,
  Select,
  Space,
  TextInput,
  Text,
  ThemeIcon,
  ActionIcon,
} from "@mantine/core";
import { IconFolder } from "@tabler/icons-react";
import * as allIcons from "tabler-icons-react";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";
import { getAllThinkFolders } from "../../services/thinkFolderAPICallerService";
import { ThinkFolder } from "../../utils/models/thinkfolder.model";
import { addThinkSession } from "../../services/thinkSessionAPICallerService";
import { showSuccessNotification } from "../../utils/notifications";
import { showErrorNotification } from "../../utils/notifications";

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

const AddThinkSessionModal = () => {
  const newThinkSessionForm = useForm({
    initialValues: {
      title: "",
      location: "",
      date: new Date(),
      start_time: null,
      end_time: null,
      thinkfolder_id: "",
    },

    validate: {
      title: isNotEmpty("Title"),
      date: isNotEmpty("Date"),
      start_time: isNotEmpty("Start Time"),
      end_time: isNotEmpty("End Time"),
      thinkfolder_id: isNotEmpty("Think Folder"),
    },
  });
  const startRef: RefObject<HTMLInputElement> = useRef(null);
  const endRef: RefObject<HTMLInputElement> = useRef(null);
  const [thinkFolders, setThinkFolders] = useState<ThinkFolder[]>([]);

  useEffect(() => {
    getAllThinkFolders().then((res) => {
      if (typeof res !== "string") {
        setThinkFolders(res);
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

  const onSubmit = async (values: any) => {
    const dateString = values.date.toISOString().split("T")[0];
    const startTimeString = dateString + "T" + values.start_time + ":00";
    const endTimeString = dateString + "T" + values.end_time + ":00";

    const thinkSessionId = await addThinkSession({
      title: values.title,
      location: values.location,
      start_time: new Date(startTimeString),
      end_time: new Date(endTimeString),
      date: new Date(dateString),
      thinkfolder_id: parseInt(values.thinkfolder_id),
    });

    if (thinkSessionId !== null) {
      showSuccessNotification(
        "Success",
        `Think Session Created ID:${thinkSessionId as string} `
      );
      closeAllModals();
    } else {
      showErrorNotification("Error", "Action Item Creation Failed");
      console.log(values);
    }
  };

  return (
    <div id="add-think-session-modal-container">
      <form
        onSubmit={newThinkSessionForm.onSubmit(async (values) => {
          await onSubmit(values);
        })}
      >
        <TextInput
          withAsterisk
          label="Title"
          placeholder="Think Session Title"
          {...newThinkSessionForm.getInputProps("title")}
        />
        <Space h="sm" />
        <TextInput
          label="Location"
          placeholder="Think Session Location"
          {...newThinkSessionForm.getInputProps("location")}
        />
        <Space h="sm" />
        <DateInput
          withAsterisk
          label="Date"
          placeholder="Date"
          clearable
          {...newThinkSessionForm.getInputProps("date")}
        />
        <Space h="sm" />
        <Group>
          <TimeInput
            label="Start Time"
            withAsterisk
            ref={startRef}
            rightSection={
              <ActionIcon onClick={() => startRef.current?.showPicker()}>
                <IconClock size="1rem" stroke={1.5} />
              </ActionIcon>
            }
            {...newThinkSessionForm.getInputProps("start_time")}
          />
          <Text size={"xl"} className="time-separator">
            :
          </Text>
          <TimeInput
            withAsterisk
            label="End Time"
            ref={endRef}
            rightSection={
              <ActionIcon onClick={() => endRef.current?.showPicker()}>
                <IconClock size="1rem" stroke={1.5} />
              </ActionIcon>
            }
            {...newThinkSessionForm.getInputProps("end_time")}
          />
          <Space h="sm" />
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
            {...newThinkSessionForm.getInputProps("thinkfolder_id")}
          />
        </Group>
        <Group position="right" mt="md">
          <Button type="reset" variant="light" onClick={() => closeAllModals()}>
            Cancel
          </Button>
          <Button type="submit" disabled={!newThinkSessionForm.isValid()}>
            Create
          </Button>
        </Group>
      </form>
    </div>
  );
};

export default AddThinkSessionModal;
