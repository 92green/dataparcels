```flow
ValidationMap = {
    [matchPath: string]: ValidationRule|ValidationRule[]
    ...
};
```

Validation accepts a single argument, a ValidationMap. A ValidationMap is an object whose values are validation rule functions, or arrays of validation rule functions. The ValidationMap's keys are strings specifying which paths to run the validator on.

If an array of validation rules is provided, all rules must pass in order for the validation on that value to pass.

#### ValidationRule

```flow
ValidationRule = (value: any, keyPath: Array<any>) => any;
```

The intent of a ValidationRule is to analyze a value, and if the value does not pass the validation check then data signifying an error must be returned. Usually this is a string containing the error message. If the value passes the check, something falsey should be returned.

Each ValidationRule function is passed the `value` of the Parcel that is being validated, as well as the Parcel's `keyPath`.

#### Example ValidationRules

```js
const validateStringNotBlank = (value) => {
    return (!value || value.trim().length === 0) && `Value must not be blank`;
};

const validateInteger = (value) => {
    return !Number.isInteger(value) && `Value must be a whole number`;
};

const validatePositiveNumber = (value) => {
    return value < 0 && `Value must not be negative`;
};
```

#### matchPath

A `matchPath` is a string that prescribes where to run each validation rule.

* The dot character (`.`) is used to specify the key at the next layer of depth in the data structure.
* The star character (`*`) is used as an instruction to apply the rule to all pieces of data at that depth. 

```js
let value = {
    person: {
        firstName: "George"
    },
    pets: [
        "Fido",
        "Sniffles"
    ]
};

Validation({
    'person.firstName': validatorRule,
    // ^ when run on value, this will be called once
    // receiving a value of "George"
    'pets.*': validatorRule
    // ^ when run on value, this will be called twice
    // receiving a value of "Fido", then "Sniffles"
})
```

