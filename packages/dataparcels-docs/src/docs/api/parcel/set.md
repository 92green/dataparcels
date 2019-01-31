import {Box, Link, Message} from 'dcme-style';
import IndexedKeys from 'docs/notes/IndexedKeys.md';

```flow
set(value: any): void
set(key: string|number, value: any): void // only on ParentParcels, will set a child
```

Calling `set()` with one argument will trigger a change that replaces the current value in the Parcel with the `value` provided. This is equivalent to calling <Link href="#onChange">onChange()</Link>.

```js
let parcel = new Parcel({
    value: 123
});
parcel.set(456);
// this triggers a change that sets the parcel's value to 456
```

On ParentParcels this method can also be called with a `key`, which sets the child value at that key.

```js
let parcel = new Parcel({
    value: {
        abc: 123,
        def: 789
    }
});
parcel.set('abc', 456);
// this triggers a change that sets the parcel's value to {abc: 456, def: 789}
```

<IndexedKeys />
