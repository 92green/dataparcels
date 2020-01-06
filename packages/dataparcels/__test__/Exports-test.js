// @flow

// exports
import Parcel from '../src/index';
import Action from '../Action';
import ChangeRequest from '../ChangeRequest';
import asRaw from '../asRaw';
import deleted from '../deleted';
import ParcelNode from '../ParcelNode';
import asNode from '../asNode';
import asChildNodes from '../asChildNodes';
import cancel from '../cancel';
import translate from '../translate';
import validation from '../validation';

// internal files
import InternalParcel from '../src/parcel/Parcel';

// internal lib files
import InternalAction from '../lib/change/Action';
import InternalChangeRequest from '../lib/change/ChangeRequest';
import InternalUpdateRaw from '../lib/parcelData/asRaw';
import Internaldeleted from '../lib/parcelData/deleted';
import InternalParcelNode from '../lib/parcelNode/ParcelNode';
import InternalAsNode from '../lib/parcelNode/asNode';
import InternalAsNodes from '../lib/parcelNode/asChildNodes';
import Internalcancel from '../lib/change/cancel';
import InternalTranslate from '../lib/modifiers/translate';
import InternalValidation from '../lib/validation/validation';

test('index should export Parcel', () => {
    expect(Parcel).toBe(InternalParcel);
});

test('/Action should export Action', () => {
    expect(Action).toBe(InternalAction);
});

test('/ChangeRequest should export ChangeRequest', () => {
    expect(ChangeRequest).toBe(InternalChangeRequest);
});

test('/asRaw should export asRaw', () => {
    expect(asRaw).toBe(InternalUpdateRaw);
});

test('/deleted should export deleted', () => {
    expect(deleted).toBe(Internaldeleted);
});

test('/ParcelNode should export ParcelNode', () => {
    expect(ParcelNode).toBe(InternalParcelNode);
});

test('/asNode should export asNode', () => {
    expect(asNode).toBe(InternalAsNode);
});

test('/asChildNodes should export asChildNodes', () => {
    expect(asChildNodes).toBe(InternalAsNodes);
});

test('/cancel should export cancel', () => {
    expect(cancel).toBe(Internalcancel);
});

test('/translate should export translate', () => {
    expect(translate).toBe(InternalTranslate);
});

test('/validation should export validation', () => {
    expect(validation).toBe(InternalValidation);
});
