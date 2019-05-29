// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_ParcelBoundaryHoc from 'docs/api/parcelBoundaryHoc/ParcelBoundaryHoc.md';
import Markdown_name from 'docs/api/parcelBoundaryHoc/name.md';
import Markdown_debounce from 'docs/api/parcelBoundaryHoc/debounce.md';
import Markdown_hold from 'docs/api/parcelBoundaryHoc/hold.md';
import Markdown_modifyBeforeUpdate from 'docs/api/parcelBoundaryHoc/modifyBeforeUpdate.md';
import Markdown_childName from 'docs/api/parcelBoundaryHoc/childName.md';
import Markdown_childNameControl from 'docs/api/parcelBoundaryHoc/childNameControl.md';
import Layout from 'layout/Layout';

const md = {
    _desc: Markdown_ParcelBoundaryHoc,
    name: Markdown_name,
    debounce: Markdown_debounce,
    hold: Markdown_hold,
    modifyBeforeUpdate: Markdown_modifyBeforeUpdate,
    ['${name}']: Markdown_childName,
    ['${name}Control']: Markdown_childNameControl
}

const api = `
# Config
name
debounce
hold
modifyBeforeUpdate

# Child props
$\{name\}
$\{name\}Control
`;

export default () => <Layout>
    <ApiPage
        name="ParcelBoundaryHoc"
        api={api}
        md={md}
    />
</Layout>
