// Import node_modules
import express from 'express';

const app = express();

app.get('/', (request, response) => {
  response.send('Hello World!');
});

// Start the server
app.listen(5050, () => {
  console.log(`Server is running on port ${5050}`);
});
