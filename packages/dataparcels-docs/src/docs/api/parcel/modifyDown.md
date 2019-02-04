import ValueUpdater from 'docs/notes/ValueUpdater.md';

```flow
modifyDown(updater: ValueUpdater): Parcel

type ValueUpdater = (value: any, self: Parcel) => any;
```

`modifyDown` lets you modify a Parcel's value so that lower Parcels receive and make changes against the modified value.

```js
let parcel = new Parcel({
    value: "abc"
});

parcel
    .modifyDown(value => value.toUpperCase());
    .value // "ABC" (top level Parcel is still "abc")
```

It does not trigger any changes of its own, it just modifies the values that pass through it from above. Changes fired from beneath are passed through unchanged.

The modify methods are particularly useful when your Parcel contains data you want to be able to make an editor for, but the data isn't stored in a format that allows you to do that easily. The `modifyDown()` and `modifyUp()` methods are often used with one another to make a value editable on the way down, and turn it back on the way up.

<ValueUpdater />
