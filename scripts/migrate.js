const fs = require('fs');
const path = require('path');
const config = require('../config.json');
const logger = require('../server/utils/logger');
const migrationList = require('../server/migrations');
const package = require('../package.json');

const migrateDatabase = async () => {
  const migrationListKeys = Object.keys(migrationList);

  const [version, patch] = config.version.split('.');

  const validMigrations = migrationListKeys.filter((migration) => {
    const [migrationVersion, migrationPatch] = migration.split('.');
    return (
      migrationVersion > version ||
      (migrationVersion === version && migrationPatch > patch)
    );
  });

  if (validMigrations.length > 0) {
    if (config.migrationType !== 'automatic') {
      return logger.log(
        'MIGRATION',
        'Manual migration selected. Skipping migration...',
        'INFO',
        false
      );
    }

    logger.log('MIGRATION', 'Starting automatic migration...', 'INFO', false);

    for (const migration of validMigrations) {
      logger.log('MIGRATION', `Running migration: ${migration}`, 'INFO', false);
      await migrationList[migration]();
      logger.log(
        'MIGRATION',
        `Migration complete: ${migration}`,
        'INFO',
        false
      );
    }

    const configPath = path.join(__dirname, '..', 'config.json');
    const newConfig = {
      ...config,
      version: package.version,
    };

    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));

    logger.log('MIGRATION', 'Automatic migration complete', 'INFO', false);
  }
};

module.exports = migrateDatabase;
