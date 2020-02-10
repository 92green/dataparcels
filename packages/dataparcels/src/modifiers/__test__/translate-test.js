// @flow
import translate from '../translate';
import Parcel from '../../parcel/Parcel';

let onlyDown = translate({
    down: number => `${number}`
});

let onlyUp = translate({
    up: string => Number(string)
});

let numberToString = translate({
    down: number => `${number}`,
    up: string => Number(string)
});

let numberToStringPreserve = translate({
    down: number => `${number}`,
    up: string => Number(string),
    preserveInput: true
});

test('translate should translate value', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 123,
        handleChange
    });

    let translatedParcel = parcel.pipe(numberToString);

    expect(translatedParcel.value).toBe('123');

    translatedParcel.set('456');

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].value).toBe(456);
});

test('translate should use default if config.up isnt provided', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 123,
        handleChange
    });

    let translatedParcel = parcel.pipe(onlyDown);

    expect(translatedParcel.value).toBe('123');

    translatedParcel.set('456');

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].value).toBe('456');
});

test('translate should use default if config.down isnt provided', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 123,
        handleChange
    });

    let translatedParcel = parcel.pipe(onlyUp);

    expect(translatedParcel.value).toBe(123);

    translatedParcel.set('456');

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange.mock.calls[0][0].value).toBe(456);
});

test('translate should use new value if original changes', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 123,
        handleChange
    });

    let translatedParcel = parcel.pipe(numberToString);

    expect(translatedParcel.value).toBe('123');

    translatedParcel.set('notanumber!');

    expect(handleChange).toHaveBeenCalledTimes(1);
    let nextParcel = handleChange.mock.calls[0][0];

    expect(isNaN(nextParcel.value)).toBe(true);
    expect(isNaN(nextParcel.pipe(numberToString).value)).toBe(true);
});

test('translate with preserveInput should continue to use translated value even if original changes', () => {
    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: 123,
        handleChange
    });

    let translatedParcel = parcel.pipe(numberToStringPreserve);

    expect(translatedParcel.value).toBe('123');

    translatedParcel.set('notanumber!');

    expect(handleChange).toHaveBeenCalledTimes(1);
    let nextParcel = handleChange.mock.calls[0][0];

    expect(isNaN(nextParcel.value)).toBe(true);
    expect(nextParcel.pipe(numberToStringPreserve).value).toBe('notanumber!');
    expect(isNaN(nextParcel.pipe(numberToStringPreserve).meta.untranslated)).toBe(true);
});

test('translate with preserveInput should overwrite translated value if it changes from another source', () => {

    // this works because the translated value is stored in meta
    // and meta is erased by default when setting above of the value's keypath
    // TODO - consider cases where a future feature may choose to persist meta
    // and how meta that should persist can be differentiated from meta that shouldnt

    let handleChange = jest.fn();

    let parcel = new Parcel({
        value: {
            a: 123
        },
        handleChange
    });

    let translatedParcel = parcel.get('a').pipe(numberToStringPreserve);

    expect(translatedParcel.value).toBe('123');

    translatedParcel.set('notanumber!');

    expect(handleChange).toHaveBeenCalledTimes(1);
    let nextParcel = handleChange.mock.calls[0][0];

    expect(isNaN(nextParcel.value.a)).toBe(true);
    expect(nextParcel.get('a').pipe(numberToStringPreserve).value).toBe('notanumber!');

    nextParcel.set({
        a: 789
    });

    expect(handleChange).toHaveBeenCalledTimes(2);
    let nextParcel2 = handleChange.mock.calls[1][0];

    expect(nextParcel2.get('a').pipe(numberToStringPreserve).value).toBe('789');
});

