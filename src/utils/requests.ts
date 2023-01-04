enum HTTP {
  GET = 'GET',
  POST = 'POST',
}

type Options = {
  method: HTTP;
  headers: Headers;
  body?: string;
};

const MAX_RETRIES = 3;

export default class Request {
  async get(url: string, headers?: Headers) {
    const options = { method: HTTP.GET, headers };
    const res = await retry_fetch(url, options, MAX_RETRIES);
    return res.json();
  }

  async post(url: string, body: string, headers?: Headers) {
    const options = {
      method: HTTP.POST,
      headers,
      body: body,
    };
    const res = await retry_fetch(url, options, MAX_RETRIES);
    return res.json();
  }
}

/**
 * Recursively retry the the fetch request until MAX_RETRIES is reached
 */
function retry_fetch(
  url: string,
  options: Options,
  n: number
): Promise<Response> {
  return new Promise(function (resolve, reject) {
    fetch(url, options)
      .then(function (result) {
        resolve(result);
      })
      .catch(function (error) {
        if (n === 1) return reject(error);
        retry_fetch(url, options, n - 1)
          .then(resolve)
          .catch(reject);
      });
  });
}
