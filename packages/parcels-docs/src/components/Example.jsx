// @flow
import React from 'react';
import type {ComponentType, Element, Node} from 'react';
import {Box, Column, Grid, Terminal, Text} from 'obtuse';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import Link from 'gatsby-link';
//import Markdown from './Markdown';

const printParcelState = (parcel) => {
    const parcelContents = JSON.stringify({parcel: parcel.data()}, null, 4);
    return parcelContents.replace(`"parcel": {`, `"parcel": Parcel {`);
};

type ExampleProps = {
    children?: *,
    description?: Node,
    source?: string,
    parcelState?: Object
};

const Example = (props: ExampleProps): Node => {
    const {
        children,
        description,
        //exampleProps,
        parcelState
    } = props;

    // const cleanedSource = source && source
    //     .replace(/{?\/\*nosrc\*\/}?([\s\S]*?){?\/\*endnosrc\*\/}?\n?/gi, '')
    //     .replace(/ className=".*?"/gi, '');

    let {
        next,
        previous
    } = {}; //exampleProps.pathContext;

    return <div className="Example">
        <div className="Example_prev">
            {previous && <Link className="Button" to={previous}>{"<"} Prev</Link>}
        </div>
        <div className="Example_content">
            {/*description && <Markdown data={description} />*/}
            <Box modifier="marginRowKilo">
                <Grid>
                    <Column modifier="6 padding">
                        {children}
                    </Column>
                    <Column modifier="6 padding">
                        {parcelState &&
                            <Box modifier="marginBottom">
                                <Text element="h3" modifier="strong marginMilli">State</Text>
                                <Terminal>
                                    <pre>{printParcelState(parcelState)}</pre>
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

export default (component: Object, copy: Object, rendered: Element<*>): Element<*> => {
    return <Example
        children={rendered}
        description={copy}
        parcelState={component.state.parcel}
    />;
};