import React from "react";
import "./header.scss";
import { IconSearch } from "@tabler/icons-react";
import { IconLockAccess } from "@tabler/icons-react";
import { IconBell } from "@tabler/icons-react";
import {
  ActionIcon,
  UnstyledButton,
  Indicator,
  Avatar,
  Box,
} from "@mantine/core";
import { TextInput } from "@mantine/core";
import AddButton from "../add_button/AddButton";

//Add DarkMode Button here

interface HeaderProps {
  changeTabCallback: (tab: string) => void;
}

const Header = ({ changeTabCallback }: HeaderProps) => {
  return (
    <div id="header-container">
      <UnstyledButton id="thinklock-header-logo">
        <IconLockAccess id="lock-icon" size={"2.5rem"} />
        <h1 id="think-lock-title">ThinkLock</h1>
      </UnstyledButton>

      <div id="header-right-container">
        <div id="search-bar-container">
          <TextInput
            placeholder="Search"
            id="search-bar"
            rightSection={
              <Box id="search-icon-background">
                <IconSearch id="search-icon" color="gray" />
              </Box>
            }
          />
        </div>
        <div id="add-think-button-container">
          <AddButton changeTabCallback={changeTabCallback} />
        </div>
        <div id="notification-button-container">
          <ActionIcon id="notification-button">
            <Indicator color="red" size={".75rem"}>
              <IconBell id="bell-icon" size={"2rem"} />
            </Indicator>
          </ActionIcon>
        </div>
        <div id="user-profile-button-container">
          <ActionIcon id="user-profile-button">
            <Avatar color="violet" id="user-profile">
              EM
            </Avatar>
          </ActionIcon>
        </div>
      </div>
    </div>
  );
};

export default Header;
