import {Box, Link, Message, Text} from 'dcme-style';

```flow
onChangeDOMCheckbox(event: HTMLEvent): void
```

This is designed for use with HTML checkboxes.
It triggers a change that replaces the current value in the Parcel with the checked state of the checkbox.

```js
let parcel = new Parcel({
    value: false
});

<input
    type="checkbox"
    value={parcel.value}
    onChangeDOMCheckbox={parcel.onChangeDOMCheckbox}
/>

```

<Box modifier="margin">
    <Message>See also:
        <Text element="div">- <Link href="#spreadDOMCheckbox">spreadDOMCheckbox</Link> for convenient spreading of value and onChange onto an input</Text>
        <Text element="div">- <Link href="#onChangeDOM">onChangeDOM</Link> for use with input components that call `onChange` with a new value.</Text>
    </Message>
</Box>
