// @flow
import type {Node} from 'react';
import React from 'react';

import {Box} from 'dcme-style/layout';
import {Flex} from 'dcme-style/layout';
import {Link} from 'dcme-style/affordance';
import {Text} from 'dcme-style/affordance';

export const Api = (): Node => {
    return <Flex flexWrap="wrap" justifyContent="space-between">
        <Box pr={3} pb={4} width={[1,1/2,1/3,1/4]} minWidth="10rem">
            <Box mb={2}>
                <Text textStyle="s1">Hooks</Text>
            </Box>
            <Text as="div" textStyle="monospace"><Link to="/api/useParcel">useParcel</Link></Text>
            <Text as="div" textStyle="monospace"><Link to="/api/useBuffer">useBuffer</Link></Text>
        </Box>
        <Box pr={3} pb={4} width={[1,1/2,1/3,1/4]} minWidth="10rem">
            <Box mb={2}>
                <Text textStyle="s1">Classes</Text>
            </Box>
            <Text as="div" textStyle="monospace"><Link to="/api/Parcel">Parcel</Link></Text>
            <Text as="div" textStyle="monospace"><Link to="/api/ChangeRequest">ChangeRequest</Link></Text>
        </Box>
        <Box pr={3} pb={4} width={[1,1/2,1/3,1/4]} minWidth="10rem">
            <Box mb={2}>
                <Text textStyle="s1">Components</Text>
            </Box>
            <Text as="div" textStyle="monospace"><Link to="/api/Boundary">Boundary</Link></Text>
            <Text as="div" textStyle="monospace"><Link to="/api/Drag">Drag</Link></Text>
        </Box>
        <Box pr={3} pb={4} width={[1,1/2,1/3,1/4]} minWidth="10rem">
            <Box mb={2}>
                <Text textStyle="s1">Plugins & utils</Text>
            </Box>
            <Text as="div" textStyle="monospace"><Link to="/api/cancel">cancel</Link></Text>
            <Text as="div" textStyle="monospace"><Link to="/api/combine">combine</Link></Text>
            <Text as="div" textStyle="monospace"><Link to="/api/promisify">promisify</Link></Text>
            <Text as="div" textStyle="monospace"><Link to="/api/translate">translate</Link></Text>
        </Box>
    </Flex>;
};
