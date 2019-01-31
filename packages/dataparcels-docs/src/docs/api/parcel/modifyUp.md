import ValueUpdater from 'docs/notes/ValueUpdater.md';

```flow
modifyUp(updater: ValueUpdater): Parcel

type ValueUpdater = (value: any, self: Parcel) => any;
```

`modifyUp()` lets you modify a Parcel's new value when a change is being propagated upward.

```js
let parcel = new Parcel({
    value: "abc"
});

parcel
    .modifyUp(value => value.toUpperCase());
    .set("def");

// this triggers a change to set the value to "def"
// which propagates upward through .modifyUp()
// .modifyUp() turns "def" into "DEF"
// and the change request continues up to the original Parcel

// The Parcel then has a new value of "DEF"
```

It does not trigger any changes of its own, but awaits a change from below. Values from above are passed through unchanged.

The modify methods are particularly useful when your Parcel contains data you want to be able to make an editor for, but the data isn't stored in a format that allows you to do that easily. The `modifyDown()` and `modifyUp()` methods are often used with one another to make a value editable on the way down, and turn it back on the way up.

<ValueUpdater />
