import Icon from "@mdi/react";
import { mdiCrown } from "@mdi/js";

function Member({ data, handlerMap, isOwner, showRemoveButton, isSelf }) {
  return (
    <div className="member-item">
      <span className="member-name">{data.name}</span>
      <div className="member-actions">
        {isOwner ? (
          <Icon path={mdiCrown} size={1.3} className="crown-icon" />
        ) : null}
        {showRemoveButton && !isSelf ? (
          <button
            className="remove-buttons"
            onClick={() => handlerMap.removeMember({ memberId: data.id })}
          >
            Remove
          </button>
        ) : null}
      </div>
    </div>
  );
}

export default Member;
