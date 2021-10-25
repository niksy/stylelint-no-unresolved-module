/**
 * @typedef {import('postcss').ChildNode} postcss.ChildNode
 * @typedef {{
 *   rootNode: postcss.ChildNode,
 *   value: string,
 *   promise: Promise<string>,
 *   message: (resource: string, rootNode: postcss.ChildNode) => string
 * }} ResolvedModule
 */

import Ajv from 'ajv';
import stylelint from 'stylelint';
import parse from 'postcss-value-parser';
import NodeResolver from './lib/resolvers/node';
import SassResolver from './lib/resolvers/sass';

const ruleName = 'plugin/no-unresolved-module';

const ajv = new Ajv();
const validateOptions = ajv.compile({
	oneOf: [
		{ type: 'boolean' },
		{
			type: 'object',
			additionalProperties: false,
			properties: {
				cwd: {
					type: 'string'
				},
				modules: {
					type: 'array',
					minItems: 1,
					items: { type: 'string' }
				},
				alias: {
					type: 'object',
					'anyOf': [
						{
							patternProperties: {
								'.+': { type: 'string' }
							}
						},
						{
							patternProperties: {
								'.+': {
									type: 'array',
									minItems: 1,
									items: { type: 'string' }
								}
							}
						}
					]
				}
			}
		}
	]
});

const messages = stylelint.utils.ruleMessages(ruleName, {
	report: (value) => value
});

const plugin = stylelint.createPlugin(
	ruleName,
	(resolveRules) => async (cssRoot, result) => {
		const validOptions = stylelint.utils.validateOptions(result, ruleName, {
			actual: resolveRules,
			possible: (value) => /** @type {boolean}*/ (validateOptions(value))
		});

		if (!validOptions) {
			return;
		}

		const nodeResolver = new NodeResolver({ cssRoot, ...resolveRules });
		const sassResolver = new SassResolver({ cssRoot, ...resolveRules });
		/** @type {ResolvedModule[]} */
		const values = [];

		cssRoot.walkAtRules(
			new RegExp(
				[
					...nodeResolver.importAtRules,
					...sassResolver.importAtRules
				].join('|')
			),
			(atRule) => {
				const parsed = parse(atRule.params);
				parsed.walk((node) => {
					if (node.type === 'string') {
						const value = [
							nodeResolver.resolve(node.value, atRule),
							sassResolver.resolve(node.value, atRule)
						].find((entry) => entry !== false);
						if (typeof value === 'object') {
							values.push({
								rootNode: atRule,
								value: node.value,
								...value
							});
						}
					}
				});
			}
		);

		cssRoot.walkDecls((decl) => {
			if (decl.value.includes('url')) {
				const parsed = parse(decl.value);
				parsed.walk((topNode) => {
					if (
						topNode.type === 'function' &&
						topNode.value === 'url'
					) {
						const [node] = topNode.nodes;
						if (sassResolver.isStaticString(node.value)) {
							const value = [
								nodeResolver.resolve(node.value, decl)
							].find((entry) => entry !== false);
							if (typeof value === 'object') {
								values.push({
									rootNode: decl,
									value: node.value,
									...value
								});
							}
						}
					}
				});
			}
		});

		const resolvedValues = await Promise.allSettled(
			values.map(({ promise }) => promise)
		);

		resolvedValues.forEach(({ status }, index) => {
			if (status === 'rejected') {
				const { value, rootNode, message } = values[index];
				stylelint.utils.report({
					ruleName: ruleName,
					result: result,
					node: rootNode,
					word: value,
					message: messages.report(message(value, rootNode))
				});
			}
		});
	}
);

export default { ...plugin, messages };
