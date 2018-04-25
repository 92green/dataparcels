// @flow
import React from 'react';
import type {Node} from 'react';
import {Box, Column, Grid, Terminal, Text} from 'obtuse';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';

const printState = (state) => {
    const parcelContents = JSON.stringify({parcel: state.parcel.data()}, null, 4);
    return parcelContents.replace(`"parcel": {`, `"parcel": Parcel {`);
};

type ExampleProps = {
    children?: *,
    description?: Node,
    source?: string,
    state?: Object,
    title?: string
};

export default (props: ExampleProps): Node => {
    const {
        children,
        description,
        source,
        state,
        title
    } = props;

    const cleanedSource = source && source
        .replace(/{?\/\*nosrc\*\/}?([\s\S]*?){?\/\*endnosrc\*\/}?\n?/gi, '')
        .replace(/ className=".*?"/gi, '');

    return <Box modifier="marginRowGiga">
        <Text element="h2" modifier="sizeGiga marginGiga">{title}</Text>
        {description && <Box modifier="marginBottomKilo">{description}</Box>}
        <Box modifier="marginRowKilo">
            <Grid>
                <Column modifier="6 gutter">
                    {state &&
                        <Box modifier="marginBottom">
                            <Text element="h3" modifier="strong marginMilli">State</Text>
                            <Terminal>
                                <pre>{printState(state)}</pre>
                            </Terminal>
                        </Box>
                    }
                </Column>
                <Column modifier="6 gutter">
                    {children}
                </Column>
            </Grid>
        </Box>
        {cleanedSource &&
            <Box>
                <Text element="h3" modifier="strong marginMilli">Example code</Text>
                <Terminal modifier="code prism">
                    <pre dangerouslySetInnerHTML={{__html: Prism.highlight(cleanedSource, Prism.languages.jsx)}}/>
                </Terminal>
            </Box>
        }
    </Box>
}
