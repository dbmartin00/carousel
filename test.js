const SplitFactory = require('@splitsoftware/splitio').SplitFactory;
const uuid = require('uuid');

// Initialize Split SDK
const factory = SplitFactory({
  core: {
    authorizationKey: '28bddhnjht06lvi8e5aa9rkmv5glsc40ltaa' // Replace with your Split.io API key
  },
  scheduler: { 
    impressionsRefreshRate: 1,
    eventsPushRate: 1
  },
  debug: true
});
const client = factory.client();

(async () => {
  try {
    await test();
  } catch (error) {
    console.error(error);
  }
})();

async function test() {
  await client.ready();
  for(let i = 0; i < 3000; i++) {
    await iteration();
  }
}

async function iteration() {
  const id = uuid.v4();
  
  const treatmentResult = await client.getTreatmentWithConfig(id, 'carousel');
  const config = JSON.parse(treatmentResult.config);
  const selected = config[getRandomNumber()];
  console.log('selected', selected);

  const properties = {
    destinationName: selected.name,
    destinationFare: parseInt(selected.fare)
  }
  console.log('properties', properties);
  const queued = client.track(id, 'user', 'impulse', properties.destinationFare, properties);
  console.log('sent to split? ' + queued);
}

function getRandomNumber() {
    const random = Math.random() * 100;
    const scaledRandom = Math.floor(random % 3);
    return scaledRandom;
}

// Example usage
const randomNumber = getRandomNumber();
console.log(randomNumber);

