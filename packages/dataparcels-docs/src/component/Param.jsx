// @flow
import React from "react";
import {Box, Text} from 'dcme-style';

type Props = {
    default?: string,
    name: string,
    optional?: boolean,
    type: string
};

export default ({default: def, name, optional, type}: Props) => <Text element="div" modifier="margin">
    <Text modifier="sizeHecto">{name}</Text> <Text modifier="codeClear primary">{optional ? "?" : ""}: {type} {def ? `= ${def}` : ""}</Text>
</Text>;
