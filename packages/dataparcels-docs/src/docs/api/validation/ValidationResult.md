```flow
ValidationResult = {
    modifyBeforeUpdate: ParcelValueUpdater
};
```

The Validation function returns an object containing a single function.

#### modifyBeforeUpdate

This is a function that can be used directly with `modifyBeforeUpdate` on [useParcelState](/api/useParcelState#modifyBeforeUpdate"), [useParcelBuffer](/api/useParcelBuffer#modifyBeforeUpdate) or [ParcelBoundary](/api/ParcelBoundary#modifyBeforeUpdate).

This will check the Parcel's value and set [Parcel meta](/parcel-meta) wherever validations errors occured.

On each validated Parcel, `parcel.meta.invalid` will contain `undefined` if the data is valid, or the result of the validator rule if the data is invalid. This can then be easily rendered.

Please refer to the UI Behaviour page to see [a full example](/ui-behaviour#Validation-on-user-input).

```js
ParcelBoundary({
    name: 'exampleParcel',
    hold: true,
    modifyBeforeUpdate: validation.modifyBeforeUpdate
    // ^ run validator before data updates
    //   to set meta on Parcels that have failed validation
});
```
