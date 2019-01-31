import Link from 'component/Link';
import ShapeUpdater from 'docs/notes/ShapeUpdater.md';
import {Box, Link as HtmlLink, Message} from 'dcme-style';

```flow
updateShape(updater: ShapeUpdater): void
updateShape(key: string|number, updater: ShapeUpdater): void // only on ParentParcels, will set a child

type ShapeUpdater = (parcelShape: ParcelShape) => any
```

The `updateShape()` method is an advanced version of <HtmlLink href="#update">update()</HtmlLink>. It provides a <Link to="/api/ParcelShape">ParcelShape</Link> containing the value to update. It expects either a ParcelShape or a value to be returned. If a value is returned, and if the returned value has children, then those children *must* all be ParcelShapes.

<ShapeUpdater alt="update" />
