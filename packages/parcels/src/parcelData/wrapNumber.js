// @flow
export default (val: number, max: number): number => {
    val = val % max;
    return val < 0 ? val + max : val;
};
