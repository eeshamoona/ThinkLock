import React, { useState } from "react";
import "./appLayout.scss";
import PlanOverviewPage from "./pages/plan/PlanOverviewPage";
import { AppShell } from "@mantine/core";
import CustomHeader from "./components/header/CustomHeader";
import { Header } from "@mantine/core";
import { Tabs } from "@mantine/core";
import { IconChecklist, IconBulb, IconCheckbox } from "@tabler/icons-react";
import StudyOverviewPage from "./pages/study/StudyOverviewPage";

const AppLayout = () => {
  const [activeTab, setActiveTab] = useState<string | null>("plan");

  const changeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <AppShell
      className="app-shell"
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? "var(--mantine-color-dark-8)"
              : "var(--mantine-color-gray-0)",
        },
      })}
      header={
        <Header height={"4rem"} p={"xs"}>
          <CustomHeader changeTabCallback={changeTab} />
        </Header>
      }
    >
      <Tabs
        variant="pills"
        value={activeTab}
        keepMounted={false}
        h={"100%"}
        onTabChange={setActiveTab}
      >
        <Tabs.List grow id="tab-list">
          <Tabs.Tab
            value="plan"
            icon={<IconChecklist size="1.25rem" />}
            className="tab"
            fw={700}
            onClick={() => changeTab("plan")}
          >
            Plan
          </Tabs.Tab>
          <Tabs.Tab
            value="study"
            icon={<IconBulb size="1.25rem" />}
            className="tab"
            fw={700}
            onClick={() => changeTab("study")}
          >
            Study
          </Tabs.Tab>
          <Tabs.Tab
            value="review"
            icon={<IconCheckbox size="1.25rem" />}
            className="tab"
            fw={700}
            onClick={() => changeTab("review")}
          >
            Review
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="plan" pt="md">
          <PlanOverviewPage />
        </Tabs.Panel>

        <Tabs.Panel value="study" pt="md">
          <StudyOverviewPage />
        </Tabs.Panel>

        <Tabs.Panel value="review" pt="md">
          Review tab content
        </Tabs.Panel>
      </Tabs>
    </AppShell>
  );
};

export default AppLayout;
