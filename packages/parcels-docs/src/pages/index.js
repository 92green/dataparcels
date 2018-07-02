// @flow
import type {Node} from 'react';
import React from 'react';
import IndexMarkdown from 'babel-loader!mdx-loader!./index.md';

export default ({data}: *) => <IndexMarkdown data={data} />;

// $FlowFixMe - graphql prefix
export const pageQuery = graphql`
fragment ParcelNode on DocumentationJs {
  id
  name
  namespace
  memberof
  # augments {
  #   title
  #   name
  # }
  #kind
  #scope
  #fields {
  #  slug
  #  name
#
  #}
  #type {
  #  type
  #  fields {
  #    type
  #    key
  #    value {
  #      type
  #      name
  #      expression {
  #        type
  #        name
  #        elements {
  #          type
  #          name
  #          applications {
  #            type
  #            name
  #          }
  #          expression {
  #            type
  #            name
  #          }
  #        }
  #      }
  #    }
  #  }
  #  expression {
  #    type
  #    name
#
  #  }
  #  applications {
  #    type
  #  }
  #  params {
  #    type
  #    name
  #    expression {
  #      type
  #      name
  #    }
  #  }
  #  result {
  #    type
  #    name
  #    expression {
  #      type
  #      name
  #    }
  #    applications {
  #      type
  #    }
  #  }
  #}
  #properties {
  #  title
  #  name
  #  description {
  #    internal {
  #      content
  #    }
  #  }
  #  type {
  #    type
  #    name
  #    result {
  #      type
  #      name
  #    }
  #    params {
  #      type
  #      name
  #      expression {
  #        type
  #        name
  #        expression {
  #          type
  #          name
  #        }
  #        applications {
  #          type
  #        }
  #      }
  #    }
  #    applications {
  #      type
  #      name
  #    }
  #    expression {
  #      type
  #      name
  #      expression {
  #        type
  #        name
  #      }
  #      applications {
  #        type
  #        name
  #      }
  #      params {
  #        type
  #        name
  #        expression {
  #          type
  #          name
  #        }
  #      }
  #      result {
  #        type
  #        name
  #      }
  #      elements {
  #        type
  #        name
  #        expression {
  #          type
  #          name
  #        }
  #        applications {
  #          type
  #          name
  #        }
  #      }
  #    }
  #  }
  #}
  #description {
  #  childMarkdownRemark {
  #    html
  #  }
  #}
  #returns {
  #  title
  #  type {
  #    name
  #    type
  #  }
  #}
  #examples {
  #  raw
  #  highlighted
  #}
  #params {
  #  name
  #  default
  #  title
  #  name
  #  type {
  #    name
  #    type
  #    expression {
  #      type
  #      name
  #    }
  #  }
  #  properties {
  #    title
  #    name
  #    default
  #    type {
  #      type
  #    }
  #  }
  #  description {
  #    internal {
  #      content
  #    }
  #  }
  #}
}

query ParcelQuery {
  Parcel: documentationJs(fields: {name: {eq: "Parcel"}}) {
    ...ParcelNode
  }
}
`;
