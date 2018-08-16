// @flow
import type {Node} from 'react';
import React from 'react';
import {Wrapper, Text, Typography} from 'dcme-style';
import Markdown from 'pages/examples/managing-your-own-parcel-state.md';

export default () => <Wrapper modifier="medium">
    <Typography>
        <Markdown />
    </Typography>
</Wrapper>;
