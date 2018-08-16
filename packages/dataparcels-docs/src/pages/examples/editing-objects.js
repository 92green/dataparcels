// @flow
import type {Node} from 'react';
import React from 'react';
import {Wrapper, Text, Typography} from 'dcme-style';
import Markdown from 'pages/examples/editing-objects.md';

export default () => <Wrapper modifier="medium">
    <Typography>
        <Text element="h1" modifier="sizeGiga marginGiga">Editing Objects</Text>
        <Markdown />
    </Typography>
</Wrapper>;
