// @flow
import Validation from '../Validation';

// _dangerouslyUpdate

test('Validation should use a dangerous updater, so it will work in modifyBeforeUpdate', () => {
    expect(Validation({}).modifyBeforeUpdate._dangerouslyUpdate).toBe(true);
});


test('Validation should validate specified fields', () => {
    let isValid = jest.fn(value => value > 200 ? undefined : "Error");

    let parcelData = {
        value: {
            abc: 123,
            def: 456
        }
    };

    let validation = Validation({
        abc: isValid,
        def: isValid
    });

    let newParcelData = validation.modifyBeforeUpdate(parcelData);

    // validator should be called
    expect(isValid.mock.calls[0][0]).toBe(123);
    expect(isValid.mock.calls[0][1].keyPath).toEqual(['abc']);
    expect(isValid.mock.calls[0][1].topLevelValue).toEqual({
        abc: 123,
        def: 456
    });

    // value should be untouched
    expect(newParcelData.value).toEqual(parcelData.value);

    // meta should be set
    expect(newParcelData.child.abc.meta.invalid).toBe("Error");
    expect(newParcelData.child.def.meta.invalid).toBe(undefined);
});

test('Validation should accept arrays of validators', () => {
    let higherThan300 = value => value > 300 ? undefined : "Not higher than 300";
    let higherThan600 = value => value > 600 ? undefined : "Not higher than 600";

    let parcelData = {
        value: {
            abc: 123,
            def: 456,
            ghi: 789
        }
    };

    let validation = Validation({
        abc: [higherThan300, higherThan600],
        def: [higherThan300, higherThan600],
        ghi: [higherThan300, higherThan600]
    });

    let newParcelData = validation.modifyBeforeUpdate(parcelData);

    // meta should be set
    expect(newParcelData.child.abc.meta.invalid).toBe("Not higher than 300");
    expect(newParcelData.child.def.meta.invalid).toBe("Not higher than 600");
    expect(newParcelData.child.ghi.meta.invalid).toBe(undefined);
});

test('Validation should accept wildcards to check all fields at a depth', () => {

    let parcelData = {
        value: {
            abc: [1,5,2,6,1],
            def: [9]
        }
    };

    let validation = Validation({
        ['abc.*']: value => value > 4 ? "Too big" : undefined
    });

    let newParcelData = validation.modifyBeforeUpdate(parcelData);

    // meta should be set
    expect(newParcelData.child.abc.child[0].meta.invalid).toBe(undefined);
    expect(newParcelData.child.abc.child[1].meta.invalid).toBe("Too big");
    expect(newParcelData.child.abc.child[2].meta.invalid).toBe(undefined);
    expect(newParcelData.child.abc.child[3].meta.invalid).toBe("Too big");
    expect(newParcelData.child.abc.child[4].meta.invalid).toBe(undefined);
});

test('Validation should accept multiple wildcards to check all fields at a depth', () => {

    let parcelData = {
        value: {
            abc: [1,5,2,6,1],
            def: [9]
        }
    };

    let validation = Validation({
        ['*.*']: value => value > 4 ? "Too big" : undefined
    });

    let newParcelData = validation.modifyBeforeUpdate(parcelData);

    // meta should be set
    expect(newParcelData.child.abc.child[0].meta.invalid).toBe(undefined);
    expect(newParcelData.child.abc.child[1].meta.invalid).toBe("Too big");
    expect(newParcelData.child.abc.child[2].meta.invalid).toBe(undefined);
    expect(newParcelData.child.abc.child[3].meta.invalid).toBe("Too big");
    expect(newParcelData.child.abc.child[4].meta.invalid).toBe(undefined);
    expect(newParcelData.child.def.child[0].meta.invalid).toBe("Too big");
});

test('Validation should set top level meta.valid', () => {

    let parcelData = {
        value: {
            abc: 123
        }
    };

    let parcelData2 = {
        value: {
            abc: 456
        }
    };

    let validation = Validation({
        abc: value => value > 300 ? undefined : "Not higher than 300"
    });

    let newParcelData = validation.modifyBeforeUpdate(parcelData);
    let newParcelData2 = validation.modifyBeforeUpdate(parcelData2);

    // meta should be set
    expect(newParcelData.meta.valid).toBe(false);
    expect(newParcelData2.meta.valid).toBe(true);
});

test('Validation onRelease should continue chain if meta.valid is true', () => {

    let continueRelease = jest.fn();
    let changeRequestValid = {
        nextData: {
            meta: {
                valid: true
            }
        }
    };

    // $FlowFixMe
    Validation({}).onRelease(continueRelease, changeRequestValid);
    expect(continueRelease).toHaveBeenCalled();
});

test('Validation onRelease should not continue chain if meta.valid is false', () => {

    let continueRelease = jest.fn();
    let changeRequestValid = {
        nextData: {
            meta: {
                valid: false
            }
        }
    };

    // $FlowFixMe
    Validation({}).onRelease(continueRelease, changeRequestValid);
    expect(continueRelease).not.toHaveBeenCalled();
});

