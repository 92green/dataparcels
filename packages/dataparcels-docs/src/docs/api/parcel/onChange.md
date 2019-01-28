import {Box, Link, Message, Text} from 'dcme-style';

```flow
onChange(value: any): void
```

This is designed for use with input components that call `onChange` with a new value.
It triggers a change that replaces the current value in the Parcel with the `value` provided.

If called on a ParentParcel, any child information that the Parcel had is removed, such as child keys or meta.

It is equivalent to calling <Link href="#set">set()</Link> with no key.

```js
let parcel = new Parcel({
    value: 123
});

<MyInputComponent
    value={parcel.value}
    onChange={parcel.onChange}
/>

```

<Box modifier="margin">
    <Message>See also:
        <Text element="div">- <Link href="#onChangeDOM">onChangeDOM</Link> for use with HTML inputs</Text>
        <Text element="div">- <Link href="#spread">spread</Link> for convenient spreading of value and onChange onto an input</Text>
    </Message>
</Box>
