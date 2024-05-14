// import dependencies
import fs from 'fs';
import path from 'path';

// import local files
import logger from '../server/utils/logger.js';
import migrationList from '../server/migrations/index.js';
import { loadJSON } from '../shared/parseJson.js';

const config = loadJSON('../config.json');
const packageJson = loadJSON('../package.json');

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

    const configPath = path.join(process.cwd(), 'config.json');
    const newConfig = {
      ...config,
      version: packageJson.version,
    };

    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));

    logger.log('MIGRATION', 'Automatic migration complete', 'INFO', false);
  }
};

export default migrateDatabase;
