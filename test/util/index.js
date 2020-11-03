/* eslint-disable mocha/no-exports */

import path from 'path';
import assert from 'assert';
import { lint } from 'stylelint';

export const runCodeTest = (options = {}) => {
	const { ruleName, config, accept, reject } = options;

	accept.forEach(({ code, syntax = 'css' }) => {
		it(`should pass for: \`${code}\``, async function () {
			const {
				results: [{ warnings, parseErrors }]
			} = await lint({
				code,
				syntax,
				config: {
					plugins: [path.resolve(__dirname, '../../index.js')],
					rules: {
						[ruleName]: config
					}
				}
			});
			assert.equal(warnings.length, 0);
			assert.equal(parseErrors.length, 0);
		});
	});

	reject.forEach(({ code, syntax = 'css', message }) => {
		it(`should reject for: \`${code}\``, async function () {
			const {
				results: [{ warnings, parseErrors }]
			} = await lint({
				code,
				syntax,
				config: {
					plugins: [path.resolve(__dirname, '../../index.js')],
					rules: {
						[ruleName]: config
					}
				}
			});
			const [{ text }] = warnings;
			assert.equal(text, message);
		});
	});
};

export const runFileTest = (options = {}) => {
	const { ruleName, config, accept, reject } = options;

	accept.forEach(({ files, syntax = 'css' }) => {
		it(`should pass for: \`${files}\``, async function () {
			const {
				results: [{ warnings, parseErrors }]
			} = await lint({
				files: path.resolve(__dirname, '../', files),
				syntax,
				config: {
					plugins: [path.resolve(__dirname, '../../index.js')],
					rules: {
						[ruleName]: config
					}
				}
			});
			assert.equal(warnings.length, 0);
			assert.equal(parseErrors.length, 0);
		});
	});

	reject.forEach(({ files, syntax = 'css', messages }) => {
		it(`should reject for: \`${files}\``, async function () {
			const {
				results: [{ warnings, parseErrors }]
			} = await lint({
				files: path.resolve(__dirname, '../', files),
				syntax,
				config: {
					plugins: [path.resolve(__dirname, '../../index.js')],
					rules: {
						[ruleName]: config
					}
				}
			});
			assert.equal(warnings.length, messages.length);
			warnings.forEach(({ text }) => {
				assert.ok(messages.find((message) => message === text));
			});
		});
	});
};
