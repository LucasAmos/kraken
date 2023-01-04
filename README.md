## Pre requisites

1. Requires node 18
2. Install using `yarn` command
3. Requires `ts-node` and `typescript` to be installed

## Running the application

Set the `BASE_URL` & `API_KEY` environment variables.

e.g.

`export API_KEY=abcdefghi`

`export BASE_URL=https://api.krakenflex.systems/interview-tests-mock-api/v1`

Run the command `ts-node src/main.ts norwich-pear-tree` or
`yarn build && node dist/src/main.js norwich-pear-tree`

## To run tests

`yarn test`

## Bonus Requirement

`retry_fetch` function will recursively retry any failed requests up to 3 times

## Caveats

I would ordinarily mock the `fetch` request itself e.g. [https://www.lucasamos.dev/articles/mocknodefetch](https://www.lucasamos.dev/articles/mocknodefetch) however this did not want to play well with the the experimental fetch API that is bundled with node 18 so I have mocked the `utils\requests.ts` client.

I would also add try/catch to the HTTP requests in `utils\requests.ts` to throw errors when non `200x` status codes are returned.
