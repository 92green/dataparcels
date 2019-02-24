// @flow

import type {ComponentType} from 'react';
import type {LayoutElement} from 'dcme-style';
import type {Node} from 'react';

import React from 'react';
import {Box, Grid, GridItem, Layout, Terminal, Text} from 'dcme-style';
import DataInspector from './DataInspector';

type Config = {
    name: string
};

type Props = {};

type LayoutProps = {
    state: LayoutElement,
    content: LayoutElement
};

export default ({name}: Config) => (Component: ComponentType<*>) => class ParcelHocInspector extends Layout<Props> {
    static elements = ['content', 'state'];

    static layout = ({title, state, content}) => <Box>
        <Box modifier="paddingBottom">
            <Box modifier="exampleInner">
                <Grid>
                    <GridItem modifier="6 padding">
                        {state()}
                    </GridItem>
                    <GridItem modifier="6 padding">
                    </GridItem>
                </Grid>
            </Box>
        </Box>
        {content()}
    </Box>;

    state = (): Node => {
        return <Box>
            <Text element="div" modifier="monospace"><Text modifier="weightKilo">ParcelHoc</Text> - parcel state</Text>
            <DataInspector data={this.props[name].value} />
        </Box>;
    };

    content = (): Node => {
        return <Component {...this.props} />;
    };
};
