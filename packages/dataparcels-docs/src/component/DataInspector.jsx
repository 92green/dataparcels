// @flow
import type {Node} from 'react';

import React from 'react';
import {Terminal} from 'dcme-style';

type Props = {
    data: any
};

export default class DataInspector extends React.Component<Props> {
    render(): Node {
        return <Terminal><pre>{JSON.stringify(this.props.data, null, 4)}</pre></Terminal>
    }
}
