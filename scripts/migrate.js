const config = require('../config.json');
const logger = require('../server/utils/logger');
const migrationList = require('../server/migrations');

const migrateDatabase = async () => {
  const migrationListKeys = Object.keys(migrationList);

  if (migrationListKeys.length > 0) {
    const [version, patch] = config.version.split('.');

    const validMigrations = migrationListKeys.filter((migration) => {
      const [migrationVersion, migrationPatch] = migration.split('.');
      return (
        migrationVersion > version ||
        (migrationVersion === version && migrationPatch > patch)
      );
    });

    if (validMigrations.length > 0) {
      if (config.setupType !== 'automatic') {
        return logger.log(
          'MIGRATION',
          'Manual migration selected. Skipping migration...',
          'INFO',
          false
        );
      }

      logger.log('MIGRATION', 'Starting automatic migration...', 'INFO', false);

      for (const migration of validMigrations) {
        logger.log(
          'MIGRATION',
          `Running migration: ${migration}`,
          'INFO',
          false
        );
        await migrationList[migration]();
        logger.log(
          'MIGRATION',
          `Migration complete: ${migration}`,
          'INFO',
          false
        );
      }
    }
  }
};

module.exports = migrateDatabase;
