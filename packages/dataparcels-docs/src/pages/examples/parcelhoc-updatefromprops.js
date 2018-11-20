// @flow
import React from 'react';
import Markdown from 'pages/examples/parcelhoc-updatefromprops.md';
import Example from 'component/Example';

export default ({history, location}: *) => {
    return <Example
        name="ParcelHoc updating from props"
        md={Markdown}
        history={history}
        location={location}
    />;
};
