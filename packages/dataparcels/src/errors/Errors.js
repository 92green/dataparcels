// @flow

export const ReadOnlyError = () => new Error(`This property is read-only`);
export const ReducerKeyPathRequiredError = (actionType: string) => new Error(`${actionType} actions must have a keyPath with at least one key`);
export const ReducerInvalidActionError = (actionType: string) => new Error(`"${actionType}" is not a valid action`);
export const ReducerSwapKeyError = () =>  new Error(`swap actions must have a swapKey in their payload`);
export const ModifyValueChildReturnError = () =>  new Error(`.modifyValue()'s updater can not return a data type that has children, unless the value returned is the same as the value that was passed into .modifyValue()`);
