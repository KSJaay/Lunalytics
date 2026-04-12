// import stylesheets
import './style.scss';
import './row.scss';

// import type definitions
import type { ContextTeamProps } from '../../../../../shared/types/context/team';

// import dependencies
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';
import { FaTrashCan, MdEdit, FaCheck, IoMdClose } from '../../../icons';

// import local files
import MemberDeleteModal from '../../../modal/settings/manage/delete';
import MemberApproveModal from '../../../modal/settings/manage/approve';
import MemberDeclineModal from '../../../modal/settings/manage/decline';
import MemberPermissionsModal from '../../../modal/settings/manage/permissions';
import useModalContext from '../../../../context/modal';

const MemberRowActions = ({
  member = {} as ContextTeamProps,
  canManage = false,
}: {
  member?: ContextTeamProps;
  canManage: boolean;
}) => {
  const classes = classNames({
    'member-row-icon-disabled': !canManage,
  });

  const { openModal, closeModal } = useModalContext();

  if (!member.isVerified && canManage) {
    return (
      <>
        <div
          className={`member-row-body-icon-close ${classes}`}
          id={`decline-${member.displayName}`}
          onClick={() => {
            if (canManage) {
              openModal(
                <MemberDeclineModal member={member} onClose={closeModal} />
              );
            }
            MemberDeclineModal;
          }}
        >
          <IoMdClose style={{ width: '20px', height: '20px' }} />
        </div>
        <div
          className={`member-row-body-icon-check ${classes}`}
          id={`accept-${member.displayName}`}
          onClick={() => {
            if (canManage) {
              openModal(
                <MemberApproveModal member={member} onClose={closeModal} />
              );
            }
          }}
        >
          <FaCheck style={{ width: '20px', height: '20px' }} />
        </div>
      </>
    );
  }

  return (
    <>
      <div
        className={`member-row-body-icon-edit ${classes}`}
        onClick={() => {
          if (canManage) {
            openModal(
              <MemberPermissionsModal member={member} onClose={closeModal} />
            );
          }
        }}
      >
        <MdEdit style={{ width: '20px', height: '20px' }} />
      </div>
      <div
        id={`decline-${member.displayName}`}
        className={`member-row-body-icon-trash ${classes}`}
        onClick={() => {
          if (canManage) {
            openModal(
              <MemberDeleteModal member={member} onClose={closeModal} />
            );
          }
        }}
      >
        <FaTrashCan style={{ width: '20px', height: '20px' }} />
      </div>
    </>
  );
};

MemberRowActions.displayName = 'MemberRowActions';

export default observer(MemberRowActions);
