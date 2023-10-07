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
import { hexToColorNameMap } from "../../utils/constants/hexCodeToColor.constant";

interface HeatmapProps {
  heatmapData: HeatmapData[];
  max: number;
  numOfShades?: number;
  thinkfolder_color: string;
}

/**
 * Heatmap component that displays the heatmap of hours spent on a thinkfolder per day
 * @param heatmapData - array of heatmap data
 * @param max - maximum number of hours spent on a thinkfolder
 * @param numOfShades - number of shades to generate
 * @param thinkfolder_color - color of the thinkfolder
 * @returns
 */
const Heatmap = ({
  heatmapData,
  max,
  numOfShades,
  thinkfolder_color,
}: HeatmapProps) => {
  const theme = useMantineTheme();
  const shadeNumber = numOfShades ?? 8;
  const colorName = hexToColorNameMap[thinkfolder_color];
  const expandedThinkFolderColor =
    theme.colorScheme === "dark" && colorName === "dark"
      ? "#FFFFFF"
      : `${thinkfolder_color}`;
  const backgroundrgba =
    theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.colors.gray[1];
  const shades = generateShades(
    expandedThinkFolderColor,
    shadeNumber,
    backgroundrgba
  );

  function getDaysInYear(year: number): Date[] {
    const date = new Date(year, 0, 1);
    const days: Date[] = [];
    while (date.getFullYear() === year) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    return days;
  }

  function getShade(hours: number): string {
    const index = Math.floor((hours / max) * (shadeNumber - 1));
    return shades[index];
  }

  const days = getDaysInYear(new Date().getFullYear());

  return (
    <Paper className="heatmap-container">
      <div className="heatmap">
        <div className="days">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div key={day} className="heatmap-day-label">
              {day}
            </div>
          ))}
        </div>

        <div className="heatmap-and-month-container">
          <div className="months">
            {Array.from({ length: 12 }, (_, i) => {
              const date = new Date(0);
              date.setUTCMonth(i + 1);
              return date.toLocaleString("default", { month: "short" });
            }).map((month) => (
              <div key={month} className="heatmap-month-label">
                {month}
              </div>
            ))}
          </div>

          <SimpleGrid
            cols={7}
            className="heatmap-grid"
            spacing={"0"}
            pl={"0.3rem"}
            w={"fit-content"}
          >
            {days.map((day, index) => {
              const formattedDate = day.toLocaleDateString("en-us", {
                weekday: "short",
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
        </div>
      </div>
      <Stack
        className="heatmap-legend"
        spacing={"0"}
        w={"fit-content"}
        mt="0.8rem"
      >
        {shades.map((shade, index) => {
          const startHours = Math.floor((index / shadeNumber) * max);
          const endHours = Math.floor(((index + 1) / shadeNumber) * max);
          const label =
            index === 0 ? `0 hours` : `${startHours} to ${endHours} hours`;
          return (
            <Tooltip key={index} label={`${label}`}>
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
