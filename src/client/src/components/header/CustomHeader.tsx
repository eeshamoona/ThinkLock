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
import AddButton from "../add_button/AddButton";

interface HeaderProps {
  changeTabCallback: (tab: string) => void;
}

const Header = ({ changeTabCallback }: HeaderProps) => {
  const theme = useMantineTheme();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const dark = colorScheme === "dark";

  return (
    <div id="header-container">
      <UnstyledButton id="thinklock-header-logo">
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
