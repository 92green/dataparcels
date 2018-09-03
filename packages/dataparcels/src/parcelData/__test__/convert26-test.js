// @flow
import { toString26, toInt26 } from '../convert26';

test('toString26 should work properly', () => {
    expect(toString26(0)).toBe("");
    expect(toString26(1)).toBe("a");
    expect(toString26(2)).toBe("b");
    expect(toString26(26)).toBe("z");
    expect(toString26(27)).toBe("aa");
    expect(toString26(54)).toBe("bb");
});

test('toInt26 should work properly', () => {
    expect(toInt26("a")).toBe(1);
    expect(toInt26("b")).toBe(2);
    expect(toInt26("z")).toBe(26);
    expect(toInt26("aa")).toBe(27);
    expect(toInt26("bb")).toBe(54);
});
