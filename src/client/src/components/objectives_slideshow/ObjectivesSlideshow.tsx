import React from "react";
import { Carousel } from "@mantine/carousel";
import { Paper, ThemeIcon, Progress, Text } from "@mantine/core";
import { IconSwimming } from "@tabler/icons-react";
import "./objectivesSlideshow.scss";

interface ObjectiveSlideProps {
  title: string;
  progress: number;
}

const ObjectiveSlide = ({ title, progress }: ObjectiveSlideProps) => {
  return (
    <Paper radius="md" withBorder className={"objective-card"}>
      <ThemeIcon className={"objective-icon"} size={"3rem"} radius={"3rem"}>
        <IconSwimming stroke={1.5} />
      </ThemeIcon>

      <Text ta="center" fw={700} className={"objective-title"}>
        {title}
      </Text>
      <Progress value={progress} mt="md" size="md" radius="lg" />
    </Paper>
  );
};

interface ObjectivesSlideshowProps {}

const ObjectivesSlideshow = (props: ObjectivesSlideshowProps) => {
  return (
    <Carousel
      height={200}
      slideSize="33.333333%"
      slideGap="sm"
      controlsOffset="0"
      controlSize={32}
      loop
    >
      <Carousel.Slide className="objective-slide">
        <ObjectiveSlide title="Challenge 1" progress={20} />
      </Carousel.Slide>
      <Carousel.Slide className="objective-slide">
        <ObjectiveSlide title="Challenge 2" progress={54.31} />
      </Carousel.Slide>
      <Carousel.Slide className="objective-slide">
        <ObjectiveSlide title="Challenge 3" progress={33} />
      </Carousel.Slide>
      <Carousel.Slide className="objective-slide">
        <ObjectiveSlide title="Challenge 4" progress={0} />
      </Carousel.Slide>
    </Carousel>
  );
};

export default ObjectivesSlideshow;
