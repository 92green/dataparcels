// @flow
import React from "react";
import {Box, Text} from 'dcme-style';

type FunctionProps = {
    children: *,
    name: string
};

export const Function = ({children, name}: FunctionProps) => <Box modifier="marginBottomMega">
    <a name={name} />
    <Text element="h2" modifier="sizeKilo marginKilo">{name}()</Text>
    {children}
</Box>
