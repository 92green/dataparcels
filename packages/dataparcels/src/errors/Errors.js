// @flow

export const ReadOnlyError = () => new Error(`This property is read-only`);
export const ReducerInvalidActionError = (actionType: string) => new Error(`"${actionType}" is not a valid action`);
export const ReducerInvalidStepError = (stepType: string) => new Error(`"${stepType}" is not a valid action step type`);
export const ChangeRequestNoPrevDataError = () =>  new Error(`ChangeRequest data cannot be accessed before setting changeRequest.prevData`);
export const ShapeUpdaterNonShapeChildError = () =>  new Error(`Every child value on a collection returned from a shape updater must be a ParcelShape`);
export const ChangeAndReturnNotCalledError = () =>  new Error(`_changeAndReturn unchanged`);
