// @flow
import type {Node} from 'react';
import React from 'react';
import {Wrapper, Text, Typography} from 'dcme-style';
import Markdown from 'pages/examples/editing-arrays.md';

export default () => <Wrapper modifier="medium">
    <Typography>
        <Markdown />
    </Typography>
</Wrapper>;
