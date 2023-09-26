import React from "react";
import { HeatmapData } from "../../utils/models/heatmapdata.model";
import { Paper, SimpleGrid, Tooltip } from "@mantine/core";
import generateShades from "../../utils/heatmapColors";
import "./heatmap.scss";

interface HeatmapProps {
  heatmapData: HeatmapData[];
  max: number;
  thinkfolder_id: string;
  thinkfolder_color: string;
}

const Heatmap = ({
  heatmapData,
  max,
  thinkfolder_id,
  thinkfolder_color,
}: HeatmapProps) => {
  //get color scale given thinkfolder_color
  const shades = generateShades(thinkfolder_color, 8);
  function getShade(value: number) {
    switch (true) {
      case value <= max * 0.125:
        return shades[0];
      case value <= max * 0.25:
        return shades[1];
      case value <= max * 0.375:
        return shades[2];
      case value <= max * 0.5:
        return shades[3];
      case value <= max * 0.625:
        return shades[4];
      case value <= max * 0.75:
        return shades[5];
      case value <= max * 0.875:
        return shades[6];
      case value <= max:
        return shades[7];
      default:
        return shades[0];
    }
  }

  // render cells in a simple grid for the year (52 weeks x 7 days)

  //create function to get all the days in the year to loop through
  const getDaysInYear = (year: number) => {
    const date = new Date(year, 0, 1);
    const days: any[] = [];
    while (date.getFullYear() === year) {
      //only push if date is in the past
      if (date < new Date()) {
        days.push(new Date(date));
      }
      date.setDate(date.getDate() + 1);
    }

    // add count to days based on heatmapData
    heatmapData.forEach((data) => {
      const date = new Date(
        data.date.toString().replace(/-/g, "/").replace(/T.+/, "")
      );
      const index = days.findIndex(
        (day) => day.toISOString() === date.toISOString()
      );
      console.log(index);
      days[index]["total_hours"] = data.total_hours;
    });
    return days;
  };

  return (
    <Paper className="heatmap-container">
      <SimpleGrid
        cols={7}
        className="heatmap-grid"
        spacing={"0"}
        w={"fit-content"}
      >
        {getDaysInYear(new Date().getFullYear()).map((data, index) => {
          const formattedDate = new Date(data).toLocaleDateString("en-us", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
          });
          return (
            <Tooltip
              label={`${data.total_hours ?? 0} hours on ${formattedDate}`}
            >
              <div
                key={index}
                className="heatmap-cell"
                style={{
                  backgroundColor: `${getShade(data.total_hours)}`,
                }}
              ></div>
            </Tooltip>
          );
        })}
      </SimpleGrid>
    </Paper>
  );
};

export default Heatmap;
