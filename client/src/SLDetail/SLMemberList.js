import { useContext, useState } from "react";
import { SLDetailContext } from "./SLDetailProvider";
import { UserContext } from "../Users/UserProvider";
import AddMemberForm from "./SLAddMember";
import Member from "./SLMember";

function MemberList() {
  const { data, handlerMap } = useContext(SLDetailContext);
  const { userMap, userList, loggedInUser } = useContext(UserContext);
  const [show, setShow] = useState(false);

  const isOwner = data.owner === loggedInUser;

  return (
    <div className="member-list-container">
      <AddMemberForm
        show={show}
        data={data}
        userList={userList}
        handlerMap={handlerMap}
        handleClose={() => setShow(false)}
      />
      <div className="member-list-header">
        {isOwner ? (
          <button className="success-buttons" onClick={() => setShow(true)}>
            Add Member
          </button>
        ) : (
          <button
            className="remove-buttons"
            onClick={() => handlerMap.removeMember({ memberId: loggedInUser })}
          >
            Leave
          </button>
        )}
      </div>
      <div className="member-list">
        <div className="member-list-names">
          <Member
            memberId={data.owner}
            data={userMap[data.owner]}
            isOwner={true}
            handlerMap={handlerMap}
            showRemoveButton={false}
          />
          {data.memberList
            .filter((memberId) => memberId !== data.owner)
            .map((memberId) => (
              <Member
                key={memberId}
                memberId={memberId}
                data={userMap[memberId]}
                isOwner={false}
                handlerMap={handlerMap}
                isSelf={loggedInUser === memberId}
                showRemoveButton={loggedInUser === data.owner}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

export default MemberList;
