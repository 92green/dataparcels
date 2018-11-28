// @flow

export const ReadOnlyError = () => new Error(`This property is read-only`);
export const ReducerInvalidActionError = (actionType: string) => new Error(`"${actionType}" is not a valid action`);
export const ReducerSwapKeyError = () =>  new Error(`swap actions must have a swapKey in their payload`);
export const ModifyValueDownChildReturnError = () =>  new Error(`.modifyValueDown()'s updater can not return a value that has children unless it is unchanged by the updater or is empty.`);
export const ModifyValueUpChildReturnError = () =>  new Error(`When .modifyValueUp()'s updater is passed a value that has children, it cannot return a value that has children unless it is unchanged by the updater`);
export const ChangeRequestUnbasedError = () =>  new Error(`ChangeRequest data cannot be accessed before calling changeRequest._setBaseParcel()`);
