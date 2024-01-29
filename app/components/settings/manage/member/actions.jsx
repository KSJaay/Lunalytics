// import stylesheets
import './style.scss';
import './row.scss';

// import dependencies
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { observer } from 'mobx-react-lite';

// import icons
import FaTrash from '../../../icons/faTrash';
import MdEdit from '../../../icons/mdEdit';
import FaCheck from '../../../icons/faCheck';
import FaClose from '../../../icons/faClose';

// import local files
import MemberApproveModal from './modal/approve';
import MemberDeclineModal from './modal/decline';
import MemberDeleteModal from './modal/delete';
import MemberPermissionsModal from './modal/permissions';
import useContextStore from '../../../../context';
import { userPropType } from '../../../../utils/propTypes';

const MemberRowActions = ({ member = {}, canManage = false }) => {
  const classes = classNames({
    'member-row-icon-disabled': !canManage,
  });

  const {
    modalStore: { openModal, closeModal },
  } = useContextStore();

  if (!member.isVerified && canManage) {
    return (
      <>
        <div
          className={`member-row-body-icon-close ${classes}`}
          onClick={() => {
            if (canManage) {
              openModal(
                <MemberDeclineModal member={member} onClose={closeModal} />,
                false
              );
            }
            MemberDeclineModal;
          }}
        >
          <FaClose width={20} height={20} />
        </div>
        <div
          className={`member-row-body-icon-check ${classes}`}
          onClick={() => {
            if (canManage) {
              openModal(
                <MemberApproveModal member={member} onClose={closeModal} />,
                false
              );
            }
          }}
        >
          <FaCheck width={20} height={20} />
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
              <MemberPermissionsModal member={member} onClose={closeModal} />,
              false
            );
          }
        }}
      >
        <MdEdit width={20} height={20} />
      </div>
      <div
        className={`member-row-body-icon-trash ${classes}`}
        onClick={() => {
          if (canManage) {
            openModal(
              <MemberDeleteModal member={member} onClose={closeModal} />,
              false
            );
          }
        }}
      >
        <FaTrash width={20} height={20} />
      </div>
    </>
  );
};

MemberRowActions.displayName = 'MemberRowActions';

MemberRowActions.propTypes = {
  member: userPropType.isRequired,
  canManage: PropTypes.bool,
};

export default observer(MemberRowActions);
