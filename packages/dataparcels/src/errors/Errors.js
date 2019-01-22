// @flow

export const ReadOnlyError = () => new Error(`This property is read-only`);
export const ReducerInvalidActionError = (actionType: string) => new Error(`"${actionType}" is not a valid action`);
export const UnsafeValueUpdaterError = () =>  new Error(`Value updaters can only pass collections through if the collection is unchanged by the updater. Consider using a deep updater method (e.g. <method name>Deep()) for updating collections.`);
export const ChangeRequestUnbasedError = () =>  new Error(`ChangeRequest data cannot be accessed before calling changeRequest._setBaseParcel()`);
export const ShapeUpdaterNonShapeChildError = () =>  new Error(`Every child value on a collection returned from a shape updater must be a ParcelShape`);
export const ShapeUpdaterUndefinedError = () =>  new Error(`ShapeUpdaterUndefinedError`);
