/**
 * @typedef {import('postcss').Root} postcss.Root
 * @typedef {import('postcss').ChildNode} postcss.ChildNode
 */

/**
 * @typedef {{
 *   cssRoot: postcss.Root?,
 *   cwd: string,
 *   alias: string[],
 *   roots: string[],
 *   extensions: string[],
 *   conditionNames: string[],
 *   mainFields: string[],
 *   mainFiles: string[],
 *   modules: string[]}
 *  } NodeResolverOptions
 */

/**
 * @typedef {(context: string, entry: string) => Promise<string>} PathResolver
 */

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
	/**
	 * @param {NodeResolverOptions} options
	 */
	constructor(options) {
		const {
			cssRoot = null,
			cwd = process.cwd(),
			alias = /** @type {string[]}*/ ([]),
			roots = /** @type {string[]}*/ ([]),
			extensions = [...defaultResolveValues.extensions],
			conditionNames = [...defaultResolveValues.conditionNames],
			mainFields = [...defaultResolveValues.mainFields],
			mainFiles = [...defaultResolveValues.mainFiles],
			modules = [...defaultResolveValues.modules]
		} = options ?? {};

		this.cwd = cwd;
		this.alias = alias;
		this.roots = [...roots];
		this.extensions = extensions;
		this.conditionNames = conditionNames;
		this.mainFields = mainFields;
		this.mainFiles = mainFiles;
		this.modules = modules;
		this.cssRoot = cssRoot;
		if (this.cssRoot?.source?.input.file) {
			this.context = path.dirname(this.cssRoot.source.input.file);
		} else {
			this.context = this.cwd;
		}
		this.importAtRules = ['import'];

		if (this.context === this.cwd) {
			this.roots.push(this.cwd);
		}
		this.roots = [...new Set(this.roots)].map((root) => {
			return path.resolve(this.cwd, root);
		});

		/** @type {PathResolver} */
		this.enhancedResolve = promisify(
			enhancedResolve.create({
				roots: this.roots,
				alias: this.alias,
				extensions: this.extensions,
				conditionNames: this.conditionNames,
				mainFields: this.mainFields,
				mainFiles: this.mainFiles,
				modules: this.modules
			})
		);
	}

	/**
	 * @param {string} entry
	 */
	resolvePath(entry) {
		return this.enhancedResolve(this.context, entry);
	}

	/**
	 * @param {string}            value
	 * @param {postcss.ChildNode} rootNode
	 */
	resolve(value, rootNode) {
		if (
			isUrl(value) ||
			(rootNode.type === 'atrule' && !this.isGenericUrlImport(rootNode))
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
		if (rootNode.type === 'atrule') {
			return `Unable to resolve path to import "${resource}".`;
		}
		return `Unable to resolve path to resource "${resource}".`;
	}

	/**
	 * @param {postcss.ChildNode} rootNode
	 */
	isGenericUrlImport(rootNode) {
		return rootNode.type === 'atrule' && urlRegex.test(rootNode.params);
	}
}

export default NodeResolver;
