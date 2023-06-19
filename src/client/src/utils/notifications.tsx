import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

export function showSuccessNotification(title: string, message: string) {
  notifications.show({
    title: title,
    message: message,
    icon: <IconCheck size="1.5rem" />,
    color: "teal",
  });
}

export function showErrorNotification(title: string, message: string) {
  notifications.show({
    title: title,
    message: message,
    icon: <IconX size="1.5rem" />,
    color: "red",
  });
}
