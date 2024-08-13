const express = require('express');
const SplitFactory = require('@splitsoftware/splitio').SplitFactory;
const cors = require('cors');
const fs = require('fs');

const app = express();

app.use(cors());

const port = 3000;

const splitApiKey = fs.readFileSync('./splitApiKey.txt', 'utf8').trim();
console.log('key', splitApiKey);

// Initialize Split SDK
const factory = SplitFactory({
  core: {
    authorizationKey: splitApiKey
  },
  debug: false
});
const client = factory.client();

app.get('/destinations/:id', async (req, res) => {
  const id = req.params.id;

  try {
    // Get treatment result from Split
    const treatmentResult = await client.getTreatmentWithConfig(id, 'carousel');

    if (treatmentResult.treatment !== 'control' && treatmentResult.config) {
      const config = JSON.parse(treatmentResult.config);
      console.log('treatment', treatmentResult.treatment);
      //console.log('config', config);
      res.json(config);
    } else {
      res.status(404).json({ error: 'Treatment not found or no configuration available' });
    }
  } catch (error) {
    console.error('Error fetching treatment:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

client.on(client.Event.SDK_READY, () => {
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});

client.on(client.Event.SDK_READY_TIMED_OUT, () => {
  console.error('Split SDK timed out while initializing');
});

client.on(client.Event.SDK_UPDATE, () => {
  console.log('Split SDK has received an update');
});

