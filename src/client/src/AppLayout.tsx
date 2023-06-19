import React, { useState } from "react";
import "./appLayout.scss";
import PlanOverviewPage from "./pages/plan/PlanOverviewPage";
import { AppShell } from "@mantine/core";
import Header from "./components/header/Header";
import { Tabs } from "@mantine/core";
import { IconChecklist, IconBulb, IconCheckbox } from "@tabler/icons-react";

const AppLayout = () => {
  const [activeTab, setActiveTab] = useState<string>("plan");

  const changeTab = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <AppShell
      padding="1.25rem"
      header={<Header changeTabCallback={changeTab} />}
    >
      <Tabs variant="pills" value={activeTab} radius={"md"} id="tab-container">
        <Tabs.List grow id="tab-list">
          <Tabs.Tab
            value="plan"
            icon={<IconChecklist size="1.25rem" />}
            className="tab"
          >
            Plan
          </Tabs.Tab>
          <Tabs.Tab
            value="study"
            icon={<IconBulb size="1.25rem" />}
            className="tab"
          >
            Study
          </Tabs.Tab>
          <Tabs.Tab
            value="review"
            icon={<IconCheckbox size="1.25rem" />}
            className="tab"
          >
            Review
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="plan" pt="md">
          <PlanOverviewPage />
        </Tabs.Panel>

        <Tabs.Panel value="study" pt="md">
          Study tab content
        </Tabs.Panel>

        <Tabs.Panel value="review" pt="md">
          Review tab content
        </Tabs.Panel>
      </Tabs>
    </AppShell>
  );
};

export default AppLayout;
