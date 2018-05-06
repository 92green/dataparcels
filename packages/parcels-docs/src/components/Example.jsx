// @flow
import React from 'react';
import type {Node} from 'react';
import {Box, Column, Grid, Terminal, Text} from 'obtuse';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import Link from 'gatsby-link';

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
        exampleProps,
        state,
        title
    } = props;

    // const cleanedSource = source && source
    //     .replace(/{?\/\*nosrc\*\/}?([\s\S]*?){?\/\*endnosrc\*\/}?\n?/gi, '')
    //     .replace(/ className=".*?"/gi, '');

    let {
        next,
        previous
    } = exampleProps.pathContext;

    return <div className="Example">
        <div className="Example_prev">
            {previous && <Link className="Button" to={previous}>{"<"} Prev</Link>}
        </div>
        <div className="Example_content">
            <Text element="h2" modifier="sizeGiga marginGiga">{title}</Text>
            {description && <Box modifier="marginBottomKilo">{description}</Box>}
            <Box modifier="marginRowKilo">
                <Grid>
                    <Column modifier="6 padding">
                        {children}
                    </Column>
                    <Column modifier="6 padding">
                        {state &&
                            <Box modifier="marginBottom">
                                <Text element="h3" modifier="strong marginMilli">State</Text>
                                <Terminal>
                                    <pre>{printState(state)}</pre>
                                </Terminal>
                            </Box>
                        }
                    </Column>
                </Grid>
            </Box>
            {/*cleanedSource &&
                <Box>
                    <Text element="h3" modifier="strong marginMilli">Example code</Text>
                    <Terminal modifier="code prism">
                        <pre dangerouslySetInnerHTML={{__html: Prism.highlight(cleanedSource, Prism.languages.jsx)}}/>
                    </Terminal>
                </Box>
            */}
        </div>
        <div className="Example_next">
            {next && <Link className="Button" to={next}>Next {">"}</Link>}
        </div>
    </div>
}
