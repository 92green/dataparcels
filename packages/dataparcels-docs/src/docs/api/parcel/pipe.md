```flow
pipe(...updaters: Function[]): Parcel
```

The `pipe` method allows for a parcel to be passed through one or more parcel modifying functions, while retaining the ability to chain. It allows for easier function composition.

```js
let valueToString = (parcel) => parcel.modifyDown(value => `${value}`);
let changeToNumber = (parcel) => parcel.modifyUp(value => Number(value));

let parcel = new Parcel({value: 123});
parcel
    .pipe(
        valueToString,
        changeToNumber
    )
    .value // returns "123"
```

The above is equivalent to:

```js
let parcel = new Parcel({value: 123});
parcel
    .modifyDown(value => `${value}`)
    .modifyUp(value => Number(value))
    .value // returns "123"
```
