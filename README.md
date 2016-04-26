# redux-action-logging

Redux testing utility middlware to log actions received by a store without mocking that store.

### Installation

`npm install redux-action-logging`

Add redux-action-logging to your middleware chain. You likely only want to do this in your test suite and not in production

```js
import { createStore, applyMiddleware } from "redux"
import reducer from "./reducer"

import {
  storeActionsMiddleware,
  storeActions
} from "redux-action-logging"

const middlewares = [storeActionsMiddleware]
store = applyMiddleware(...middlewares)(createStore)(reducer)
```

### Usage

```js
// Given these actions sent to your store:
store.dispatch({ type: FOO })
store.dispatch({ type: BAR })
store.dispatch({ type: BAZ, value: 10 })
store.dispatch((dispatch, getState) => dispatch({type: QUX }))

// These return true:
storeActions.has(FOO)
storeActions.has(FOO, BAR)
storeActions.has(BAZ, BAR)
storeActions.has({ type: BAZ, value: 10 })
storeActions.has(QUX)
storeActions.has(
  BAR,
  { type: BAZ, value: 10}
)

// These return false:
storeActions.has(XYZZY)
storeActions.has(FOO, XYZZY)
storeActions.has({ type: BAZ, value: 5 })
storeActions.has(
  BAR,
  { type: BAZ, value: 5}
)


storeActions.actions() // returns array of all actions received by your store
storeActions.clear()   // clears array
```

### License

MIT
