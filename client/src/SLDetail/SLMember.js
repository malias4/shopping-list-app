import Icon from "@mdi/react";
import { mdiCrown, mdiDeleteOutline } from "@mdi/js";
import { Box, Typography, Button } from "@mui/material";

function Member({ data, handlerMap, isOwner, showRemoveButton, isSelf }) {
  if (!data) {
    return null;
  }

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        marginBottom: "5px",
      }}
    >
      <Typography variant="body1" sx={{ marginTop: "5px" }}>
        {data.name}
      </Typography>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}
      >
        {isOwner && (
          <Icon path={mdiCrown} size={1.3} style={{ color: "#daa700" }} />
        )}
        {showRemoveButton && !isSelf && (
          <Button
            variant="contained"
            color="error"
            onClick={() => handlerMap.removeMember({ memberId: data.id })}
            startIcon={<Icon path={mdiDeleteOutline} size={1} />}
          >
            Remove
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default Member;
