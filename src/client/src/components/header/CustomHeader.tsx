import React from "react";
import "./customHeader.scss";
import {
  IconSearch,
  IconLockAccess,
  IconBell,
  IconSun,
  IconMoonStars,
} from "@tabler/icons-react";
import {
  ActionIcon,
  UnstyledButton,
  Indicator,
  Avatar,
  Box,
  TextInput,
  useMantineTheme,
  useMantineColorScheme,
} from "@mantine/core";
import AddButton from "../AddButton/AddButton";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  changeTabCallback?: (tab: string) => void;
}

/**
 * Custom Header component that displays name of the app,
 * search bar, add button, notification button, and user profile button
 * @param changeTabCallback - callback function to change the tab
 * @returns
 */
const Header = ({ changeTabCallback }: HeaderProps) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <div id="header-container">
      <UnstyledButton id="thinklock-header-logo" onClick={() => navigate("/")}>
        <IconLockAccess id="lock-icon" size={"2.5rem"} />
        <h1 id="think-lock-title">ThinkLock</h1>
      </UnstyledButton>

      <div id="header-right-container">
        <TextInput
          placeholder="Search"
          id="search-bar"
          rightSection={
            <Box id="search-icon-background">
              <IconSearch id="search-icon" color="gray" />
            </Box>
          }
        />
        <AddButton changeTabCallback={changeTabCallback} />
        <ActionIcon
          id="notification-button"
          c={theme.colorScheme === "dark" ? "cream" : "slategray"}
        >
          <Indicator color="red" size={".75rem"}>
            <IconBell id="bell-icon" size={"1.5rem"} />
          </Indicator>
        </ActionIcon>
        <ActionIcon
          id="notification-button"
          c={theme.colorScheme === "dark" ? "white" : "blue"}
          onClick={() => toggleColorScheme()}
        >
          {dark ? (
            <IconSun size={"1.5rem"} />
          ) : (
            <IconMoonStars size={"1.5rem"} />
          )}
        </ActionIcon>
        <ActionIcon id="user-profile-button">
          <Avatar color="violet" id="user-profile">
            EM
          </Avatar>
        </ActionIcon>
      </div>
    </div>
  );
};

export default Header;
