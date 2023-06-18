import React from "react";
import "./header.scss";
import { LockAccess } from "tabler-icons-react";
import { Plus } from "tabler-icons-react";
import { Bell } from "tabler-icons-react";
import { Search } from "tabler-icons-react";
import {
  ActionIcon,
  UnstyledButton,
  Indicator,
  Avatar,
  Box,
} from "@mantine/core";
import { TextInput } from "@mantine/core";

const Header = () => {
  return (
    <div id="header-container">
      <UnstyledButton id="thinklock-header-logo">
        <LockAccess id="lock-icon" size={"2.5rem"} />
        <h1 id="think-lock-title">ThinkLock</h1>
      </UnstyledButton>

      <div id="header-right-container">
        <div id="search-bar-container">
          <TextInput
            placeholder="Search"
            id="search-bar"
            rightSection={
              <Box id="search-icon-background">
                <Search id="search-icon" color="gray" />
              </Box>
            }
          />
        </div>
        <div id="add-think-button-container">
          <ActionIcon id="add-think-button" size={"3rem"}>
            <Plus id="plus-icon" size={"2.5rem"} />
          </ActionIcon>
        </div>
        <div id="notification-button-container">
          <ActionIcon id="notification-button">
            <Indicator color="red" size={".75rem"}>
              <Bell id="bell-icon" size={"2.5rem"} />
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
