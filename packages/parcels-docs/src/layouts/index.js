// @flow
import type {Node} from "react";

import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import {Wrapper} from 'dcme-style';
import {Grid, GridItem, Head} from 'dcme-style';

import "./index.scss";

type Props = {
    children: *,
    data: *
};

export default (props: Props): Node => {
    const {
        children
    } = props;

    const {allSitePage} = props.data;
    return <div>
        <Helmet
            title="Parcels"
            meta={[
                //{name: "description", content: "Sample"},
                //{name: "keywords", content: "sample, something"}
            ]}
        />
        <Head />
        <Wrapper>{children()}</Wrapper>
    </div>;
};

// $FlowFixMe
export const query = graphql`
    query NavigationQuery {
      allSitePage {
        edges {
          node {
            id
            path
          }
        }
      }
    }
`;
