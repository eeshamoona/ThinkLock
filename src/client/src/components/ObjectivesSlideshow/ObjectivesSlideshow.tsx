import React from "react";
import { Carousel } from "@mantine/carousel";
import { Paper, ThemeIcon, Progress, Text, ActionIcon } from "@mantine/core";
import { RiLightbulbFlashFill } from "react-icons/ri";
import { TbHexagonNumber2, TbHexagonNumber3 } from "react-icons/tb";
import "./objectivesSlideshow.scss";

interface ObjectiveSlideProps {
  title: string;
  subtitle: string;
  progress: number;
}

/**
 * Objective Slide component that displays the objective card with the title,
 * subtitle, and progress towards the next level in the objective
 * @param title - title of the objective
 * @param subtitle - subtitle of the objective
 * @param progress - progress towards the next level in the objective
 * @returns
 */
const ObjectiveSlide = ({ title, subtitle, progress }: ObjectiveSlideProps) => {
  return (
    <Paper radius="md" className={"objective-card"}>
      <ThemeIcon className={"objective-icon-container"} size={"2.5rem"}>
        <RiLightbulbFlashFill className="objective-icon" />
      </ThemeIcon>

      <Text ta="center" fw={700} className={"objective-title"}>
        {title}
      </Text>
      <Text ta="center" c="dimmed">
        {subtitle}
      </Text>
      <div className="progress-container">
        <ActionIcon>
          <TbHexagonNumber2 className="current-level-icon" />
        </ActionIcon>
        <Progress value={progress} className="progress" />
        <ActionIcon>
          <TbHexagonNumber3 className="next-level-icon" />
        </ActionIcon>
      </div>
    </Paper>
  );
};

/**
 * Objectives Slideshow component that displays the objectives slideshow
 * using the Objective Slide component
 * @param
 * @returns
 */

//TODO: Add objectives from the database
const ObjectivesSlideshow = () => {
  return (
    <Carousel
      slideSize="33.333333%"
      controlsOffset="0"
      controlSize={32}
      mb="1rem"
      loop
    >
      <Carousel.Slide className="objective-slide">
        <ObjectiveSlide
          title="Study Fairer"
          subtitle="Start 20 study sessions"
          progress={20}
        />
      </Carousel.Slide>
      <Carousel.Slide className="objective-slide">
        <ObjectiveSlide
          title="Action Avatar"
          subtitle="Complete 100 action items"
          progress={54.31}
        />
      </Carousel.Slide>
      <Carousel.Slide className="objective-slide">
        <ObjectiveSlide
          title="Flashcard Wizard"
          subtitle="Create 25 flashcards in total"
          progress={33}
        />
      </Carousel.Slide>
      <Carousel.Slide className="objective-slide">
        <ObjectiveSlide
          title="Night Owl"
          subtitle="Study 10 times after sunset"
          progress={0}
        />
      </Carousel.Slide>
      <Carousel.Slide className="objective-slide">
        <ObjectiveSlide
          title="Morning Dove"
          subtitle="Study 20 time before sunset"
          progress={50}
        />
      </Carousel.Slide>
    </Carousel>
  );
};

export default ObjectivesSlideshow;
