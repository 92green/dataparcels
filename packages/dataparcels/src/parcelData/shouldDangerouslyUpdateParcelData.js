// @flow

export default (updater: Function): boolean => {
    return !!updater._dangerouslyUpdate;
};
