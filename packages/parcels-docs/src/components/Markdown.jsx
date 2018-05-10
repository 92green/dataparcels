import React from 'react';
import Remarkable from 'remarkable';
import RemarkableReactRenderer from 'remarkable-react';
import map from 'unmutable/lib/map';

import {
    Box,
    Code,
    // Image,
    // Link,
    // List,
    // ListItem,
    // Table,
    // TableCell,
    // TableBody,
    // TableHead,
    // TableHeadCell,
    // TableRow,
    Text
} from 'obtuse';

let removeOptions = map(fn => ({options, ...props}) => fn(props));

let components = {
    // a: props => <Link {...props} />,
    code: props => <Code {...props} />,
    em: props => <Text modifier="emphasis" {...props} />,
    h1: props => <Text element="h1" modifier="sizeGiga marginGiga" {...props} />,
    h2: props => <Text element="h2" modifier="sizeMega marginMega" {...props} />,
    h3: props => <Text element="h3" modifier="sizeKilo marginKilo" {...props} />,
    h4: props => <Text element="h4" modifier="sizeHecto marginHecto" {...props} />,
    // img: ({src, ...props}) => <Image modifier="center margin content" {...props} />,
    // li: props => <ListItem modifier="bullet margin" {...props} />,
    // ol: props => <List modifier="padding" {...props} />,
    p: props => <Text element="div" modifier="margin" {...props} />,
    strong: props => <Text modifier="strong" {...props} />
    // table: props => <Table {...props} />,
    // tbody: props => <TableBody {...props} />,
    // td: props => <TableCell {...props} />,
    // th: props => <TableHeadCell {...props} />,
    // thead: props => <TableHead {...props} />,
    // tr: props => <TableRow {...props} />,
    // ul: props => <List modifier="padding" {...props} />
};

const md = new Remarkable();
md.renderer = new RemarkableReactRenderer({
    components: removeOptions(components)
});

export default function Markdown({className = '', data}) {
    return <Box className={className}>
        {md.render(data)}
    </Box>
}
