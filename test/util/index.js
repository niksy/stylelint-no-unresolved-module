/* eslint-disable mocha/no-exports */

import path from 'path';
import { fileURLToPath } from 'url';
import assert from 'assert';
import stylelint from 'stylelint';
import plugin from '../../index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const { lint } = stylelint;

/**
 * @typedef {import('stylelint').CustomSyntax} CustomSyntax
 */

/**
 * @typedef {object} Test
 * @property {string}       input
 * @property {CustomSyntax} [customSyntax]
 * @property {object[]}     result
 */

/**
 * @typedef {object} TestOptions
 * @property {string}         ruleName
 * @property {object|boolean} config
 * @property {Test[]}         accept
 * @property {Test[]}         reject
 * @property {CustomSyntax}   [customSyntax]
 */

/**
 * @param {TestOptions} options
 */
export const runCodeTest = (options) => {
	const { ruleName, config, customSyntax, accept, reject } = options ?? {};

	accept.forEach((/** @type {Test} */ { input, customSyntax: syntax }) => {
		it(`should pass for: \`${input}\``, async function () {
			const {
				results: [{ warnings }]
			} = await lint({
				code: input,
				customSyntax: customSyntax ?? syntax,
				config: {
					plugins: [plugin],
					rules: {
						[ruleName]: config
					}
				}
			});
			assert.equal(
				warnings.length,
				0,
				`Accept case contains warnings, expected 0, got ${warnings.length}`
			);
		});
	});

	reject.forEach(
		(/** @type {Test} */ { input, customSyntax: syntax, result }) => {
			it(`should reject for: \`${input}\``, async function () {
				const {
					results: [{ warnings }]
				} = await lint({
					code: input,
					customSyntax: customSyntax ?? syntax,
					config: {
						plugins: [plugin],
						rules: {
							[ruleName]: config
						}
					}
				});
				const [{ rule, severity, url, ...warning }] = warnings;
				assert.deepEqual(
					warning,
					result[0],
					'Expected different warning'
				);
			});
		}
	);
};

/**
 * @param {TestOptions} options
 */
export const runFileTest = (options) => {
	const { ruleName, config, customSyntax, accept, reject } = options ?? {};

	accept.forEach((/** @type {Test} */ { input, customSyntax: syntax }) => {
		it(`should pass for: \`${input}\``, async function () {
			const {
				results: [{ warnings }]
			} = await lint({
				files: path.resolve(__dirname, '../', input),
				customSyntax: customSyntax ?? syntax,
				config: {
					plugins: [plugin],
					rules: {
						[ruleName]: config
					}
				}
			});
			assert.equal(
				warnings.length,
				0,
				`Accept case contains warnings, expected 0, got ${warnings.length}`
			);
		});
	});

	reject.forEach(
		(/** @type {Test} */ { input, customSyntax: syntax, result }) => {
			it(`should reject for: \`${input}\``, async function () {
				const {
					results: [{ warnings }]
				} = await lint({
					files: path.resolve(__dirname, '../', input),
					customSyntax: customSyntax ?? syntax,
					config: {
						plugins: [plugin],
						rules: {
							[ruleName]: config
						}
					}
				});
				assert.equal(
					warnings.length,
					result.length,
					`Not all warnings have been covered for reject case`
				);
				warnings.forEach(
					({ rule, severity, url, ...warning }, index) => {
						assert.deepEqual(
							warning,
							result[index],
							`Warning is not covered: "${warning.text}"`
						);
					}
				);
			});
		}
	);
};
