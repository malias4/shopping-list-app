import { useContext, useState } from "react";
import { SLDetailContext } from "./SLDetailProvider";
import { UserContext } from "../Users/UserProvider";
import AddMemberForm from "./SLAddMember";
import Member from "./SLMember";
import { Box, Button } from "@mui/material";
import { useTranslation } from "react-i18next";

function MemberList() {
  const { data, handlerMap } = useContext(SLDetailContext);
  const { userMap, userList, loggedInUser } = useContext(UserContext);
  const { t } = useTranslation();
  const [show, setShow] = useState(false);

  if (!data || !data.ownerId) {
    return <div>Loading...</div>;
  }

  const isOwner = data.ownerId === loggedInUser;

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        width: "100%",
        position: "relative",
      }}
    >
      <AddMemberForm
        show={show}
        userList={userList}
        handlerMap={handlerMap}
        handleClose={() => setShow(false)}
      />
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {isOwner ? (
          <Button
            variant="contained"
            color="success"
            onClick={() => setShow(true)}
          >
            {t("memberActions.addMember")}
          </Button>
        ) : (
          <Button
            variant="contained"
            color="error"
            onClick={() => handlerMap.removeMember({ memberId: loggedInUser })}
          >
            {t("memberActions.leave")}
          </Button>
        )}
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        {data.memberIdList.map((memberId) => (
          <Member
            key={memberId}
            data={userMap[memberId]}
            handlerMap={handlerMap}
            isOwner={data.ownerId === memberId}
            showRemoveButton={isOwner}
            isSelf={loggedInUser === memberId}
          />
        ))}
      </Box>
    </Box>
  );
}

export default MemberList;
