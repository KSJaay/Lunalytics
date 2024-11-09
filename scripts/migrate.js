// import dependencies
import fs from 'fs';
import path from 'path';

// import local files
import logger from '../server/utils/logger.js';
import migrationList from './migrations/index.js';
import { loadJSON } from '../shared/parseJson.js';

const config = loadJSON('../config.json');
const packageJson = loadJSON('../package.json');

const migrateDatabase = async () => {
  if (config.migrationType !== 'automatic') {
    return logger.info('MIGRATION', {
      message: 'Manual migration selected. Skipping migration checks...',
    });
  }

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
    logger.info('MIGRATION', { message: 'Starting automatic migration...' });

    for (const migration of validMigrations) {
      logger.info('MIGRATION', { message: `Running migration: ${migration}` });
      await migrationList[migration]();
      logger.info('MIGRATION', { message: `Migration complete: ${migration}` });
    }

    const configPath = path.join(process.cwd(), 'config.json');
    const newConfig = {
      ...config,
      version: packageJson.version,
    };

    fs.writeFileSync(configPath, JSON.stringify(newConfig, null, 2));

    logger.info('MIGRATION', { message: 'Automatic migration complete' });
  }
};

export default migrateDatabase;
