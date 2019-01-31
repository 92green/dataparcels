import {Box, Link, Message, Text} from 'dcme-style';

```flow
onChangeDOM(event: HTMLEvent): void
```

This is designed for use with HTML inputs.
It triggers a change that replaces the current value in the Parcel with the `value` of the event provided.

If called on a ParentParcel, any child information that the Parcel had is removed, such as child keys or meta.

```js
let parcel = new Parcel({
    value: 123
});

<input
    value={parcel.value}
    onChangeDOM={parcel.onChangeDOM}
/>

```

<Box modifier="margin">
    <Message>See also:
        <Text element="div">- <Link href="#onChangeDOM">onChangeDOM</Link> for use with input components that call `onChange` with a new value.</Text>
        <Text element="div">- <Link href="#spread">spreadDOM</Link> for convenient spreading of value and onChange onto an input</Text>
    </Message>
</Box>
