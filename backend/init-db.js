const { initDB } = require('./src/config/db');
initDB().then(() => {
  console.log('Tables created successfully');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
