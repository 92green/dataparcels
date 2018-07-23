// @flow
import React from 'react';
import type {ComponentType, Element, Node} from 'react';
import {Box, Column, Grid, Tab, TabSet, Terminal, Text} from 'dcme-style';
import Prism from 'prismjs';
import 'prismjs/components/prism-jsx';
import Link from 'gatsby-link';
import Parcel from 'parcels';
import QueryStringHock from 'stampy/lib/hock/QueryStringHock';

import filter from 'unmutable/lib/filter';
import keyArray from 'unmutable/lib/keyArray';
import map from 'unmutable/lib/map';
import pipeWith from 'unmutable/lib/util/pipeWith';

const printParcelState = (state) => {
    return pipeWith(
        state,
        map(ii => ii instanceof Parcel ? ii.data() : ii),
        state => JSON.stringify(state, null, 4),
        ...pipeWith(
            state,
            filter(ii => ii instanceof Parcel),
            keyArray(),
            map(key => (ii) => ii.replace(`"${key}": {`, `"${key}": Parcel {`))
        )
    );
};

type ExampleProps = {
    children?: *,
    description?: Node,
    source?: string,
    state?: Object
};

const Example = (props: ExampleProps): Node => {
    const {
        children,
        description,
        state,
        pathContext: {
            next,
            previous
        },
        query,
        updateQuery
    } = props;

    // const cleanedSource = source && source
    //     .replace(/{?\/\*nosrc\*\/}?([\s\S]*?){?\/\*endnosrc\*\/}?\n?/gi, '')
    //     .replace(/ className=".*?"/gi, '');

    return <div className="Example">
        <div className="Example_prev">
            {previous && <Link className="Button" to={previous}>{"<"} Prev</Link>}
        </div>
        <div className="Example_content">
            {description}
            <Box modifier="marginRowKilo">
                <Grid>
                    <Column modifier="6 padding">
                        {children}
                    </Column>
                    <Column modifier="6 padding">
                        {/*<TabSet>
                            <Tab onClick>State</Tab>
                            <Tab onClick>Source</Tab>
                            <Tab onClick>Logs</Tab>
                            <Tab onClick>Tree</Tab>
                        </TabSet>*/}
                        {state &&
                            <Box modifier="marginBottom">
                                <Text element="h3" modifier="strong marginMilli">State</Text>
                                <Terminal>
                                    <pre>{printParcelState(state)}</pre>
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

const ExampleWithQuery = QueryStringHock()(Example);

export default (component: Object, copy: Object, rendered: Element<*>): Element<*> => {
    return <ExampleWithQuery
        children={rendered}
        description={copy}
        state={component.state}
        {...component.props}
    />;
};
