import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import CreateShoppingListForm from "./SLAddShoppingList.js";
import { Box, Button, Typography } from "@mui/material";
import { OverviewContext } from "./SLOverviewProvider.js";

function Toolbar() {
  const { handlerMap, showArchived, setShowArchived } =
    useContext(OverviewContext);
  const [show, setShow] = useState(false);
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 2,
        borderBottom: 2,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="contained"
          color="success"
          onClick={() => setShow(true)}
        >
          {t("overview.create")}
        </Button>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" component="span" sx={{ fontWeight: "bold" }}>
          {t("overview.yourLists")}
        </Typography>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setShowArchived((current) => !current)}
        >
          {showArchived ? t("overview.showActive") : t("overview.showArchived")}
        </Button>
      </Box>
      <CreateShoppingListForm
        show={show}
        handleClose={() => setShow(false)}
        handlerMap={{ handleCreate: handlerMap.handleCreate }}
      />
    </Box>
  );
}

export default Toolbar;
