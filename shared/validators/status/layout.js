import {
  StatusCustomCSSSchema,
  StatusCustomHTMLSchema,
  StatusHeaderSchema,
  StatusHistorySchema,
  StatusIncidentsSchema,
  StatusMetricsSchema,
  StatusStatusSchema,
  StatusUptimeSchema,
} from '../../schema/status/index.js';
import { checkObjectAgainstSchema } from '../../utils/schema.js';

const validateStatusLayout = (layout = []) => {
  const filteredLayout = layout.map((item) => {
    delete item.isMinimized;
    return item;
  });

  filteredLayout.forEach((item) => {
    const { type } = item;

    if (type === 'header') {
      const value = checkObjectAgainstSchema(
        item,
        StatusHeaderSchema,
        'header'
      );
      return value;
    }

    if (type === 'status') {
      const value = checkObjectAgainstSchema(
        item,
        StatusStatusSchema,
        'status'
      );
      return value;
    }

    if (type === 'incidents') {
      const value = checkObjectAgainstSchema(
        item,
        StatusIncidentsSchema,
        'incidents'
      );
      return value;
    }

    if (type === 'uptime') {
      const value = checkObjectAgainstSchema(
        item,
        StatusUptimeSchema,
        'uptime'
      );
      return value;
    }

    if (type === 'metrics') {
      const value = checkObjectAgainstSchema(
        item,
        StatusMetricsSchema,
        'metrics'
      );
      return value;
    }

    if (type === 'history') {
      const value = checkObjectAgainstSchema(
        item,
        StatusHistorySchema,
        'history'
      );
      return value;
    }

    if (type === 'customHTML') {
      const value = checkObjectAgainstSchema(
        item,
        StatusCustomHTMLSchema,
        'customHTML'
      );
      return value;
    }

    if (type === 'customCSS') {
      const value = checkObjectAgainstSchema(
        item,
        StatusCustomCSSSchema,
        'customCSS'
      );
      return value;
    }

    throw new Error(`Invalid type: ${type}`);
  });

  return filteredLayout;
};

export default validateStatusLayout;
