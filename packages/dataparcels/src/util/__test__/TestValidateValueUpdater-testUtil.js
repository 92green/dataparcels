// @flow
/* eslint-disable */

export default (expect: Function, test: Function) => {

    // $FlowFixMe
    console.warn = jest.fn();

    expect(() => test(123, _ => _)).not.toThrowError();
    expect(() => test(123, () => [])).not.toThrowError();
    expect(() => test([], () => 123)).not.toThrowError();
    expect(() => test([1], _ => _)).not.toThrowError();

    expect(console.warn).not.toHaveBeenCalled();

    test([1], () => [2]);

    expect(console.warn).toHaveBeenCalled();
    expect(console.warn.mock.calls[0][0]).toBe(`Warning: please ensure you do not change the shape of the value, as changing the data shape or moving children within the data shape can cause dataparcels to misplace its keying and meta information!`);
};
