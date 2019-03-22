// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_shape from 'docs/api/shape/shape.md';

const md = {
    _desc: Markdown_shape
}

const api = ``;

export default () => <ApiPage
    name="shape"
    api={api}
    md={md}
/>;
