import { useState, useEffect } from "react";
import { Box, Button, TextField } from "@mui/material";
import { useTranslation } from "react-i18next";

function Item({ data, handlerMap }) {
  const { t } = useTranslation();
  const [value, setValue] = useState(data.itemName || "");
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setValue(data.itemName || "");
  }, [data.itemName]);

  const handleBlur = () => {
    setIsFocused(false);
    handlerMap.updateItemName({ id: data.id, name: value });
  };

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleBlur();
    }
  };

  return (
    <Box
      sx={{
        border: "2px solid",
        borderColor: "divider",
        borderRadius: "10px",
        padding: "16px",
        margin: "8px 0",
        marginLeft: "10px",
        marginRight: "10px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "background.paper",
      }}
    >
      <Button
        variant="contained"
        color={data.resolved ? "error" : "success"}
        onClick={() => handlerMap.toggleResolveItem({ id: data.id })}
        sx={{ width: "80px" }}
      >
        {data.resolved ? t("item.uncheck") : t("item.check")}
      </Button>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          marginLeft: "16px",
          marginRight: "16px",
        }}
      >
        <TextField
          value={isFocused || value ? value : ""}
          placeholder={t("item.newItem")}
          onChange={(e) => setValue(e.target.value)}
          onBlur={handleBlur}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          variant="standard"
          sx={{ width: "100%" }}
          InputProps={{
            disableUnderline: true,
            sx: { textAlign: "center" },
            inputProps: { style: { textAlign: "center" } }, // Center the text content
          }}
        />
      </Box>
      <Button
        variant="contained"
        color="error"
        onClick={() => handlerMap.deleteItem({ id: data.id })}
        sx={{ width: "80px" }}
      >
        {t("item.remove")}
      </Button>
    </Box>
  );
}

export default Item;
