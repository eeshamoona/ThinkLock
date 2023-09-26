import React from "react";
import { HeatmapData } from "../../utils/models/heatmapdata.model";
import {
  Button,
  Paper,
  SimpleGrid,
  Stack,
  Tooltip,
  useMantineTheme,
} from "@mantine/core";
import generateShades from "../../utils/heatmapColors";
import "./heatmap.scss";

interface HeatmapProps {
  heatmapData: HeatmapData[];
  max: number;
  numOfShades?: number;
  thinkfolder_color: string;
}

const getDaysInYear = (year: number) => {
  const date = new Date(year, 0, 1);
  const days: Date[] = [];
  while (date.getFullYear() === year) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }
  return days;
};

const Heatmap = ({
  heatmapData,
  max,
  numOfShades,
  thinkfolder_color,
}: HeatmapProps) => {
  const theme = useMantineTheme();
  const shadeNumber = numOfShades ?? 8;
  const backgroundrgba =
    theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1];
  const shades = generateShades(thinkfolder_color, shadeNumber, backgroundrgba);

  const getShade = (hours: number) => {
    const index = Math.floor((hours / max) * (shadeNumber - 1));
    return shades[index];
  };

  const days = getDaysInYear(new Date().getFullYear());

  return (
    <Paper className="heatmap-container">
      <SimpleGrid
        cols={7}
        className="heatmap-grid"
        spacing={"0"}
        w={"fit-content"}
      >
        {days.map((day, index) => {
          const formattedDate = day.toLocaleDateString("en-us", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          const totalHours = heatmapData.find(
            (data) =>
              data.date.split("T")[0] === day.toISOString().split("T")[0]
          )?.total_hours;
          const shade = getShade(totalHours ?? 0);
          return (
            <Tooltip
              key={index}
              label={`${totalHours ?? 0} hours on ${formattedDate}`}
            >
              <Button
                key={index}
                variant="default"
                className="heatmap-cell"
                style={{ backgroundColor: shade }}
              ></Button>
            </Tooltip>
          );
        })}
      </SimpleGrid>

      <Stack className="heatmap-legend" spacing={"0"} w={"fit-content"}>
        {shades.map((shade, index) => {
          const startHours = Math.floor((index / 8) * max);
          const endHours = Math.floor(((index + 1) / 8) * max);
          const label =
            index === 0 ? `0 hours` : `${startHours} to ${endHours} hours`;
          return (
            <Tooltip key={index} label={`${shade} - ${label}`}>
              <div
                key={index}
                className="heatmap-legend-cell"
                style={{ backgroundColor: shade }}
              ></div>
            </Tooltip>
          );
        })}
      </Stack>
    </Paper>
  );
};

export default Heatmap;
