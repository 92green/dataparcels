// @flow
export default function idIncerement(keys: Array<number>): number {
    if(keys.length === 0) {
        return 0;
    }
    return Math.max(...keys.map(ii => ii.key)) + 1;
}
