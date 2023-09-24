import React, { useState, useEffect } from "react";
import { Button, RingProgress, useMantineTheme } from "@mantine/core";
import "./holdStartButton.scss";
import { TbArrowRight } from "react-icons/tb";
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";

interface HoldButtonProps {
  onSuccess: () => void;
  folderColor?: string;
}

const HoldStartButton: React.FC<HoldButtonProps> = ({
  onSuccess,
  folderColor,
}) => {
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

  const handleMouseDown = () => {
    setHolding(true);
  };

  const handleMouseUp = () => {
    if (countdown !== 0) {
      setCountdown(3);
    }
    setHolding(false);
  };

  return (
    <Button
      variant="subtle"
      mt={"0.5rem"}
      mb={"auto"}
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
