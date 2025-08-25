// import dependencies
import { useReducer } from 'react';

// import local files
import { createPostRequest } from '../services/axios';
import { incidentMessageValidator } from '../../shared/validators/incident';

const defaultInputs = { monitorIds: [], status: 'Investigating', message: '' };

const inputReducer = (state: any, action: { key: any; value: any }) => {
  return { ...state, [action.key]: action.value };
};

const useIncidentMessage = (userValues = defaultInputs, incidentId: string) => {
  const [values, dispatch] = useReducer(inputReducer, userValues);

  const handleSubmit = async (position?: number) => {
    const result = incidentMessageValidator(values);

    if (result) {
      throw new Error(result);
    }

    const path =
      typeof position !== 'undefined'
        ? '/api/incident/messages/update'
        : '/api/incident/messages/create';

    const response = await createPostRequest(path, {
      ...values,
      incidentId,
      position,
    });

    if (response.status !== 201 && response.status !== 200) {
      throw new Error(response.data.message);
    }

    return response.data;
  };

  return { values, dispatch, handleSubmit };
};

export default useIncidentMessage;
