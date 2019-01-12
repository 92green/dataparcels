// @flow

export default (expect: Function, test: Function) => {
    expect(() => test(123, _ => _)).not.toThrowError();
    expect(() => test(123, () => [])).not.toThrowError();
    expect(() => test([], () => 123)).not.toThrowError();
    expect(() => test([1], _ => _)).not.toThrowError();
    expect(() => test([1], () => [2])).toThrowError('Value updaters');
};
