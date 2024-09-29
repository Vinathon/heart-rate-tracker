
const express = require('express');
const app = express();
const config = require('./config/config');
const clinicalDataRoutes = require('./routes/routes');

// set the payload size limit as required
app.use(express.json({ limit: config.payloadSizeLimit })); 

// Use routes


app.use('/v1/clinical-data', clinicalDataRoutes);
app.listen(config.port, () => {
  console.log(`App listening on port ${config.port}`);
});
