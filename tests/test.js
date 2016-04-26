import { expect } from "chai"
import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"

import {
  storeActionsMiddleware,
  storeActions
} from "../lib/index"

const initialState = {}
const reducer = (state = initialState, action) => state
const middlewares = [storeActionsMiddleware, thunk]

describe("Store Actions Middleware", () => {

  let store, dispatch

  const FOO = "FOO"
  const BAR = "BAR"
  const BAZ = "BAZ"

  beforeEach(() => {
    store = applyMiddleware(...middlewares)(createStore)(reducer)
    dispatch = store.dispatch
    storeActions.clear()
  })
  
  describe("Sending Types", () => {
    it("accepts one argument", () => {
      dispatch({ type: FOO })
      expect(storeActions.has(FOO)).to.equal(true)
    })

    it("accepts multiple arguments", () => {
      dispatch({ type: FOO })
      dispatch({ type: BAR })
      expect(storeActions.has(FOO, BAR)).to.equal(true)
    })

    it("accepts arguments in any order", () => {
      dispatch({ type: FOO })
      dispatch({ type: BAR })
      expect(storeActions.has(BAR, FOO)).to.equal(true)
    })

    it("every value must be true", () => {
      dispatch({ type: FOO })
      dispatch({ type: BAR })
      expect(storeActions.has(FOO, BAZ)).to.equal(false)
    })

    it("all false values returns false, not true", () => {
      dispatch({ type: FOO })
      expect(storeActions.has(BAR, BAZ)).to.equal(false)
    })
  })


  describe("Optional Value Comparison", () => {
    it("compares actions if passed an object", () => {
      dispatch({ type: FOO, value: 5 })

      expect(storeActions.has(
        { type: FOO, value: 5 }
      )).to.equal(true)
    })

    it("deeply compares actions if passed an object", () => {
      dispatch({ type: FOO, value: {
        a: {
          b: [{
            c: {
              d: 5
            }
          }]
        }
      }})

      expect(storeActions.has(
        { type: FOO, value: {
          a: {
            b: [{
              c: {
                d: 5
              }
            }]
          }
        }
      })).to.equal(true)
    })

    it("can compare multiple object actions of the same type", () => {
      dispatch({ type: FOO, value: 5 })
      dispatch({ type: FOO, value: 10 })

      expect(storeActions.has(
        { type: FOO, value: 10 },
        { type: FOO, value: 5 }
      )).to.equal(true)
    })

    it("can mix and match action types and objects", () => {
      dispatch({ type: FOO, value: 10 })
      dispatch({ type: BAR })

      expect(storeActions.has(
        { type: FOO, value: 10 },
        BAR
      )).to.equal(true)
    })
  })

  describe("Async middleware", () => {
    describe("Thunks", () => {
      it("logs actions", () => {
        const thunk = (dispatch, getState) => dispatch({ type: FOO })

        dispatch(thunk)
        expect(storeActions.has(FOO)).to.equal(true)
      })

      it("does not log a dispatched function as a separate action", () => {
        const thunk = (dispatch, getState) => { }

        dispatch(thunk)
        expect(storeActions.actions().length).to.equal(0)
      })

      it("does not log a wrapped function as a separate action", () => {
        const thunk = (foo) => {
          return (dispatch, getState) => {

          }
        }

        dispatch(thunk())
        expect(storeActions.actions().length).to.equal(0)
      })
    })
  })

  describe("Clearing", () => {
    it("erases all logged actions", () => {
      dispatch({ type: FOO, value: 5 })

      expect(storeActions.has(FOO)).to.equal(true)
      expect(storeActions.actions()).to.be.an('array')
      expect(storeActions.actions().length).to.equal(1)

      storeActions.clear()

      expect(storeActions.has(FOO)).to.equal(false)
      expect(storeActions.actions()).to.be.an('array')
      expect(storeActions.actions().length).to.equal(0)
    })
  })
})
