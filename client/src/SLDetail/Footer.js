import React from "react";
import SLMemberList from "./SLMemberList";
import { Box } from "@mui/material";

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 2,
        borderTop: 2,
        borderColor: "divider",
        backgroundColor: "background.paper",
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <SLMemberList />
    </Box>
  );
}

export default Footer;
