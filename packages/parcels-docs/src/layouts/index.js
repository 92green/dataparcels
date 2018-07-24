// @flow
import type {Node} from "react";

import React from "react";
import Helmet from "react-helmet";
import {Head, Wrapper} from 'dcme-style';

import "./index.scss";

type Props = {
    children: *
};

export default ({children}: Props): Node => <div>
    <Helmet
        title="Dataparcels"
        meta={[
            {name: "description", content: "A super declarative user input library that works really well with React."}
        ]}
    />
    <Head />
    <Wrapper>{children()}</Wrapper>
</div>;
