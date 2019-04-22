// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_ParcelBoundaryHoc from 'docs/api/parcelBoundaryHoc/ParcelBoundaryHoc.md';
import Markdown_name from 'docs/api/parcelBoundaryHoc/name.md';
import Markdown_debounce from 'docs/api/parcelBoundaryHoc/debounce.md';
import Markdown_hold from 'docs/api/parcelBoundaryHoc/hold.md';
import Markdown_modifyBeforeUpdate from 'docs/api/parcelBoundaryHoc/modifyBeforeUpdate.md';
import Markdown_debugBuffer from 'docs/api/parcelBoundaryHoc/debugBuffer.md';
import Markdown_debugParcel from 'docs/api/parcelBoundaryHoc/debugParcel.md';
import Markdown_onCancel from 'docs/api/parcelBoundaryHoc/onCancel.md';
import Markdown_onRelease from 'docs/api/parcelBoundaryHoc/onRelease.md';
import Markdown_childName from 'docs/api/parcelBoundaryHoc/childName.md';
import Markdown_childNameControl from 'docs/api/parcelBoundaryHoc/childNameControl.md';
import Layout from 'layouts/Layout';

const md = {
    _desc: Markdown_ParcelBoundaryHoc,
    name: Markdown_name,
    debounce: Markdown_debounce,
    hold: Markdown_hold,
    modifyBeforeUpdate: Markdown_modifyBeforeUpdate,
    debugBuffer: Markdown_debugBuffer,
    debugParcel: Markdown_debugParcel,
    onCancel: Markdown_onCancel,
    onRelease: Markdown_onRelease,
    ['${name}']: Markdown_childName,
    ['${name}Control']: Markdown_childNameControl
}

const api = `
# Config
name
debounce
hold
modifyBeforeUpdate
onCancel
onRelease
debugBuffer
debugParcel

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
