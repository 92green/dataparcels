// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_CancelActionMarker from 'docs/api/cancelActionMarker/CancelActionMarker.md';

const md = {
    _desc: Markdown_CancelActionMarker
}

const api = ``;

export default () => <ApiPage
    name="CancelActionMarker"
    api={api}
    md={md}
/>;
