// @flow
import React from "react";
import type {Node} from "react";
import Index, {query as indexQuery} from './index';

export default (props: Object): Node => {
    return <Index {...props} wrapper={false} />;
}

export const query = graphql`
    query NavigationQueryExample {
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