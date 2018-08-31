// @flow

export const ReadOnlyError = () => Error(`This property is read-only`);
export const ReducerKeyPathRequiredError = (actionType: string) => Error(`${actionType} actions must have a keyPath with at least one key`);
export const ReducerInvalidActionError = (actionType: string) => Error(`"${actionType}" is not a valid action`);
export const ReducerSwapKeyError = () =>  Error(`swap actions must have a swapKey in their payload`);
