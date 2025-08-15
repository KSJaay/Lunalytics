// import dependencies
import { useReducer } from 'react';

// import local files
import { createPostRequest } from '../services/axios';
import IncidentValidator from '../../shared/validators/incident';

const defaultInputs = {
  monitorIds: [],
  messages: [],
  affect: 'Outage',
  status: 'Investigating',
};

const inputReducer = (
  state: typeof defaultInputs,
  action: { key: any; value: any }
) => {
  return { ...state, [action.key]: action.value };
};

const useIncidentForm = (userValues = defaultInputs) => {
  const [values, dispatch] = useReducer(inputReducer, userValues);

  const handleSubmit = async () => {
    const result = IncidentValidator(values);

    if (result) {
      throw new Error(result);
    }

    const response = await createPostRequest('/api/incident/create', values);

    if (response.status !== 201 && response.status !== 200) {
      throw new Error(response.data.message);
    }

    return response.data;
  };

  return { values, dispatch, handleSubmit };
};

export default useIncidentForm;
