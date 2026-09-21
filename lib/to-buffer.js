'use strict';

var Buffer = require('safe-buffer').Buffer;

var useUint8Array = typeof Uint8Array !== 'undefined';
var useArrayBuffer = useUint8Array && typeof ArrayBuffer !== 'undefined';
var isView = useArrayBuffer && ArrayBuffer.isView;

// Previously delegated to the `to-buffer` package. As of to-buffer@1.2.2 that
// copies a Buffer it is handed rather than passing it through, which breaks the
// identity this module is expected to preserve (test/to-buffer.js) and adds a
// copy of the password and salt on every derivation. Doing it here keeps the
// pass-through, and drops to-buffer along with isarray and
// typed-array-buffer's helper chain.
module.exports = function (thing, encoding, name) {
	if (Buffer.isBuffer(thing)) {
		return thing;
	}
	if (typeof thing === 'string') {
		return Buffer.from(thing, encoding);
	}
	// Views are wrapped, not copied: Buffer.from(arrayBuffer, …) shares memory.
	if ((useUint8Array && thing instanceof Uint8Array) || (isView && isView(thing))) {
		return Buffer.from(thing.buffer, thing.byteOffset, thing.byteLength);
	}
	throw new TypeError(name + ' must be a string, a Buffer, a Uint8Array, or a DataView');
};
