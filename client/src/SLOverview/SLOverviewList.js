import { useContext } from "react";
import { useSearchParams } from "react-router-dom";
import { OverviewContext } from "./SLOverviewProvider";
import OverviewItem from "./SLOverviewItem";
import { Box, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function OverviewList() {
  const { data, handlerMap } = useContext(OverviewContext);
  const [searchParams] = useSearchParams();
  const selectedId = searchParams.get("id");
  const { t } = useTranslation();

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: 2,
        justifyContent: "center",
        padding: 2,
        boxSizing: "border-box",
      }}
    >
      {!data || data.length === 0 ? (
        <Typography variant="h6" sx={{ textAlign: "center" }}>
          {t("overview.noLists")}
        </Typography>
      ) : (
        data.map((shoppingList) => (
          <Box key={shoppingList._id}>
            <OverviewItem
              shoppingList={shoppingList}
              handleArchive={handlerMap.handleArchive}
              handleDelete={handlerMap.handleDelete} // Ensure handleDelete is passed
            />
          </Box>
        ))
      )}
    </Box>
  );
}

export default OverviewList;
