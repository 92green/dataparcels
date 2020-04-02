// @flow

export const ParcelTypeMethodMismatch = (key: string, parcelType: string, path: ?string[]) => {
    let suffix = Array.isArray(path) ? `(keyPath: [${path.join(', ')}]).` : ``;
    return new Error(`.${key}() is not a function. It can only be called on parcels of type "${parcelType}". ${suffix}`);
};
export const ChangeRequestNoPrevDataError = () =>  new Error(`ChangeRequest data cannot be accessed before setting changeRequest.prevData`);
