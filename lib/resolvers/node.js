/**
 * @typedef {import('postcss').Root} postcss.Root
 * @typedef {import('postcss').ChildNode} postcss.ChildNode
 * @typedef {import('oxc-resolver').TsconfigOptions} TsconfigOptions
 */
/**
 * @typedef {{
 *   cssRoot: postcss.Root?,
 *   cwd: string,
 *   alias: Record<string, (string|string[])>,
 *   roots: string[],
 *   extensions: string[],
 *   conditionNames: string[],
 *   mainFields: string[],
 *   mainFiles: string[],
 *   modules: string[],
 *   tsconfig?: 'auto'|TsconfigOptions
 * }} NodeResolverOptions
 */

import path from 'path';
import { ResolverFactory } from 'oxc-resolver';
import isUrl from 'is-url';

const urlRegex = /^url/;

const defaultResolveValues = {
	extensions: ['.css'],
	conditionNames: [
		'style',
		'browser',
		'import',
		'require',
		'node',
		'default'
	],
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
			alias = /** @type {Record<string, (string|string[])>}*/ ({}),
			roots = /** @type {string[]}*/ ([]),
			extensions = [...defaultResolveValues.extensions],
			conditionNames = [...defaultResolveValues.conditionNames],
			mainFields = [...defaultResolveValues.mainFields],
			mainFiles = [...defaultResolveValues.mainFiles],
			modules = [...defaultResolveValues.modules],
			tsconfig
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
		this.tsconfig = tsconfig;
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

		const preparedAlias = Object.entries(this.alias).reduce(
			(array, [key, value]) => {
				array[key] = /** @type {string[]}*/ ([]).concat(value);
				return array;
			},
			/** @type {Record<string, string[]>} */ ({})
		);

		this.enhancedResolve = new ResolverFactory({
			roots: this.roots,
			alias: preparedAlias,
			extensions: this.extensions,
			conditionNames: this.conditionNames,
			mainFields: this.mainFields,
			mainFiles: this.mainFiles,
			modules: this.modules,
			tsconfig: this.tsconfig
		});
	}

	/**
	 * @param {string} entry
	 */
	async resolvePath(entry) {
		const result = await this.enhancedResolve.async(this.context, entry);
		if (result.error) {
			throw new Error(result.error);
		} else if (typeof result.path === 'string') {
			return result.path;
		} else {
			throw new TypeError(`Unable to resolve "${entry}".`);
		}
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
