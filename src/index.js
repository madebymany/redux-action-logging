import every from "lodash/every"
import filter from "lodash/filter"
import find from "lodash/find"
import isEqual from "lodash/isEqual"
import isObject from "lodash/isObject"

let actions = []

const storeActionsMiddleware = store => next => action => {
  if (typeof action !== "function") {
    actions.push(action)
  }

  return next(action)
}

const has = (...args) => {
  return every(args, (arg) => {
    let result

    if (isObject(arg)) {
      const matches = filter(actions, (action) => {
        return action.type == arg.type
      })

      result = find(matches, (match) => isEqual(arg, match))

    } else {
      result = find(actions, (action) => {
        return action.type == arg
      })
    }

    return !!result
  })
}

const storeActions = { 
  has:     has,
  clear:   () => actions = [],
  actions: () => actions
}

export {
  storeActionsMiddleware,
  storeActions
}
