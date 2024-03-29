import { forwardRef } from "react";
import * as allIcons from "tabler-icons-react";
import { hexToColorNameMap } from "../../../utils/constants/hexCodeToColor.constant";
import IconType from "../../../utils/constants/iconType.constant";
import { ThemeIcon, Group, Text } from "@mantine/core";

interface ThinkFolderSelectItemProps
  extends React.ComponentPropsWithoutRef<"div"> {
  color: string;
  icon: string;
  label: string;
  description: string;
  value: string;
}

/**
 * Think Folder Select Item component that displays a think folder in the select dropdown
 * @param color - color of the think folder
 * @param icon - icon of the think folder
 * @param label - label of the think folder
 * @param description - description of the think folder
 * @param value - value of the think folder
 * @returns
 */
const ThinkFolderSelectItem = forwardRef<
  HTMLDivElement,
  ThinkFolderSelectItemProps
>(
  (
    {
      color,
      label,
      description,
      value,
      icon,
      ...others
    }: ThinkFolderSelectItemProps,
    ref
  ) => {
    const Icon = (allIcons as IconType)[icon];
    const colorString = hexToColorNameMap[color] || "gray";

    return (
      <div ref={ref} {...others}>
        <Group noWrap>
          <ThemeIcon color={colorString} size="lg" variant="light" radius="sm">
            {Icon && <Icon className="think-folder-icon" />}
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

export default ThinkFolderSelectItem;
