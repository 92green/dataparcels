// @flow

export const ReadOnlyError = () => new Error(`This property is read-only`);
export const ReducerInvalidActionError = (actionType: string) => new Error(`"${actionType}" is not a valid action`);
export const ReducerSwapKeyError = () =>  new Error(`swap actions must have a swapKey in their payload`);
