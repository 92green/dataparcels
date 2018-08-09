// @flow

import type {ComponentType} from 'react';
import type {LayoutElement} from 'dcme-style';
import type {Node} from 'react';

import React from 'react';
import {Box, Grid, GridItem, Layout, Terminal} from 'dcme-style';

type Props = {};

type LayoutProps = {
    demo: LayoutElement,
    data: LayoutElement,
};

export default (Component: ComponentType<*>) => class Example extends Layout<Props> {
    static elements = ['demo', 'data'];

    static layout = ({demo, data}) => <Box>
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
        return <Terminal>{JSON.stringify(this.props.personParcel.value(), null, 4)}</Terminal>;
    };
};
