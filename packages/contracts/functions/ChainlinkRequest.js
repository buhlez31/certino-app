const installationId = args[0];
const startTs = args[1];
const endTs = args[2];

// URL of our custom Aggregator API
const url = `https://api.treetino.eu/api/v1/generation/${installationId}?start=${startTs}&end=${endTs}`;

console.log(`Sending HTTP request to ${url}`);

const apiRequest = Functions.makeHttpRequest({
  url: url,
  method: "GET",
  timeout: 9000,
});

const apiResponse = await apiRequest;

if (apiResponse.error) {
  console.error(apiResponse.error);
  throw Error("Request failed");
}

const data = apiResponse.data;

if (!data || !data.Output || data.Output.kWh_produced === undefined) {
  throw Error("Unexpected API response structure");
}

// Extract the required values
const kwhProduced = Math.round(data.Output.kWh_produced * 100); // converting to integer (e.g. 4.25 -> 425)

console.log(`Data fetched successfully. kWh produced (x100): ${kwhProduced}`);

// Chainlink Functions requires the returned value to be encoded as a buffer
return Functions.encodeUint256(kwhProduced);
