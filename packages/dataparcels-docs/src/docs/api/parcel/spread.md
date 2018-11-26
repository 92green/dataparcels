```flow
spread(): {value: *, onChange: Function}
spread(notFoundValue: any): {value: *, onChange: Function}
```

Returns an object with the Parcel's value and its onChange function.

If `notFoundValue` is provided, and the Parcel's value is undefined or has been marked for deletion, the returned value will be equal to `notFoundValue`.

```js
let parcel = new Parcel({
    value: 123
});

<MyInputComponent {...parcel.spread()} />

// ^ this is equivalent to
// <MyInputComponent value={parcel.value} onChange={parcel.onChange} />

```
