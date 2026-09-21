'use strict';

// Digest helpers for the browser PBKDF2 path, over @unabandoned/hash.js.
//
// It previously reached md5 through `create-hash/md5` and the rest through
// `ripemd160` and `sha.js`. create-hash has had no release since 2018 and
// pulls md5.js (2018) and cipher-base beneath it; @unabandoned/hash.js
// implements every digest this path supports - md5, sha1, sha224, sha256,
// sha384, sha512, sha512-256 and ripemd160 - with no dependencies of its own.
//
// sha512-256 is the reason this stayed on the list: node:crypto has it, sha.js
// never did, and the browser path throwing for a digest the Node path accepts
// is a standing (TODO-marked) failure in this package's own suite.
//
// The Node path (lib/sync.js) is not served from here: it uses node:crypto,
// which supports digests no pure-JS implementation here does (sha512-256).

var Buffer = require('safe-buffer').Buffer;
var hash = require('@unabandoned/hash.js');

var algorithms = {
	__proto__: null,
	md5: hash.md5,
	sha1: hash.sha1,
	sha224: hash.sha224,
	sha256: hash.sha256,
	sha384: hash.sha384,
	sha512: hash.sha512,
	'sha512-256': hash.sha512_256,
	ripemd160: hash.ripemd160,
	rmd160: hash.ripemd160
};

function resolve(alg) {
	var ctor = algorithms[alg];
	if (!ctor) {
		throw new TypeError('Digest algorithm not supported: ' + alg);
	}
	return ctor;
}

// Returns `data -> Buffer`, the shape the browser PBKDF2 loop expects.
function getDigest(alg) {
	var ctor = resolve(alg);
	return function digest(data) {
		return Buffer.from(ctor().update(data).digest());
	};
}


module.exports = { getDigest: getDigest };
