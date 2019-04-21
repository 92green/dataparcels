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
        <Text element="div">- <Link href="#spreadDOM">spreadDOM</Link> for convenient spreading of value and onChangeDOM onto an input</Text>
        <Text element="div">- <Link href="#onChange">onChange</Link> for use with input components that call `onChange` with a new value.</Text>
        <Text element="div">- <Link href="#onChangeDOMCheckbox">onChangeDOMCheckbox</Link> for use with HTML checkboxes</Text>
    </Message>
</Box>
