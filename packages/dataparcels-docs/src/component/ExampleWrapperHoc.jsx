// @flow

import type {ComponentType} from 'react';
import type {LayoutElement} from 'dcme-style';
import type {Node} from 'react';

import filter from 'unmutable/lib/filter';
import map from 'unmutable/lib/map';
import toArray from 'unmutable/lib/toArray';
import pipeWith from 'unmutable/lib/util/pipeWith';

import React from 'react';
import {Box, Grid, GridItem, Layout, Terminal, Text, Typography} from 'dcme-style';

type Config = {
    title: string
};

type Props = {};

type LayoutProps = {
    title: LayoutElement,
    content: LayoutElement,
};

export default ({title}: Config) => (Component: ComponentType<*>) => class ExampleWrapper extends Layout<Props> {
    static elements = ['title', 'content'];

    static layout = ({title, content}) => <Box>
        <Box modifier="exampleInner">
            <Grid>
                <GridItem modifier="6 padding">
                    {title()}
                    {content()}
                </GridItem>
                <GridItem modifier="6 padding" />
            </Grid>
        </Box>
    </Box>;

    title = (): Node => {
        return <Text element="h3" modifier="monospace weightKilo">{title}</Text>;
    };

    content = (): Node => {
        return <Typography>
            <Component {...this.props} />
        </Typography>;
    };
};
