```flow
spreadDOMCheckbox(): {value: *, onChange: OnChangeDOMCheckboxFunction}
spreadDOMCheckbox(notFoundValue: boolean): {value: *, onChange: OnChangeDOMCheckboxFunction}

type OnChangeDOMCheckboxFunction = (event: HTMLEvent) => void;
```

This is designed to bind a Parcel with an HTML checkbox.
It returns an object with `checked` and `onChange`, where `checked` is the Parcel's `value` cast to a boolean, and `onChange` is the Parcel's `onChangeDOMCheckbox` function.

If `notFoundValue` is provided, and the Parcel's value is undefined or has been marked for deletion, the returned value will be equal to `notFoundValue` cast to a boolean.

```js
let parcel = new Parcel({
    value: 123
});

<input type="checkbox" {...parcel.spreadDOMCheckbox()} />
```
