import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { SLDetailContext } from "./SLDetailProvider";
import { UserContext } from "../Users/UserProvider";
import { Box, Button, Typography, useMediaQuery } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import UpdateName from "./SLNameEdit";

function Toolbar() {
  const { data, handlerMap, showResolved, toggleShowResolved } =
    useContext(SLDetailContext);
  const { loggedInUser } = useContext(UserContext);
  const { t } = useTranslation();
  const [show, setShow] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  if (!data) {
    return <div>Loading...</div>;
  }

  const itemCount = data.itemList.length;
  const unresolvedCount = data.itemList.filter((item) => !item.resolved).length;

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: "center",
          padding: 2,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: isMobile ? 2 : 0,
          }}
        >
          <Button
            variant="contained"
            color="success"
            onClick={() => handlerMap.addItem()}
          >
            {t("itemList.addItem")}
          </Button>
        </Box>
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: isMobile ? 2 : 0,
          }}
        >
          <Typography variant="h5" component="span" sx={{ fontWeight: "bold" }}>
            {data.listName}
          </Typography>
          {loggedInUser === data.ownerId && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShow(true)}
              sx={{ marginLeft: 2 }}
            >
              {t("itemList.edit")}
            </Button>
          )}
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
            color="success"
            onClick={toggleShowResolved}
          >
            {showResolved
              ? t("itemList.notResolvedOnly")
              : t("itemList.allItems")}
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "4px 8px",
          borderWidth: 2,
          borderStyle: "solid",
          borderColor: showResolved ? "transparent" : "green",
          borderImage: showResolved
            ? "linear-gradient(to right, green 50%, red 50%) 1"
            : "none",
          marginTop: 1,
          width: "fit-content",
          marginLeft: "auto",
          marginRight: "auto",
        }}
      >
        <Typography variant="body1">
          {itemCount === 0
            ? t("itemList.counter_zero")
            : itemCount === 1
            ? t("itemList.counter_one")
            : itemCount > 1 && itemCount < 5
            ? t("itemList.counter_few", { count: itemCount })
            : t("itemList.counter_other", { count: itemCount })}
        </Typography>
      </Box>
      <UpdateName
        show={show}
        handleClose={() => setShow(false)}
        data={data}
        handlerMap={handlerMap}
      />
    </>
  );
}

export default Toolbar;
