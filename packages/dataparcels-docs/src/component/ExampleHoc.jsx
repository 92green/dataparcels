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

export default (Component: ComponentType<*>) => class Example extends Layout<Props> {
    static elements = ['demo', 'data'];

    static layout = ({demo, data}) => <Box modifier="paddingRowKilo">
        <Grid>
            <GridItem modifier="6 padding">
                {demo()}
            </GridItem>
            <GridItem modifier="6 padding">
                {data()}
            </GridItem>
        </Grid>
    </Box>;

    demo = (): Node => {
        return <Component {...this.props} />;
    };

    data = (): Node => {
        return pipeWith(
            this.props,
            filter((value, key) => key.substr(-6) === "Parcel"),
            map((parcel, key) => <Box key={key}>
                <Text element="div" modifier="monospace">{key}</Text>
                <Terminal>{JSON.stringify(parcel.value, null, 4)}</Terminal>
            </Box>),
            toArray()
        );
    };
};
