// @flow
import React from 'react';
import {Text} from 'dcme-style/affordance';
import {Box} from 'dcme-style/layout';

type Props = {
    default?: string,
    name: string,
    optional?: boolean,
    type: string
};

export default (props: Props) => {
    let {default: def, name, optional, type} = props;
    return <Box mb={3}>
        <Text textStyle="h4">{name}</Text> <Text textStyle="codeType">{optional ? "?" : ""}: {type} {def ? `= ${def}` : ""}</Text>
    </Box>;
};
