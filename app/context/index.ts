// Global stores
import GlobalStore from './global';
import ModalStore from './modal';
import UserStore from './user';
import NotificationStore from './notifications';
import StatusStore from './status';
import IncidentStore from './incidents';

const store = {
  globalStore: new GlobalStore(),
  notificationStore: new NotificationStore(),
  modalStore: new ModalStore(),
  userStore: new UserStore(),
  statusStore: new StatusStore(),
  incidentStore: new IncidentStore(),
};

const useContextStore = () => store;

export default useContextStore;
