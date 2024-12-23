import { useContext } from "react";
import { UserContext } from "../Users/UserProvider.js";
import { useNavigate, createSearchParams } from "react-router-dom";
import { Box, Typography, Button, Badge, Stack } from "@mui/material";
import { useTranslation } from "react-i18next";

function OverviewItem({ shoppingList, handleArchive, handleDelete }) {
  const { loggedInUser } = useContext(UserContext);
  const navigate = useNavigate();
  const { t } = useTranslation();

  const confirmDelete = (id) => {
    if (window.confirm(t("itemActions.deleteConfirmation"))) {
      handleDelete({ id });
    }
  };

  const handleNavigate = () => {
    navigate({
      pathname: "detail",
      search: createSearchParams({ id: shoppingList._id }).toString(),
    });
  };

  const unresolvedItems = (shoppingList.itemList || []).filter(
    (item) => !item.resolved
  );

  return (
    <Box
      sx={{
        border: "2px solid",
        borderColor: "divider",
        borderRadius: "10px",
        padding: "20px",
        margin: "10px 0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "background.paper",
        "&:hover": {
          backgroundColor: "action.hover",
        },
        cursor: "pointer",
      }}
      onClick={handleNavigate}
    >
      <Typography
        variant="h6"
        component="span"
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          width: "100%",
          marginBottom: 1,
        }}
      >
        {shoppingList.listName}
      </Typography>
      <Stack
        direction="row"
        spacing={2}
        sx={{
          marginTop: 1,
          justifyContent: "center",
          width: "100%",
          marginBottom: 2,
        }}
      >
        <Badge badgeContent={unresolvedItems.length} color="success" />
        <Badge
          badgeContent={shoppingList.itemList.length}
          color="error"
          sx={{ padding: "0 10px" }}
        />
      </Stack>
      {loggedInUser === shoppingList.ownerId && (
        <Box
          sx={{
            display: "flex",
            gap: 2,
            marginTop: 1,
            justifyContent: "center",
            width: "100%",
          }}
        >
          <Button
            variant="outlined"
            color="success"
            onClick={(e) => {
              e.stopPropagation();
              handleArchive({ id: shoppingList._id });
            }}
            sx={{ flex: 1 }}
          >
            {t("itemActions.archive")}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              confirmDelete(shoppingList._id);
            }}
            sx={{ flex: 1 }}
          >
            {t("itemActions.delete")}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default OverviewItem;
