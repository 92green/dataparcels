// @flow

export const ReadOnlyError = () => {
    throw new Error(`This property is read-only`);
};
