import { observer } from 'mobx-react-lite';
import { useContext, useEffect } from 'react';
import ContextStore from '../context';
import { createGetRequest } from '../services/axios';

const MonitorsLayout = ({ children }) => {
  const {
    globalStore: { setMonitors },
  } = useContext(ContextStore);

  const fetchMontiors = async () => {
    const query = await createGetRequest('/user/monitors');
    const data = query?.data || [];

    setMonitors(data);
  };

  useEffect(() => {
    fetchMontiors();
  }, []);

  return children;
};

export default observer(MonitorsLayout);
