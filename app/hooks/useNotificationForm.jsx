import { useReducer } from 'react';
import NotificationValidators from '../../shared/validators/notifications';
import { NotificationValidatorError } from '../../shared/utils/errors';
import { createPostRequest } from '../services/axios';

const defaultInputs = {
  platform: 'Discord',
  messageType: 'basic',
};

const inputReducer = (state, action) => {
  if (action.key === 'platform') {
    return { [action.key]: action.value, messageType: state.messageType };
  }

  return { ...state, [action.key]: action.value };
};

const errorReducer = (state, action) => {
  return { [action.key]: action.value };
};

const useNotificationForm = (values = defaultInputs, isEdit, closeModal) => {
  const [inputs, handleInput] = useReducer(inputReducer, values);
  const [errors, handleError] = useReducer(errorReducer, {});

  const handleSubmit = async (addNotification) => {
    try {
      const validator = NotificationValidators[inputs.platform];
      if (!validator) {
        throw new Error('Invalid platform');
      }

      const result = validator(inputs);

      const path = isEdit
        ? '/api/notifications/edit'
        : '/api/notifications/create';

      const response = await createPostRequest(path, isEdit ? inputs : result);

      if (response.status !== 201 && response.status !== 200) {
        throw new Error(response.data.message);
      }

      addNotification(response.data);
      closeModal();
    } catch (error) {
      if (error instanceof NotificationValidatorError) {
        handleError({ key: error.key, value: error.message });
        return;
      }

      handleError({
        key: 'general',
        value: 'Unknown error occured. Please try again.',
      });
    }
  };

  return { inputs, errors, handleInput, handleError, handleSubmit };
};

export default useNotificationForm;
