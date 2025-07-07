// import dependencies
import axios from 'axios';
import jsonata from 'jsonata';

// import local files
import logger from '../utils/logger.js';
import { isEmpty } from '../../shared/utils/object.js';
const createJsonQuery = (jsonKey, jsonOperator, expectedValue) => {
  if (!jsonKey || !jsonOperator || expectedValue === undefined) return false;

  const valueExpr = `$eval("${jsonKey}")`;
  const expectedExpr = expectedValue.startsWith('$')
    ? `$eval("${expectedValue}")`
    : JSON.stringify(expectedValue);

  switch (jsonOperator) {
    case '>':
    case '>=':
    case '<':
    case '<=':
      return `$number(${valueExpr}) ${jsonOperator} $number(${expectedExpr})`;
    case '!=':
      return `${valueExpr} != ${expectedExpr}`;
    case '==':
      return `${valueExpr} = ${expectedExpr}`;
    case 'contains':
      return `$contains(${valueExpr}, ${expectedExpr})`;
    case 'not_contains':
      return `!$contains(${valueExpr}, ${expectedExpr})`;
    default:
      return false;
  }
};

const jsonataCheck = async (data, jsonKey, jsonOperator, expectedValue) => {
  if (!data) return true;

  const query = createJsonQuery(jsonKey, jsonOperator, expectedValue);

  if (!query) return true;

  try {
    const expression = jsonata(query);
    const result = await expression.evaluate(data);

    if (result === undefined) {
      logger.error('JSON Query', {
        message: `Invalid JSON Query: ${query}`,
      });
    }

    return !result;
  } catch {
    return true;
  }
};

const jsonStatusCheck = async (monitor) => {
  const timeout = monitor.requestTimeout || 5;

  const options = {
    method: monitor.method,
    url: monitor.url,
    timeout: timeout * 1000,
    signal: AbortSignal.timeout(timeout * 1000),
  };

  if (!isEmpty(monitor.headers)) {
    options.headers = { ...monitor.headers };
  }

  if (!isEmpty(monitor.body)) {
    options.data = { ...monitor.body };
  }

  if (monitor.ignoreTls) {
    options.httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
  }

  const startTime = Date.now();

  try {
    const query = await axios.request(options);

    const latency = Date.now() - startTime;
    const status = query.status;
    const data = query.data;
    const jsonQuery = monitor.json_query?.[0];

    const isDown = await jsonataCheck(
      data,
      jsonQuery?.key,
      jsonQuery?.operator,
      jsonQuery?.value
    );

    return {
      monitorId: monitor.monitorId,
      status,
      latency,
      message: isDown ? 'JSON Query failed' : 'JSON Query successful',
      isDown,
    };
  } catch (error) {
    const endTime = Date.now();

    logger.error('JSON Query Status Check', {
      message: `Issue checking monitor ${monitor.monitorId}: ${error.message}`,
    });

    if (error.response) {
      const failedResponse = error.response;
      const latency = endTime - startTime;
      const status = failedResponse.status;
      const data = failedResponse.data;

      const jsonQuery = monitor.json_query?.[0];

      const isDown = await jsonStatusCheck(
        data,
        jsonQuery?.key,
        jsonQuery?.operator,
        jsonQuery?.value
      );

      return {
        monitorId: monitor.monitorId,
        status,
        latency,
        message: 'JSON Query failed',
        isDown,
      };
    }

    return {
      monitorId: monitor.monitorId,
      status: 0,
      latency: endTime - startTime,
      message: error.message,
      isDown: true,
    };
  }
};

export default jsonStatusCheck;
