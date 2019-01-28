import Link from 'component/Link';
import ShapeUpdater from 'docs/notes/ShapeUpdater.md';
import {Box, Link as HtmlLink, Message} from 'dcme-style';

```flow
updateShapeIn(keyPath: Array<string|number>, updater: ShapeUpdater): void // only on ParentParcels

type ShapeUpdater = (parcelShape: ParcelShape) => any
```

The `updateShapeIn()` method is an advanced version of <HtmlLink href="#updateIn">updateIn()</HtmlLink>. It provides a <Link to="/api/ParcelShape">ParcelShape</Link> containing the value to update. It expects either a ParcelShape or a value to be returned. If a value is returned, and if the returned value has children, then those children *must* all be ParcelShapes.

<ShapeUpdater alt="updateIn" />
