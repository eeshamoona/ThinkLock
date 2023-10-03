import React, { useState } from "react";
import * as allIcons from "tabler-icons-react";
import "./iconSelector.scss";
import { Select } from "@mantine/core";
import IconType from "../../utils/constants/iconType.constant";

interface IconPickerProps {
  value: any;
  onChange: any;
  checked?: any;
  error?: any;
  onFocus?: any;
  onBlur?: any;
  color?: any;
}

const IconSelector = ({
  value,
  onChange,
  color,
  ...props
}: IconPickerProps) => {
  const [icon, setIcon] = useState(value || "");

  const onIconChange = (selectedIcon: string | null) => {
    if (!selectedIcon) return;
    setIcon(selectedIcon);
    onChange(selectedIcon);
  };

  const Icon = (allIcons as IconType)[icon];

  const availableIcons = Object.keys(allIcons);

  return (
    <div className="icon-selector-container">
      <Select
        id="iconSelector"
        onChange={(selectedIcon) => onIconChange(selectedIcon)}
        value={icon}
        label="Icon"
        required
        className="icon-selector"
        placeholder="Select an Icon"
        searchable
        nothingFound="No options"
        data={
          availableIcons.map((icon) => ({
            value: icon,
            label: icon,
          })) as any
        }
      />
      {Icon && <Icon className="icon-custom-styles" />}
    </div>
  );
};

export default IconSelector;
