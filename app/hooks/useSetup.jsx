// import dependencies
import { useContext, createContext, useState, useLayoutEffect } from 'react';
import { toast } from 'react-toastify';

// import local files
import { setupData, setupPages } from '../../shared/data/setup';
import setupValidators from '../../shared/validators/setup';

const SetupFormStateContext = createContext();
export const SetupFormStateProvider = SetupFormStateContext.Provider;
const useSetupFormContext = () => useContext(SetupFormStateContext);

export const useSetup = (
  defaultValues = {
    inputs: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
      databaseType: 'better-sqlite3',
      databaseName: 'lunalytics',
      websiteUrl: '',
      migrationType: 'automatic',
      retentionPeriod: '6m',
    },
    errors: {},
  }
) => {
  const [values, setValues] = useState(defaultValues);

  const [page, setPage] = useState(setupData[setupPages.EMAIL_FORM]);

  useLayoutEffect(() => {
    let url = `${window.location.protocol}//${window.location.hostname}`;

    if (window.location.port) {
      url += `:${window.location.port}`;
    }

    setValues((prev) => ({
      ...prev,
      inputs: { ...prev.inputs, websiteUrl: url },
    }));
  }, []);

  const handleInput = async (event) => {
    const { id, value } = event.target;

    return setValues((prev) => ({
      ...prev,
      inputs: { ...prev.inputs, [id]: value?.trim() },
    }));
  };

  const setErrors = (errors) => {
    return setValues((prev) => ({
      ...prev,
      errors: { ...prev.errors, ...errors },
    }));
  };

  const handlePageChange = async (pageName, preSumbit) => {
    if (preSumbit) {
      if (typeof preSumbit !== 'function') {
        throw new Error('preSumbit must be a function');
      }

      try {
        const isBasic = page.name === 'type' ? 'basic' : 'advanced';
        await preSumbit(isBasic, values.inputs);
      } catch (error) {
        if (error?.status === 400 && error?.response?.data) {
          return setErrors(error?.response?.data);
        }

        return toast.error(
          'Error while creating user and setting up configuration.'
        );
      }
    }

    let error = false;

    if (page.required) {
      for (let key of page.required) {
        const validator = setupValidators[key];
        const isInvalid = validator(
          values.inputs[key],
          setErrors,
          values.inputs.password
        );

        if (isInvalid) {
          error = true;
          break;
        }
      }
    }

    if (error) {
      return;
    }

    if (setupData[pageName]) {
      return setPage(setupData[pageName]);
    }
  };

  const handleBack = () => {
    return setPage(setupData[page.prev]);
  };

  return {
    errors: values.errors,
    inputs: values.inputs,
    page,
    handlePageChange,
    handleBack,
    handleInput,
    setErrors,
  };
};

export default useSetupFormContext;
