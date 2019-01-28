// @flow

const MESSAGE = 'CancelAction';

export default () => {
    throw new Error(MESSAGE);
};

export const IsReducerCancelAction = (e: Error): boolean => {
    return e.message === MESSAGE;
};
