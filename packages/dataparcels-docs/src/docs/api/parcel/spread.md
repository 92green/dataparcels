```flow
spread(): {value: *, onChange: OnChangeFunction}
spread(notFoundValue: any): {value: *, onChange: OnChangeFunction}

type OnChangeFunction = (value: any) => void;
```

This is designed to bind a Parcel with an input component that expects a `value` and an `onChange` callback. The `onChange` callback is expected to pass an updated value as its first argument. 

If `notFoundValue` is provided, and the Parcel's value is undefined or has been marked for deletion, the returned value will be equal to `notFoundValue`.

```js
let parcel = new Parcel({
    value: 123
});

<MyInputComponent {...parcel.spread()} />

// ^ this is equivalent to
// <MyInputComponent value={parcel.value} onChange={parcel.onChange} />

```
