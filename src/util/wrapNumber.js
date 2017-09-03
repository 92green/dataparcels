// @flow
export default function NumberWrap(val: number, min: number, max: number): number {
    var range = max - min;
    val = (val - min) % range;
    return val < 0 ? val + range : val;
}
