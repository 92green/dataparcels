// @flow
import React from "react";
import type {Node} from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import Navigation from '../components/Navigation';

import "./index.scss";

function TemplateWrapper(props: Object): Node {
    const {allSitePage} = props.data;
    return <div>
        <Helmet
            title="Parcels"
            meta={[
                //{name: "description", content: "Sample"},
                //{name: "keywords", content: "sample, something"}
            ]}
        />
        <Navigation allSitePage={allSitePage}/>
        {props.children()}
    </div>;
}


export const query = graphql`
    query NavigationQueryFullwidth {
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

TemplateWrapper.propTypes = {
    children: PropTypes.func
};

export default TemplateWrapper;
