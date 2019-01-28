```flow
spreadDOM(): {value: *, onChange: OnChangeDOMFunction}
spreadDOM(notFoundValue: any): {value: *, onChange: OnChangeDOMFunction}

type OnChangeDOMFunction = (event: HTMLEvent) => void;
```

Returns an object with the Parcel's value and its onChangeDOM function.

If `notFoundValue` is provided, and the Parcel's value is undefined or has been marked for deletion, the returned value will be equal to `notFoundValue`.

```js
let parcel = new Parcel({
    value: 123
});

<input {...parcel.spreadDOM()} />

// ^ this is equivalent to
// <input value={parcel.value} onChange={parcel.onChangeDOM} />

```
