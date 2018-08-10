// @flow
import type {Node} from 'react';
import React from 'react';
import {Wrapper, Text, Typography} from 'dcme-style';
import GettingStartedMarkdown from 'pages/getting-started.md';

export default () => <Wrapper modifier="medium">
    <Typography>
        <GettingStartedMarkdown />
    </Typography>
</Wrapper>;
