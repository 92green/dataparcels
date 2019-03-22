```flow
ValidationResult = {
    modifyBeforeUpdate: ParcelValueUpdater,
    onRelease: ContinueChainFunction
};
```

The Validation function returns an object containing two functions.

#### modifyBeforeUpdate

This is a function that can be used directly with `modifyBeforeUpdate` on [ParcelHoc](/api/ParcelHoc#modifyBeforeUpdate"), [ParcelBoundary](/api/ParcelBoundary#modifyBeforeUpdate) or [ParcelBoundaryHoc](/api/ParcelBoundaryHoc#modifyBeforeUpdate).

This will check the Parcel's value and set [Parcel meta](/parcel-meta) wherever validations errors occured.

On each validated Parcel, `parcel.meta.invalid` will contain `undefined` if the data is valid, or the result of the validator rule if the data is invalid. This can then be easily rendered.

Please refer to the UI Behaviour page to see [a full example](/ui-behaviour#Validation-on-user-input).

```js
ParcelBoundary({
    name: 'exampleParcel',
    hold: true,
    modifyBeforeUpdate: [validation.modifyBeforeUpdate]
    // ^ run validator before data updates
    //   to set meta on Parcels that have failed validation
});
```

#### onRelease

This is a function that can be used directly with `onRelease` on [ParcelBoundary](/api/ParcelBoundary#modifyBeforeUpdate) or [ParcelBoundaryHoc](/api/ParcelBoundaryHoc#modifyBeforeUpdate).

If `release()` is called, this `onRelease` function will prevent the release from taking place if any data is invalid.

```js
ParcelBoundary({
    name: 'exampleParcel',
    hold: true,
    modifyBeforeUpdate: [validation.modifyBeforeUpdate]
    onRelease: [validation.onRelease]
});
```
