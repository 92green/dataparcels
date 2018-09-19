// @flow
import React from 'react';
import {Image} from 'dcme-style';

type Props = {
    children: Node
};

export default ({children} :Props) => <Image src={children} modifier="apiPageIcon" />;
