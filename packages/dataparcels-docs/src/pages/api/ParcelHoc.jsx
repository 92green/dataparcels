// @flow
import type {Node} from 'react';
import React from 'react';
import ApiPage from 'component/ApiPage';
import Markdown_ParcelHoc from 'docs/api/parcelHoc/ParcelHoc.md';
import Markdown_ParcelHocAfter from 'docs/api/parcelHoc/ParcelHocAfter.md';
import Markdown_name from 'docs/api/parcelHoc/name.md';
import Markdown_shouldParcelUpdateFromProps from 'docs/api/parcelHoc/shouldParcelUpdateFromProps.md';
import Markdown_valueFromProps from 'docs/api/parcelHoc/valueFromProps.md';
import Markdown_onChange from 'docs/api/parcelHoc/onChange.md';
import Markdown_modifyBeforeUpdate from 'docs/api/parcelHoc/modifyBeforeUpdate.md';
import Markdown_delayUntil from 'docs/api/parcelHoc/delayUntil.md';
import Markdown_pipe from 'docs/api/parcelHoc/pipe.md';
import Markdown_debugParcel from 'docs/api/parcelHoc/debugParcel.md';
import Markdown_childName from 'docs/api/parcelHoc/childName.md';
import Layout from 'layouts/Layout';

const md = {
    _desc: Markdown_ParcelHoc,
    _after: Markdown_ParcelHocAfter,
    name: Markdown_name,
    valueFromProps: Markdown_valueFromProps,
    shouldParcelUpdateFromProps: Markdown_shouldParcelUpdateFromProps,
    onChange: Markdown_onChange,
    modifyBeforeUpdate: Markdown_modifyBeforeUpdate,
    delayUntil: Markdown_delayUntil,
    pipe: Markdown_pipe,
    debugParcel: Markdown_debugParcel,
    ['${name}']: Markdown_childName
}

const api = `
# Config
name
valueFromProps
shouldParcelUpdateFromProps
onChange
modifyBeforeUpdate
delayUntil
pipe
debugParcel

# Child props
$\{name\}
`;

export default () => <Layout>
    <ApiPage
        name="ParcelHoc"
        api={api}
        md={md}
    />
</Layout>
