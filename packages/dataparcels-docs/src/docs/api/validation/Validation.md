# Validation

```js
import Validation from 'dataparcels/Validation';
import Validation from 'react-dataparcels/Validation';
```

```flow
Validation(ValidatorMap) => PartialParcelBoundaryConfig;
```

Dataparcels' Validation plugin provides an easy way to test whether data conforms to a set of validation rules.
Once configured, it provides function that can be run against Parcel data, and it will set [Parcel meta](/parcel-meta) wherever data is invalid.

### Example usage

Please refer to the UI Behaviour page to see [a full example](/ui-behaviour#Validation-on-user-input).

```js
const validation = Validation({
    'name': validateStringNotBlank("Name"),
    'animals.*.type': validateStringNotBlank("Animal type"),
    'animals.*.amount': [
        validateInteger("Animal amount"),
        validatePositiveNumber("Animal amount")
    ]
});

// example validator
const validateStringNotBlank = (name) => (value) => {
    return (!value || value.trim().length === 0) && `${name} must not be blank`;
};

// usage

ParcelBoundary({
    name: 'exampleParcel',
    hold: true,
    modifyBeforeUpdate: [validation.modifyBeforeUpdate]
    // ^ run validator before data updates
    //   to set meta on Parcels that have failed validation
});
```
