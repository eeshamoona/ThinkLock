import React, { useRef, RefObject, useEffect, useState } from "react";
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
  ActionIcon,
} from "@mantine/core";
import { IconFolder } from "@tabler/icons-react";
import { getAllThinkFolders } from "../../../services/thinkFolderAPICallerService";
import { ThinkFolder } from "../../../utils/models/thinkfolder.model";
import { addThinkSession } from "../../../services/thinkSessionAPICallerService";
import { showSuccessNotification } from "../../../utils/notifications";
import { showErrorNotification } from "../../../utils/notifications";
import ThinkFolderSelectItem from "../../Objects/ThinkFolder/ThinkFolderSelectItem";

interface AddThinkSessionModalProps {
  thinkFolderId?: string;
  thinkSessionDate?: Date;
  successCallback?: () => Promise<void>;
}
const AddThinkSessionModal = ({
  thinkFolderId,
  thinkSessionDate,
  successCallback,
}: AddThinkSessionModalProps) => {
  const newThinkSessionForm = useForm({
    initialValues: {
      title: "",
      location: "",
      date: thinkSessionDate || new Date(),
      start_time: "",
      end_time: "",
      thinkfolder_id: thinkFolderId || "",
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
    // Parse the date string into a Date object
    const dateObj = new Date(values.date);

    // Extract year, month, and day
    const year = dateObj.getUTCFullYear();
    const month = String(dateObj.getUTCMonth() + 1).padStart(2, "0"); // Months are 0-indexed in JavaScript
    const day = String(dateObj.getUTCDate()).padStart(2, "0");

    // Construct the desired formatted string with time set to 00:00:00.000Z
    const dateString = `${year}-${month}-${day}`;

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
      if (successCallback) await successCallback();
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
          data-autofocus
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
