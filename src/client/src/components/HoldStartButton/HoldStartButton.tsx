import React, { useState, useEffect } from "react";
import { Button, RingProgress, useMantineTheme } from "@mantine/core";
import "./holdStartButton.scss";
import { TbArrowRight } from "react-icons/tb";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";

interface HoldButtonProps {
  onSuccess: () => void;
  folderColor?: string;
}

/**
 * Hold Start Button component that displays a button that requires the user
 * to hold it for 3 seconds before it triggers the onSuccess callback
 * @param onSuccess - callback function to trigger when the user holds the button for 3 seconds
 * @returns
 */
const HoldStartButton = ({ onSuccess, folderColor }: HoldButtonProps) => {
  const [countdown, setCountdown] = useState(3);
  const [holding, setHolding] = useState(false);
  const theme = useMantineTheme();

  const colorName = hexToColorNameMap[folderColor || ""] || "blue";
  const thinkFolderColorExpanded =
    theme.colorScheme === "dark" && colorName === "dark"
      ? "#FFFFFF"
      : `${folderColor}`;

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (holding && countdown > 0) {
      timeout = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
    } else if (countdown === 0) {
      onSuccess();
      setCountdown(3);
      setHolding(false);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [countdown, holding, onSuccess]);

  function handleMouseDown(): void {
    setHolding(true);
  }

  function handleMouseUp(): void {
    if (countdown !== 0) {
      setCountdown(3);
    }
    setHolding(false);
  }

  return (
    <Button
      variant="subtle"
      mt={"auto"}
      mb={"0"}
      color={colorName}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      leftIcon={
        holding ? (
          <RingProgress
            size={33}
            thickness={10}
            className="ring-progress"
            sections={[
              {
                value: (4 - countdown) * 34,
                color: thinkFolderColorExpanded || "blue",
              },
              { value: 100 - (4 - countdown) * 34, color: "transparent" },
            ]}
          />
        ) : (
          <TbArrowRight size="1.5rem" />
        )
      }
    >
      {holding ? `Hold for ${countdown}` : "Enter Think Session"}
    </Button>
  );
};

export default HoldStartButton;
