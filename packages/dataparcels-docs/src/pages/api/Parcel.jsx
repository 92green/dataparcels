// @flow
import type {Node} from 'react';
import React from 'react';
import Class from 'component/Class';
import Markdown_Parcel from 'docs/api/parcel/Parcel.md';
import Markdown_value from 'docs/api/parcel/value.md';
import Markdown_meta from 'docs/api/parcel/meta.md';
import Markdown_data from 'docs/api/parcel/data.md';
import Markdown_key from 'docs/api/parcel/key.md';
import Markdown_id from 'docs/api/parcel/id.md';
import Markdown_path from 'docs/api/parcel/path.md';
import Markdown_get from 'docs/api/parcel/get.md';

const md = {
    _desc: Markdown_Parcel,
    value: Markdown_value,
    meta: Markdown_meta,
    get: Markdown_get,
    key: Markdown_key,
    id: Markdown_id,
    path: Markdown_path,
    data: Markdown_data
}

const api = `
# Properties
value
meta
data
key
id
path

# Spread methods
spread()
spreadDOM()

# Branch methods
get()
getIn()
toObject()
toArray()

# Parent methods
has()
size()

# Change methods
onChange()
onChangeDOM()
set()
setIn()
update()
updateIn()
delete()

# Advanced change methods
setMeta()
updateMeta()
setChangeRequestMeta()
dispatch()
batch()
ping()

# Indexed & element change methods
insertAfter()
insertBefore()
push()
pop()
shift()
swap()
swapNext()
swapPrev()
unshift()

# Modify methods
modifyValue()
modifyChange()
modifyChangeValue()
initialMeta()
addModifier()
addDescendantModifier()

# Type methods
isChild()
isElement()
isIndexed()
isParent()
isTopLevel()

# Status methods
hasDispatched()

# Composition methods
pipe()

`;

export default () => <Class
    name="Parcel"
    api={api}
    md={md}
/>;
