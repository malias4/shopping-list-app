import { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeContext } from "./ThemeContext";
import { UserContext } from "./Users/UserProvider.js";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import LanguageIcon from "@mui/icons-material/Language";

function Header({ handleShow }) {
  const { userMap, userList, loggedInUser, setLoggedInUser } =
    useContext(UserContext);
  const { mode, toggleTheme } = useContext(ThemeContext);
  const { t, i18n } = useTranslation();
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElLang, setAnchorElLang] = useState(null);
  const [selectedUserName, setSelectedUserName] = useState("");

  const lngs = {
    en: { nativeName: "English", shortName: "en" },
    cs: { nativeName: "Čeština", shortName: "cs" },
  };

  useEffect(() => {
    setSelectedUserName(userMap[loggedInUser]?.name || t("header.selectUser"));
  }, [loggedInUser, userMap, t]);

  const handleUserMenuOpen = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorElUser(null);
  };

  const handleUserSelect = (userId) => {
    setLoggedInUser(userId);
    setSelectedUserName(userMap[userId]?.name || t("header.selectUser"));
    handleUserMenuClose();
  };

  const handleLangMenuOpen = (event) => {
    setAnchorElLang(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setAnchorElLang(null);
  };

  const handleLangChange = (lng) => {
    i18n.changeLanguage(lng);
    handleLangMenuClose();
  };

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        padding: 2,
        borderBottom: 2,
        borderColor: "divider",
        backgroundColor: "background.paper",
        zIndex: 1000,
        alignItems: "center",
      }}
    >
      <Typography
        variant="h6"
        component={Link}
        to="/"
        sx={{
          display: "block",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textDecoration: "none",
          color: "inherit",
          fontWeight: "bold",
        }}
      >
        {t("header.appName")}
      </Typography>
      <Box sx={{ flexGrow: 1 }} />
      <IconButton onClick={toggleTheme} color="inherit">
        {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
      </IconButton>
      <IconButton
        aria-controls="lang-menu"
        aria-haspopup="true"
        onClick={handleLangMenuOpen}
        color="inherit"
      >
        <LanguageIcon />
      </IconButton>
      <Menu
        id="lang-menu"
        anchorEl={anchorElLang}
        open={Boolean(anchorElLang)}
        onClose={handleLangMenuClose}
      >
        {Object.keys(lngs).map((lng) => (
          <MenuItem
            key={lng}
            selected={i18n.resolvedLanguage === lng}
            onClick={() => handleLangChange(lng)}
          >
            {lngs[lng].nativeName}
          </MenuItem>
        ))}
      </Menu>
      <Button
        aria-controls="user-menu"
        aria-haspopup="true"
        onClick={handleUserMenuOpen}
        color="inherit"
      >
        {selectedUserName}
      </Button>
      <Menu
        id="user-menu"
        anchorEl={anchorElUser}
        open={Boolean(anchorElUser)}
        onClose={handleUserMenuClose}
      >
        {userList.map((user) => (
          <MenuItem
            key={user.id}
            selected={user.id === loggedInUser}
            onClick={() => handleUserSelect(user.id)}
          >
            {user.name}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
}

export default Header;
