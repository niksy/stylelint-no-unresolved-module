import path from 'path';
import pWaterfall from 'p-waterfall';
import scssParser from 'scss-parser';
import NodeResolver from './node';

const { parse } = scssParser;

const sassCoreModuleRegex = /^sass:[^:]+$/;

class SassResolver extends NodeResolver {
	constructor(options = {}) {
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

	async resolvePath(entry) {
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
			return async (previousEntry) => {
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

		const resolvedPath = await pWaterfall(resolvePathTasks, null);
		if (resolvedPath === null) {
			throw new Error(`Unable to resolve Sass path "${entry}".`);
		}
		return resolvedPath;
	}

	resolve(node, rootNode) {
		if (
			this.isSassCoreModuleRequest(node, rootNode) ||
			this.isGenericUrlImport(rootNode)
		) {
			return false;
		}
		return {
			promise: this.resolvePath(node.value),
			message: this.message.bind(this)
		};
	}

	message(resource, rootNode) {
		if (this.isSassModuleAtRule(rootNode)) {
			return `Unable to resolve path to module "${resource}".`;
		}
		return super.message(resource, rootNode);
	}

	isSassModuleAtRule(rootNode) {
		return (
			rootNode.type === 'atrule' &&
			['use', 'forward'].includes(rootNode.name)
		);
	}

	isSassCoreModuleRequest(node, rootNode) {
		return (
			rootNode.type === 'atrule' &&
			this.isSassModuleAtRule(rootNode) &&
			sassCoreModuleRegex.test(node.value)
		);
	}

	isStaticString(value) {
		/* eslint-disable unicorn/catch-error-name */

		let parsed;

		/*
		 * Try parsing raw value. If that fails, try to parse it as double-quoted string value.
		 * Otherwise, assume this isn’t static string.
		 */
		try {
			parsed = parse(value);
		} catch (error1) {
			try {
				parsed = parse(`"${value}"`);
			} catch (error2) {
				return false;
			}
		}
		return !parsed.value.some(({ type }) =>
			['interpolation', 'variable'].includes(type)
		);
	}
}

export default SassResolver;
