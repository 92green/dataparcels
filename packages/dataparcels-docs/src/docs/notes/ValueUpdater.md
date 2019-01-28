import Link from 'component/Link';
import {Box, Link as HtmlLink, Message} from 'dcme-style';
prop alt

#### Limitations

This method accepts a **value updater**. Value updaters are great for updating primitive data types and data types that have no children, but cannot be used to update the *shape* of the data.

When a value updater receives a collection, it must either pass it through unchanged, or turn it into a data type that has no children.

If you need to update the shape of the data, consider using <HtmlLink href={`#${alt}`} children={`${alt}()`} />.

<Box modifier="margin">
    <Message>See <Link to="/modifiers-and-updaters">modifiers and updaters</Link> for more info and explanations.</Message>
</Box>
