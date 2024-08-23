/**
 * @typedef {import('postcss').Root} postcss.Root
 * @typedef {import('postcss').ChildNode} postcss.ChildNode
 * @typedef {import('./node').NodeResolverOptions} NodeResolverOptions
 */

import path from 'path';
import pWaterfall from 'p-waterfall';
import scssParser from 'scss-parser';
import NodeResolver from './node.js';

const sassCoreModuleRegex = /^sass:[^:]+$/;

class SassResolver extends NodeResolver {
	/**
	 * @param {NodeResolverOptions} options
	 */
	constructor(options) {
		super({
			...options,
			extensions: ['.scss', '.css'],
			conditionNames: [
				'sass',
				'style',
				'browser',
				'import',
				'require',
				'node'
			],
			mainFiles: ['_index', 'index']
		});
		this.importAtRules = ['import', 'use', 'forward'];
	}

	/**
	 * @param {string} rawEntry
	 */
	async resolvePath(rawEntry) {
		const entry = rawEntry.replace('pkg:', '');
		const dirname = path.dirname(entry);
		const basename = path.basename(entry);

		const underscoreEntry = path.join(dirname, `_${basename}`);
		const genericEntry = path.join(dirname, basename);

		const resolvePathTasks = [
			`./${underscoreEntry}`,
			`./${genericEntry}`,
			underscoreEntry,
			genericEntry
		].map((currentEntry) => {
			return async (/** @type {string?} */ previousEntry) => {
				if (typeof previousEntry === 'string') {
					return previousEntry;
				}
				try {
					return await super.resolvePath(currentEntry);
				} catch {
					return previousEntry;
				}
			};
		});

		/** @type {string?} */
		// @ts-ignore
		const resolvedPath = await pWaterfall(resolvePathTasks, null);
		if (resolvedPath === null) {
			throw new Error(`Unable to resolve Sass path "${entry}".`);
		}
		return resolvedPath;
	}

	/**
	 * @param {string}            value
	 * @param {postcss.ChildNode} rootNode
	 */
	resolve(value, rootNode) {
		if (
			this.isSassCoreModuleRequest(value, rootNode) ||
			this.isGenericUrlImport(rootNode)
		) {
			return false;
		}
		return {
			promise: this.resolvePath(value),
			message: this.message.bind(this)
		};
	}

	/**
	 * @param {string}            resource
	 * @param {postcss.ChildNode} rootNode
	 */
	message(resource, rootNode) {
		if (this.isSassModuleAtRule(rootNode)) {
			return `Unable to resolve path to module "${resource}".`;
		}
		return super.message(resource, rootNode);
	}

	/**
	 * @param {postcss.ChildNode} rootNode
	 */
	isSassModuleAtRule(rootNode) {
		return (
			rootNode.type === 'atrule' &&
			['use', 'forward'].includes(rootNode.name)
		);
	}

	/**
	 * @param {string}            value
	 * @param {postcss.ChildNode} rootNode
	 */
	isSassCoreModuleRequest(value, rootNode) {
		return (
			rootNode.type === 'atrule' &&
			this.isSassModuleAtRule(rootNode) &&
			sassCoreModuleRegex.test(value)
		);
	}

	/**
	 * @param {string} value
	 */
	isStaticString(value) {
		/* eslint-disable unicorn/catch-error-name */

		let parsed;

		/*
		 * Try parsing raw value. If that fails, try to parse it as double-quoted string value.
		 * Otherwise, assume this isn’t static string.
		 */
		try {
			parsed = scssParser.parse(value);
		} catch (error1) {
			try {
				parsed = scssParser.parse(`"${value}"`);
			} catch (error2) {
				return false;
			}
		}
		let result = false;
		if (Array.isArray(parsed.value)) {
			result = !parsed.value.some(({ type }) =>
				['interpolation', 'variable'].includes(type)
			);
		}
		return result;
	}
}

export default SassResolver;
