// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_Validation from 'docs/api/validation/Validation.md';
import Markdown_ValidationMap from 'docs/api/validation/ValidationMap.md';
import Markdown_ValidationResult from 'docs/api/validation/ValidationResult.md';

const md = {
    _desc: Markdown_Validation,
    ValidationMap: Markdown_ValidationMap,
    ValidationResult: Markdown_ValidationResult,
}

const api = `
# Arguments
ValidationMap

# Return
ValidationResult
`;

export default () => <ApiPage
    name="Validation"
    api={api}
    md={md}
/>;
