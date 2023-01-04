import { main } from './index';

async function invoke() {
  const args = process.argv.slice(2);

  try {
    const res = await main(args[0]);
    if (res.message) {
      console.log(`Error: ${res.message}`);
    } else {
      console.log('Outages uploaded successfully');
    }
  } catch (error) {
    console.log('An error occurred');
  }
}

invoke();
