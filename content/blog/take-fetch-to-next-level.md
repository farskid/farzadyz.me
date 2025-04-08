---
title: Supercharge native fetch with timout and cancelation
publishedAt: 19 Feb 2021
keywords: Javascript fetch timeout cancelation api_client
draft: true
---

`fetch` is a convenient promise-based web API that lets you communicate with other resources through the network.

Fetch is promise-based meaning that calling it as a function will return a promise to you. Fetch has an intuitive enough interface in that it's flexible and thought through but it's not designed to have some common features we need when dealing with API calls in a typical web application.

In a typical web application, there might be plenty of cases in which you'd want to cancel an already dispatched network request or probably you want to timeout a request after a certain time without having to wait for the request until it hits the browser timeout. Therefore you'll need to bake these additional functionalities into the `fetch`. Here is how you can do it:

## Add cancelation support

There is an experimental [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController) and [AbortSignal](https://developer.mozilla.org/en-US/docs/Web/API/AbortSignal) support in browsers that allows for signaling for canceling an action. If `AbortController` is used for controlling an action, you can get a signal from it, pass it to the action and later abort the controller resulting in canceling the action.

### Use `AbortController` to cancel requests sent by `fetch`

```js
const ctrl = new AbortController();
const fetchData = () =>
  fetch("https://example.com", {
    signal: ctrl.signal,
  });

// When you want to cancel it
ctrl.abort(); // This will also cancel the `fetchData` request
```

Quoting this from [MDN](https://developer.mozilla.org/en-US/docs/Web/API/AbortController):

> **Note**: When `abort()` is called, the `fetch()` promise rejects with a `DOMException` named `AbortError`.

For convenience purposes and to hide the details of how the cancelation is implemented _(Maybe you change the mechanics later)_, you could also create a factory to have access to both the request promise and canceling it without having to manage any extra variables.

```js
function createFetchRequest() {
  const ctrl = new AbortController();
  const { signal } = ctrl;
  return {
    request: (url) =>
      fetch(url, {
        signal,
      }),
    cancel() {
      ctrl.abort();
    },
  };
}
const fetcher = createFetchRequest();
// Send the request
fetcher.request("https://example.com");

// Cancel at any time
fetcher.cancel();
```

## Support custom timeouts

There are 2 ways to add timeout functionality to our `fetch` request example from above. One way is to use `Promise.race` and use a fake promise rejection after your desired timeout to reject the fetch request _(thanks to `Promise.race`)_ and another solution will be using a `setTimeout`. Let's see samples for both approaches.

### Using `Promise.race` to timeout `fetch` requests

```js
/*
@param {number} [seconds] - Duration after which the request will time out
*/
function timeout(seconds) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(Error("Timed Out"));
    }, seconds * 1000);
  });
}
function createFetchRequest(timeout = 10) {
  const ctrl = new AbortController();
  const { signal } = ctrl;
  return {
    request: (url) =>
      Promise.race([
        timeout(timeout),
        fetch(url, {
          signal,
        }),
      ]),
    cancel() {
      ctrl.abort();
    },
  };
}
```

Because of the way `Promise.race` works, if the fetch request takes longer than the defined timeout _(default: 10 seconds)_, the `timeoutSeconds` will kick in and reject the whole thing with a timeout error, resulting in rejecting the fetch promise too!

### Using `setTimeout` to add timeouts to `fetch`

Similar to the approach above but instead of delaying a promise rejection, we can reuse the same `AbortController`instance and signal for abortion.

```js
function createFetchRequest(timeoutSeconds = 10) {
  const ctrl = new AbortController();
  const { signal } = ctrl;
  let timer;
  return {
    request: (url) => {
      timer = setTimeout(() => {
        ctrl.abort();
      }, timeoutSeconds * 1000);
      return fetch(url, {
        signal,
      });
    },
    cancel() {
      ctrl.abort();
    },
  };
}
```

Now both approaches get the job done, but there is a catch with the 2nd approach:

> The `setTimeout` inside the `timer` variable needs to be cleared if the fetch request responds faster than the defined time!

Be careful with the callbacks passed to `setTimeout`. They will still be executed if their wrapping promise construct is settled.

To take a detour here and to just show you what I mean, look at the order of logs from the example below:

```js
new Promise(resolve => {
  setTimeout(() => {
    reject();
  }, 1000)
  setTimeout(() => {
    console.log('timeout ran!');
  }, 2000);
}).then(() => {
  console.log('promise resolved')
});

promise resolved
timeout ran!
```

The promise will resolve after 1 second and even though the promise is settled, the setTimeout callback will still run after 2 seconds and log `timeout ran!` to the console.

Getting back to our topic again, we didn't need to clean anything up with approach 1 in which we used `Promise.race` because in that example and inside `setTimeout`, we're only rejecting the promise. When fetch request comes faster than the configured timeout, `Promise.race` will be fulfilled so the rejection inside the timeout won't have any effects.

## Clean up the timer in case the fetch request responds faster than the configured timeout

Say you have sent a network request with timeout configured to 20 seconds and the request comes back in 8 seconds. What happens is that the promise returned from the fetch request will resolve but the timers with `setTimeout` are still registered and their callback will be executed when the time arrives! So we need to make sure we clean up the timers when the request is faster than the timeout.

```js
function createFetchRequest(timeoutSeconds = 10) {
  const ctrl = new AbortController();
  const { signal } = ctrl;
  let timer;
  return {
    request: (url) => {
      timer = setTimeout(() => {
        ctrl.abort();
      }, timeoutSeconds * 1000);
      return fetch(url, {
        signal,
      }).then((response) => {
        // clear to avoid abort to be called after the request came back successfully
        clearTimeout(timer);
        // return the response for the rest of the promise chain
        return response;
      });
    },
    cancel() {
      ctrl.abort();
    },
  };
}
```

So the fix is to clear the timeout when fetch comes back successfully and to make sure we return the response so that consequent `.then`s on the request method will have access to it.

## Error handling

There might be cases in which you'd like to handle timeouts or cancelation errors separately and stop them from being treated as an error. Maybe you have a global error handler that shows an alert and you don't want the users to be alerted when the request times out or is canceled on purpose.

To distinguish timeout and cancelation from other types of errors, we can write a small utility function to get the job done.

```js
function isTimedout(error) {
  return error.message === "Timed Out";
}

function isCanceled(error) {
  return error instanceof AbortError;
}
```

If you want to take it to the next level or if you're concerned about the pitfalls of checking against the error message (i18n, etc), you can create a custom error construct and reject an instance of it when timed out.

```js
// Extends the Error constructor
class TimeoutError extends Error {
  constructor(message) {
    this.message = message;
  }
}

// Use custom error in rejection
function timeout(seconds) {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(TimeoutError("Timed Out"));
    }, seconds * 1000);
  });
}

// Check agianst that custom error type
function isTimedout(error) {
  return error instanceof TimeoutError;
}
```

## Summary

We learned that being able to set custom timeouts to a request with `fetch` or being able to cancel it on demand could be useful in some cases in our development. Especially with mindful cancelation, you could save up significant resource costs from the users on a limited metered bandwidth or users on mobile devices, or any user that simply doesn't need the chunk of data you're requesting. I'm sure there plenty of modals out there that request for some data but still keep it alive even after the modal is closed immediately and I'm sure you can come up with even more examples like this that canceling a request will be useful.

To gather all the code we saw through the course of this post, here is a somewhat supercharged fetch that supports both timeouts and cancelation and also holds a few utilities to detect the special type of errors.

```js
/*
@param {number} [seconds] - Duration after which the request will time out
*/
class TimeoutError extends Error {
  constructor(message) {
    this.message = message;
  }
}
function timeout(seconds) {
  return new Promise((_, reject) => {
    setTimeout(() => {reject(TimeoutError('Timed Out'))}, seconds * 1000);
  })
}
// Common methods to put in the prototype object
const requestPrototype = {
  isTimedout(err) {
    return error instanceof TimeoutError;
  },
  isCanceled(err) {
    return error instanceof AbortError;
  }
}
function extends(proto, obj) {
  return Object.assign({}, proto, obj);
}
function Request(timeout = 10) {
  const ctrl = new AbortController();
  const {signal} = ctrl;
  return extends(requestPrototype, {
    request: (url) => Promise.race([
    timeout(timeout),
    fetch(url, {
      signal
    })
    ]),
    cancel() {
      ctrl.abort();
    }
  })
}


// create a fetcher with 20seconds timeout
const fetcher = Request(20);
// send the request
fetcher.request('https://example.com')
  .then(response => {})
  .catch(err => {
    if (fetcher.isTimedout(err)) {}
    if (fetcher.isCanceled(err)) {}
  })

// cancel it on demand
fetcher.cancel();
```
