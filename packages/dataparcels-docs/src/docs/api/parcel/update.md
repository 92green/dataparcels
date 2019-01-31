import ValueUpdater from 'docs/notes/ValueUpdater.md';

```flow
update(updater: ValueUpdater): void
update(key: string|number, updater: ValueUpdater): void // only on ParentParcels, will update a child

type ValueUpdater = (value: any, self: Parcel) => any;
```

Calling `update()` with one argument will trigger a change that replaces the current value in the Parcel with the result of the value updater provided to it. The value updater is passed the current value of the Parcel, from which you can return the intended replacement value.

```js
let parcel = new Parcel({
    value: 123
});
parcel.update(value => value + 1);
// this triggers a change that sets the parcel's value to 124
```

On ParentParcels this method can also be called with a `key`, which updates the child value at that key. The value updater is passed the current value found at the `key`, from which you can return the intended replacement value.

```js
let parcel = new Parcel({
    value: {
        abc: 123,
        def: 789
    }
});
parcel.update('abc', value => value + 1);
// this triggers a change that sets the parcel's value to {abc: 124, def: 789}
```

<ValueUpdater alt="updateShape" />
