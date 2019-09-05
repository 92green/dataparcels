// @flow

export const ReadOnlyError = () => new Error(`This property is read-only`);
export const ParcelTypeMethodMismatch = (key: string, parcelType: string, path: ?string[]) => {
    let suffix = Array.isArray(path) ? `(keyPath: [${path.join(', ')}]).` : ``;
    return new Error(`.${key}() is not a function. It can only be called on parcels of type "${parcelType}". ${suffix}`);
};
export const ReducerInvalidActionError = (actionType: string) => new Error(`"${actionType}" is not a valid action`);
export const ReducerInvalidStepError = (stepType: string) => new Error(`"${stepType}" is not a valid action step type`);
export const ChangeRequestNoPrevDataError = () =>  new Error(`ChangeRequest data cannot be accessed before setting changeRequest.prevData`);
export const ShapeUpdaterNonShapeChildError = () =>  new Error(`Every child value on a collection returned from a shape updater must be a ParcelShape`);
export const AsNodeReturnNonParcelNodeError = () =>  new Error(`The return value of an asNode() updater must be a ParcelNode`);
