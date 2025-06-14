import { affectTextIds } from '../constants/incident.js';

const validStatus = ['Investigating', 'Identified', 'Monitoring', 'Resolved'];

const messagesValidator = (messages) => {
  if (!messages.length) {
    return;
  }

  let errorMessage;

  for (const index in messages) {
    const { message, status, createdAt, email } = messages[index] || {};

    if (!message) {
      errorMessage = 'Please eneter a message';
      break;
    }

    if (!validStatus.includes(status)) {
      errorMessage = 'Please select a status for the message';
      break;
    }

    if (!createdAt) {
      errorMessage = 'Please select a date for the message';
      break;
    }

    if (!email) {
      errorMessage = 'Please select an email for the message';
      break;
    }
  }

  if (errorMessage) {
    return errorMessage;
  }

  return false;
};

const IncidentValidator = ({
  title,
  affect,
  monitorIds,
  status,
  message,
  messages,
}) => {
  if (!title) {
    return 'Title is required';
  }

  if (title.length > 100) {
    return 'Title must be less than 100 characters';
  }

  if (!monitorIds?.length) {
    return 'Please select the affected monitors';
  }

  if (!validStatus.includes(status)) {
    return 'Please select a valid status for the incident';
  }

  if (!affectTextIds.includes(affect)) {
    return 'Please select a valid affect for the incident';
  }

  if (!messages.length && !message) {
    return 'Please provides a message for the incident';
  }

  const isMessagesInvalid = messagesValidator(messages);

  if (isMessagesInvalid) {
    return isMessagesInvalid;
  }

  return false;
};

export const incidentMessageValidator = ({ message, status, monitorIds }) => {
  if (!message) {
    return 'Please enter a message';
  }

  if (!validStatus.includes(status)) {
    return 'Please select a status for the message';
  }

  if (!monitorIds?.length) {
    return 'Please select the affected monitors';
  }

  return false;
};

export default IncidentValidator;
