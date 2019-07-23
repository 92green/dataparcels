// @flow

export default (updater: Function): Function => {
    updater._updateRaw = true;
    return updater;
};
