import Link from 'component/Link';

```flow
spyChange(sideEffect: Function): Parcel
```

Once the `spyChange` method is called on a parcel, it will call the `sideEffect` function each time a change is requested from beneath, passing the associated <Link to="/api/ChangeRequest">ChangeRequest</Link> as the first parameter. The return value of `sideEffect` is ignored. It returns a clone of the original parcel, so it can be chained. This is useful for debugging.

```js
let value = {
    abc: 123
};
let parcel = new Parcel({value});
parcel
    .spyChange(changeRequest => changeRequest.toConsole()) // 3. logs the change request to the console (containing {abc: 456})
    .get('abc')
    .spyChange(changeRequest => changeRequest.toConsole()) // 2. logs the change request to the console (containing 456)
    .onCHange(456); // 1. a change is made
```
