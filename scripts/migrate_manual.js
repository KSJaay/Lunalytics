import migrateDatabase from './migrate.js';

migrateDatabase()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
