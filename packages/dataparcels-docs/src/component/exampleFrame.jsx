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

type Props = {};

type LayoutProps = {
    demo: LayoutElement,
    data: LayoutElement,
};

const stringify = (value) => {
    let replacer = (key, value) => {
        // The following works because NaN is the only value in javascript which is not equal to itself.
        if(value !== value) {
            return 'NaN';
        }
        return value;
    };
    return JSON.stringify(value, replacer, 4);
};

class ExampleFrame extends Layout<Props> {
    static elements = ['demo', 'data'];

    static layout = ({demo, data}) => <Box modifier="paddingBottomKilo example">
        <Box modifier="exampleInner">
            <Grid>
                <GridItem modifier="6 padding">
                    {demo()}
                </GridItem>
                <GridItem modifier="6 padding">
                    {data()}
                </GridItem>
            </Grid>
        </Box>
    </Box>;

    demo = (): Node => {
        return this.props.children;
    };

    data = (): Node => {
        return pipeWith(
            this.props.parcels,
            map((parcel, key) => <Box key={key}>
                <Text element="div" modifier="monospace">{key}</Text>
                <Terminal>{stringify(parcel.value)}</Terminal>
            </Box>),
            toArray()
        );
    };
};

export default (parcels: Object, children) => {
    return <ExampleFrame
        parcels={parcels}
        children={children}
    />;
};
