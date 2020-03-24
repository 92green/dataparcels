// @flow
import type {Node} from 'react';
import React from 'react';

import {Box} from 'dcme-style/layout';
import {Flex} from 'dcme-style/layout';
import {Link} from 'dcme-style/affordance';
import {Text} from 'dcme-style/affordance';

export const Concepts = (): Node => {
    return <Flex flexWrap="wrap" justifyContent="space-between">
        <Box>
            <Text as="div" textStyle="monospace"><Link to="/concepts/parcel-keys">Parcel keys</Link></Text>
            <Text as="div" textStyle="monospace"><Link to="/concepts/parcel-meta">Parcel meta</Link></Text>
            <Text as="div" textStyle="monospace"><Link to="/concepts/parcel-types">Parcel types</Link></Text>
            <Text as="div" textStyle="monospace"><Link to="/concepts/parcel-updaters">Parcel updaters</Link></Text>
        </Box>
    </Flex>;
};
