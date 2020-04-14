// @flow
import validation from '../validation';

test('validation should validate specified fields', () => {
    let isValid = jest.fn(value => value > 200 ? undefined : "Error");

    let parcelData = {
        value: {
            abc: 123,
            def: 456
        },
        meta: {
            _control: 'submit'
        }
    };

    let myvalidation = validation({
        abc: isValid,
        def: isValid
    });

    let newParcelData = myvalidation(parcelData);

    // validator should be called
    expect(isValid.mock.calls[0][0]).toBe(123);

    // value should be untouched
    expect(newParcelData.value).toEqual(parcelData.value);

    // meta should be set
    expect(newParcelData.child.abc.meta.invalid).toBe("Error");
    expect(newParcelData.child.def.meta.invalid).toBe(undefined);

    // top level invalid array should be set
    expect(newParcelData.meta.invalidList).toEqual(["Error"]);
});

test('validation should accept arrays of validators', () => {
    let higherThan300 = value => value > 300 ? undefined : "Not higher than 300";
    let higherThan600 = value => value > 600 ? undefined : "Not higher than 600";

    let parcelData = {
        value: {
            abc: 123,
            def: 456,
            ghi: 789
        },
        meta: {
            _control: 'submit'
        }
    };

    let myvalidation = validation({
        abc: [higherThan300, higherThan600],
        def: [higherThan300, higherThan600],
        ghi: [higherThan300, higherThan600]
    });

    let newParcelData = myvalidation(parcelData);

    // meta should be set
    expect(newParcelData.child.abc.meta.invalid).toBe("Not higher than 300");
    expect(newParcelData.child.def.meta.invalid).toBe("Not higher than 600");
    expect(newParcelData.child.ghi.meta.invalid).toBe(undefined);
});

test('validation should accept wildcards to check all fields at a depth', () => {

    let parcelData = {
        value: {
            abc: [1,5,2,6,1],
            def: [9]
        },
        meta: {
            _control: 'submit'
        }
    };

    let myvalidation = validation({
        ['abc.*']: value => value > 4 ? "Too big" : undefined
    });

    let newParcelData = myvalidation(parcelData);

    // meta should be set
    expect(newParcelData.child.abc.child[0].meta.invalid).toBe(undefined);
    expect(newParcelData.child.abc.child[1].meta.invalid).toBe("Too big");
    expect(newParcelData.child.abc.child[2].meta.invalid).toBe(undefined);
    expect(newParcelData.child.abc.child[3].meta.invalid).toBe("Too big");
    expect(newParcelData.child.abc.child[4].meta.invalid).toBe(undefined);
});

test('validation should accept multiple wildcards to check all fields at a depth', () => {

    let parcelData = {
        value: {
            abc: [1,5,2,6,1],
            def: [9]
        },
        meta: {
            _control: 'submit'
        }
    };

    let myvalidation = validation({
        ['*.*']: value => value > 4 ? "Too big" : undefined
    });

    let newParcelData = myvalidation(parcelData);

    // meta should be set
    expect(newParcelData.child.abc.child[0].meta.invalid).toBe(undefined);
    expect(newParcelData.child.abc.child[1].meta.invalid).toBe("Too big");
    expect(newParcelData.child.abc.child[2].meta.invalid).toBe(undefined);
    expect(newParcelData.child.abc.child[3].meta.invalid).toBe("Too big");
    expect(newParcelData.child.abc.child[4].meta.invalid).toBe(undefined);
    expect(newParcelData.child.def.child[0].meta.invalid).toBe("Too big");
});

test('validation should set top level meta.valid and meta._control', () => {

    let invalid = {
        value: {
            abc: 123
        },
        meta: {
            _control: null
        }
    };

    let invalidSubmitted = {
        value: {
            abc: 123
        },
        meta: {
            _control: 'submit'
        }
    };

    let valid = {
        value: {
            abc: 456
        },
        meta: {
            _control: null
        }
    };

    let validSubmitted = {
        value: {
            abc: 456
        },
        meta: {
            _control: 'submit'
        }
    };

    let myvalidation = validation({
        abc: value => value > 300 ? undefined : "Not higher than 300"
    });

    let invalidResult = myvalidation(invalid);
    expect(invalidResult.meta.valid).toBe(true);
    expect(invalidResult.meta._control).toBe(null);

    let invalidSubmittedResult = myvalidation(invalidSubmitted);
    expect(invalidSubmittedResult.meta.valid).toBe(false);
    expect(invalidSubmittedResult.meta._control).toBe(null);

    let validResult = myvalidation(valid);
    expect(validResult.meta.valid).toBe(true);
    expect(validResult.meta._control).toBe(null);

    let validSubmittedResult = myvalidation(validSubmitted);
    expect(validSubmittedResult.meta.valid).toBe(true);
    expect(validSubmittedResult.meta._control).toBe('submit');
});

test('validation should set top level meta.showInvalid to true only after attempted submit', () => {

    let invalid = {
        value: {
            abc: 123
        },
        meta: {
            _control: null
        }
    };

    let invalidSubmitted = {
        value: {
            abc: 123
        },
        meta: {
            _control: 'submit',
            showInvalid: false
        }
    };

    let valid = {
        value: {
            abc: 456
        },
        meta: {
            _control: null,
            showInvalid: true
        }
    };

    let myvalidation = validation({
        abc: value => value > 300 ? undefined : "Not higher than 300"
    });

    let invalidResult = myvalidation(invalid);
    expect(invalidResult.meta.showInvalid).toBe(false);

    let invalidSubmittedResult = myvalidation(invalidSubmitted);
    expect(invalidSubmittedResult.meta.showInvalid).toBe(true);

    let validResult = myvalidation(valid);
    expect(validResult.meta.showInvalid).toBe(true);
});

