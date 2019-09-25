// @flow

export default (updater: Function): Function => {
    updater._asRaw = true;
    return updater;
};
