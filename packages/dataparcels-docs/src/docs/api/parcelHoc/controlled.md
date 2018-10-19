
```flow
controlled?: boolean or ParcelHocControlledConfig // optional

type ParcelHocControlledConfig = {
    shouldHocUpdate?: (valueA: *, valueB: *) => boolean
}
```

The controlled config option allows the ParcelHoc to replace its parcel's contents based on prop changes. This causes the ParcelHoc to function in a similar way to a [React controlled component](https://reactjs.org/docs/forms.html#controlled-components).

If `controlled = true`, `config.valueFromProps` will be called every time props change. If the return value of `valueFromProps` is not strictly equal to the current parcel value, the parcel value will be replaced with the return value of `valueFromProps`.

You can pass an object to `controlled` instead of a boolean for further configuration. The object can have any of the following properties:

* `shouldHocUpdate` - Allows you to set how the new value from props is compared with the current parcel value. It defaults to `(valueA, valueB) => valueA !== valueB`.

At this point, the `controlled` option will completely replace all of the parcels contents and delete all key and meta information. In future there will be more options to allow partial changes, and to allow key and meta data to be retained.

```js
ParcelHoc({
    name: "exampleParcel",
    valueFromProps: (props) => props.data,
    controlled: true
});
```

```js
ParcelHoc({
    name: "exampleParcel",
    valueFromProps: (props) => props.data,
    controlled: {
        shouldHocUpdate: (valueA, valueB) => valueA.xyz !== valueB.xyz
    }
});
```
