```flow
spy(sideEffect: Function): Parcel
```

When the `spy` method is called on a parcel, it immediately calls the `sideEffect` function, passing itself as the first parameter. The return value of `sideEffect` is ignored. It returns the original parcel, so it can be chained. This is useful for debugging.

```js
let value = {
    abc: 123
};
let parcel = new Parcel({value});
parcel
    .spy(parcel => parcel.toConsole()) // 1. logs the parcel to the console ({abc: 123})
    .get('abc')
    .spy(parcel => parcel.toConsole()) // 2. logs the parcel to the console (123)
    .value; // 3. returns 123
```
