// @flow

export default (updater: Function): Function => {
    updater._dangerouslyUpdate = true;
    return updater;
};
