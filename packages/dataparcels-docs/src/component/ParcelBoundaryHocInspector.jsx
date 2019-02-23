// @flow

import type {ComponentType} from 'react';
import type {LayoutElement} from 'dcme-style';
import type {Node} from 'react';

import filter from 'unmutable/lib/filter';
import map from 'unmutable/lib/map';
import toArray from 'unmutable/lib/toArray';
import pipeWith from 'unmutable/lib/util/pipeWith';

import React from 'react';
import {Box, Grid, GridItem, Layout, Terminal, Text} from 'dcme-style';

type Config = {
    name: string
};

type Props = {};

type LayoutProps = {
    state: LayoutElement,
    buffer: LayoutElement,
    content: LayoutElement
};

export default ({name}: Config) => (Component: ComponentType<*>) => class ParcelBoundaryHocInspector extends Layout<Props> {
    static elements = ['content', 'state', 'buffer'];

    static layout = ({title, state, content, buffer}) => <Box>
        <Box modifier="paddingBottom">
            <Box modifier="exampleInner">
                <Grid>
                    <GridItem modifier="6 padding">
                        {state()}
                    </GridItem>
                    <GridItem modifier="6 padding">
                        {buffer()}
                    </GridItem>
                </Grid>
            </Box>
        </Box>
        {content()}
    </Box>;

    state = (): Node => {
        return <Box>
            <Text element="div" modifier="monospace"><Text modifier="weightKilo">ParcelBoundaryHoc</Text> - parcel state</Text>
            <Terminal><pre>{JSON.stringify(this.props[name].value, null, 4)}</pre></Terminal>
        </Box>;
    };

    buffer = (): Node => {
        let {buffer} = this.props[`${name}Control`];
        let text = buffer
            .map(({type, keyPath, payload}) => {
                return `${type} ${keyPath.join(".")}: \n  ` + JSON.stringify(payload);
            })
            .join("\n");

        return <Box>
            <Text element="div" modifier="monospace">action buffer ({buffer.length})</Text>
            <Terminal style={{height: '16rem', overflow: 'auto'}}><pre>{text}</pre></Terminal>
        </Box>;
    };

    content = (): Node => {
        return <Component {...this.props} />;
    };
};
