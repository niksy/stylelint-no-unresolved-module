import path from 'path';
import { promisify } from 'util';
import enhancedResolve from 'enhanced-resolve';
import isUrl from 'is-url';

const urlRegex = /^url/;

const defaultResolveValues = {
	extensions: ['.css'],
	conditionNames: ['style', 'browser', 'import', 'require', 'node'],
	mainFields: ['style', 'browser', 'module', 'main'],
	mainFiles: ['index'],
	modules: ['node_modules']
};

class NodeResolver {
	constructor(options = {}) {
		const {
			cssRoot = null,
			cwd = process.cwd(),
			alias = [],
			extensions = [...defaultResolveValues.extensions],
			conditionNames = [...defaultResolveValues.conditionNames],
			mainFields = [...defaultResolveValues.mainFields],
			mainFiles = [...defaultResolveValues.mainFiles],
			modules = [...defaultResolveValues.modules]
		} = options;

		this.cwd = cwd;
		this.alias = alias;
		this.extensions = extensions;
		this.conditionNames = conditionNames;
		this.mainFields = mainFields;
		this.mainFiles = mainFiles;
		this.modules = modules;
		this.cssRoot = cssRoot;
		if (this.cssRoot.source.input.file) {
			this.context = path.dirname(this.cssRoot.source.input.file);
		} else {
			this.context = this.cwd;
		}
		this.importAtRules = ['import'];

		this.enhancedResolve = promisify(
			enhancedResolve.create({
				...(this.context === this.cwd && {
					roots: [this.cwd]
				}),
				alias: this.alias,
				extensions: this.extensions,
				conditionNames: this.conditionNames,
				mainFields: this.mainFields,
				mainFiles: this.mainFiles,
				modules: this.modules
			})
		);
	}

	resolvePath(entry) {
		return this.enhancedResolve(this.context, entry);
	}

	resolve(node, rootNode) {
		if (
			isUrl(node.value) ||
			(rootNode.type === 'atrule' && !this.isGenericUrlImport(rootNode))
		) {
			return false;
		}
		return {
			promise: this.resolvePath(node.value),
			message: this.message.bind(this)
		};
	}

	message(resource, rootNode) {
		if (rootNode.type === 'atrule') {
			return `Unable to resolve path to import "${resource}".`;
		}
		return `Unable to resolve path to resource "${resource}".`;
	}

	isGenericUrlImport(rootNode) {
		return rootNode.type === 'atrule' && urlRegex.test(rootNode.params);
	}
}

export default NodeResolver;
