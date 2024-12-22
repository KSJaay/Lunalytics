import './style.scss';

// import dependencies
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

// import local files
import TextInput from '../ui/input';
import SetupDropdown from './dropdown';
import ProgressBar from '../ui/progress';
import SetupTypeForm from './type';
import SetupDatabaseForm from './database';
import RegisterChecklist from '../register/checklist';
import useSetupFormContext from '../../hooks/useSetup';
import setupValidators from '../../../shared/validators/setup';
import submitSetup from '../../handlers/setup';
import { FaChevronLeft } from '../icons';

const SetupForm = () => {
  const navigate = useNavigate();
  const {
    errors,
    inputs,
    page,
    handlePageChange,
    handleBack,
    handleInput,
    setErrors,
  } = useSetupFormContext();

  const changePage = async () => {
    if (page.next === 'complete') {
      try {
        await submitSetup(setErrors, 'advanced', inputs);

        return navigate('/');
      } catch (error) {
        if (error?.response?.data) {
          return setErrors(error?.response?.data);
        }

        console.log(error);

        return toast.error(
          'Error occurred while creating user and setting up configuration.'
        );
      }
    }

    handlePageChange(page.next);
  };

  return (
    <>
      {page.prev && (
        <div className="auth-setup-back-button" onClick={handleBack}>
          <FaChevronLeft />
          Back
        </div>
      )}

      <div className="auth-form-title">{page.title}</div>
      <div className="auth-form-subtitle">{page.subtitle}</div>

      {page.inputs &&
        page.inputs.map((input) => {
          const { type, id } = input;
          const validator = setupValidators[id];

          if (type === 'text' || type === 'password') {
            return (
              <TextInput
                {...input}
                key={id}
                error={errors[id]}
                onChange={handleInput}
                value={inputs[id] || ''}
                onBlur={(e) =>
                  validator(e.target.value, setErrors, inputs.password)
                }
              />
            );
          }

          if (type === 'checklist') {
            return (
              <RegisterChecklist
                key={'checklist'}
                password={inputs['password']}
              />
            );
          }

          if (type === 'dropdown') {
            return <SetupDropdown key={id} id={id} {...input} />;
          }
        })}

      {page.name === 'type' && <SetupTypeForm />}
      {page.name === 'database' && <SetupDatabaseForm />}

      {page.hideButton ? null : (
        <button className="auth-button" onClick={changePage}>
          {page.submit ? 'Register' : 'Continue'}
        </button>
      )}

      <div className="auth-form-subtitle">
        For any issues checkout our{' '}
        <a
          style={{ textDecoration: 'underline' }}
          target="_blank"
          rel="noreferrer"
          href="https://github.com/ksjaay/lunalytics"
        >
          Github
        </a>
      </div>

      <ProgressBar sections={6} progress={page.number} />
    </>
  );
};

SetupForm.displayName = 'SetupForm';
SetupForm.propTypes = {};

export default SetupForm;
