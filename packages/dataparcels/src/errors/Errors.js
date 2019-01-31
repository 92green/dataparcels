// @flow

export const ReadOnlyError = () => new Error(`This property is read-only`);
export const ReducerInvalidActionError = (actionType: string) => new Error(`"${actionType}" is not a valid action`);
export const ChangeRequestUnbasedError = () =>  new Error(`ChangeRequest data cannot be accessed before calling changeRequest._setBaseParcel()`);
export const ShapeUpdaterNonShapeChildError = () =>  new Error(`Every child value on a collection returned from a shape updater must be a ParcelShape`);
