// @flow

export default (fn: Function): number => {
    let start = process.hrtime();
    fn();
    let end = process.hrtime(start);
    return end[0] * 1000 + end[1] / 1000000;
};
