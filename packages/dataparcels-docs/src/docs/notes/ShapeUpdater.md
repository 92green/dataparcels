import Link from 'component/Link';
import {Box, Link as HtmlLink, Message} from 'dcme-style';
prop alt

#### Limitations

This method accepts a **shape updater**. Shape updaters are designed to allow collections with deep values to be altered, while also allowing Dataparcels to internally keep track of the changes that are made.

Consider using <HtmlLink href={`#${alt}`} children={`${alt}()`} /> for simple changes that don't require the shape of the data to be changed.

<Box modifier="margin">
    <Message>See <Link to="/modifiers-and-updaters">modifiers and updaters</Link> for more info and explanations.</Message>
</Box>
