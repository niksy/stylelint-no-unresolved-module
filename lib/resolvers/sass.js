import path from 'path';
import pWaterfall from 'p-waterfall';
import NodeResolver from './node';

const isSassModuleAtRule = (rootNode) => {
	return (
		rootNode.type === 'atrule' && ['use', 'forward'].includes(rootNode.name)
	);
};

const urlRegex = /^url/;
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
			(rootNode.type === 'atrule' &&
				isSassModuleAtRule(rootNode) &&
				sassCoreModuleRegex.test(node.value)) ||
			(rootNode.type === 'atrule' && urlRegex.test(rootNode.params))
		) {
			return false;
		}
		return {
			promise: this.resolvePath(node.value),
			message: this.message
		};
	}

	message(resource, rootNode) {
		if (isSassModuleAtRule(rootNode)) {
			return `Unable to resolve path to module "${resource}".`;
		}
		return super.message(resource, rootNode);
	}
}

export default SassResolver;
