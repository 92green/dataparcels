// @flow
import type {Node} from 'react';
import type {ComponentType} from 'react';
import type {LayoutElement} from 'dcme-style';

import React from 'react';

import {Box, Grid, GridItem, Layout, Terminal, Text} from 'dcme-style';
import ClientServer from 'examples/ClientServer';

type Props = {};

export default class ClientServerPage extends Layout<Props> {
    static elements = ['title', 'content'];

    static layout = ({title, content}) => <Box modifier="padding">
        {title()}
        {content()}
    </Box>;

    title = (): Node => {
        return <Text element="h1" modifier="sizeGiga">Client Server</Text>;
    };

    content = (): Node => {
        return <ClientServer />;
    };
};
