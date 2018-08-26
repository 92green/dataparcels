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

# Composition methods
pipe()

# Change methods
onChange()
onChangeDOM()
setSelf()
updateSelf()
setMeta()
updateMeta()
setChangeRequestMeta()
dispatch()
batch()
ping()

# Parent get methods
get()
getIn()
toObject()
toArray()
has()
size()

# Parent change methods
set()
setIn()
update()
updateIn()

# Indexed change methods
delete()
insertAfter()
insertBefore()
push()
pop()
shift()
swap()
swapNext()
swapPrev()
unshift()

# Child change methods
deleteSelf()

# Element change methods
insertAfterSelf()
insertBeforeSelf()
swapWithSelf()
swapNextWithSelf()
swapPrevWithSelf()

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

`;

export default () => <Class
    name="Parcel"
    api={api}
    md={md}
/>;
