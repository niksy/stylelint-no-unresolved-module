import path from 'path';
import function_ from '../index';
import { runCodeTest, runFileTest } from './util';

const { ruleName, messages } = function_;

runFileTest({
	ruleName: ruleName,
	config: {
		alias: {
			'lulu': 'assets'
		},
		modules: ['node_modules', 'local_modules']
	},
	accept: [
		{
			input: './fixtures/accept.css',
			result: []
		},
		{
			input: './fixtures/accept.scss',
			customSyntax: 'postcss-scss',
			result: []
		}
	],
	reject: [
		{
			input: './fixtures/reject.css',
			result: [
				{
					column: 14,
					line: 1,
					endColumn: 32,
					endLine: 1,
					text: messages.report(
						'Unable to resolve path to import "./marley/index.css".'
					)
				},
				{
					column: 14,
					line: 2,
					endColumn: 30,
					endLine: 2,
					text: messages.report(
						'Unable to resolve path to import "josie/millie.css".'
					)
				},
				{
					column: 14,
					line: 3,
					endColumn: 30,
					endLine: 3,
					text: messages.report(
						'Unable to resolve path to import "shelby/index.css".'
					)
				},
				{
					column: 19,
					line: 6,
					endColumn: 35,
					endLine: 6,
					text: messages.report(
						'Unable to resolve path to resource "phoebe/annie.css".'
					)
				},
				{
					column: 12,
					line: 11,
					endColumn: 27,
					endLine: 11,
					text: messages.report(
						'Unable to resolve path to resource "elvis/riley.css".'
					)
				},
				{
					column: 8,
					line: 12,
					endColumn: 21,
					endLine: 12,
					text: messages.report(
						'Unable to resolve path to resource "elvis/jax.css".'
					)
				}
			]
		},
		{
			input: './fixtures/reject.scss',
			customSyntax: 'postcss-scss',
			result: [
				{
					column: 14,
					line: 1,
					endColumn: 32,
					endLine: 1,
					text: messages.report(
						'Unable to resolve path to import "./marley/index.css".'
					)
				},
				{
					column: 14,
					line: 2,
					endColumn: 30,
					endLine: 2,
					text: messages.report(
						'Unable to resolve path to import "josie/millie.css".'
					)
				},
				{
					column: 14,
					line: 3,
					endColumn: 30,
					endLine: 3,
					text: messages.report(
						'Unable to resolve path to import "shelby/index.css".'
					)
				},
				{
					column: 10,
					line: 5,
					endColumn: 19,
					endLine: 5,
					text: messages.report(
						'Unable to resolve path to import "loki/rudy".'
					)
				},
				{
					column: 7,
					line: 6,
					endColumn: 16,
					endLine: 6,
					text: messages.report(
						'Unable to resolve path to module "loki/rudy".'
					)
				},
				{
					column: 11,
					line: 7,
					endColumn: 20,
					endLine: 7,
					text: messages.report(
						'Unable to resolve path to module "loki/rudy".'
					)
				},
				{
					column: 19,
					line: 10,
					endColumn: 35,
					endLine: 10,
					text: messages.report(
						'Unable to resolve path to resource "phoebe/annie.css".'
					)
				},
				{
					column: 12,
					line: 15,
					endColumn: 27,
					endLine: 15,
					text: messages.report(
						'Unable to resolve path to resource "elvis/riley.css".'
					)
				},
				{
					column: 8,
					line: 16,
					endColumn: 21,
					endLine: 16,
					text: messages.report(
						'Unable to resolve path to resource "elvis/jax.css".'
					)
				}
			]
		}
	]
});

runCodeTest({
	ruleName: ruleName,
	config: {
		cwd: path.resolve(__dirname, 'fixtures'),
		alias: {
			'lulu': 'assets'
		},
		modules: ['node_modules', 'local_modules']
	},
	accept: [
		{
			input: '@import url("./index.css");',
			result: []
		},
		{
			input: '@import url("./");',
			result: []
		},
		{
			input: '@import url("josie");',
			result: []
		},
		{
			input: '@import url("josie/rusty.css");',
			result: []
		},
		{
			input: '@import url("shelby");',
			result: []
		},
		{
			input: '@import url("shelby/shelby.css");',
			result: []
		},
		{
			input: '@import url("./milo/macy.css");',
			result: []
		},
		{
			input: '@import url("//chico.com");',
			result: []
		},
		{
			input: '@import url("./") screen and (orientation:landscape);',
			result: []
		},
		{
			input: '@import "loki";',
			result: []
		},
		{
			input: '@import "loki/index";',
			result: []
		},
		{
			input: '@import "loki/_index";',
			result: []
		},
		{
			input: '@import "loki/_index.scss";',
			result: []
		},
		{
			input: '@use "sass:list";',
			result: []
		},
		{
			input: '@forward "sass:list";',
			result: []
		},
		{
			input: '@use "loki";',
			result: []
		},
		{
			input: '@forward "loki";',
			result: []
		},
		{
			input: 'body { background: url("lulu/annie.css"); }',
			result: []
		},
		{
			input: 'body { background: url($heidi); }',
			result: []
		},
		{
			input: 'body { background: url(#{$heidi}); }',
			result: []
		},
		{
			input: 'body { background: url("lulu/#{$heidi}.css"); }',
			result: []
		},
		{
			input: 'body { background: url(../fixtures/index.css); }',
			result: []
		}
	],
	reject: [
		{
			input: '@import url("./marley/index.css");',
			result: [
				{
					column: 14,
					line: 1,
					endColumn: 32,
					endLine: 1,
					text: messages.report(
						'Unable to resolve path to import "./marley/index.css".'
					)
				}
			]
		},
		{
			input: '@import url("josie/millie.css");',
			result: [
				{
					column: 14,
					line: 1,
					endColumn: 30,
					endLine: 1,
					text: messages.report(
						'Unable to resolve path to import "josie/millie.css".'
					)
				}
			]
		},
		{
			input: '@import url("shelby/index.css");',
			result: [
				{
					column: 14,
					line: 1,
					endColumn: 30,
					endLine: 1,
					text: messages.report(
						'Unable to resolve path to import "shelby/index.css".'
					)
				}
			]
		},
		{
			input: '@import "loki/rudy";',
			result: [
				{
					column: 10,
					line: 1,
					endColumn: 19,
					endLine: 1,
					text: messages.report(
						'Unable to resolve path to import "loki/rudy".'
					)
				}
			]
		},
		{
			input: '@use "loki/rudy";',
			result: [
				{
					column: 7,
					line: 1,
					endColumn: 16,
					endLine: 1,
					text: messages.report(
						'Unable to resolve path to module "loki/rudy".'
					)
				}
			]
		},
		{
			input: '@forward "loki/rudy";',
			result: [
				{
					column: 11,
					line: 1,
					endColumn: 20,
					endLine: 1,
					text: messages.report(
						'Unable to resolve path to module "loki/rudy".'
					)
				}
			]
		},
		{
			input: 'body { background: url("phoebe/annie.css"); }',
			result: [
				{
					column: 25,
					line: 1,
					endColumn: 41,
					endLine: 1,
					text: messages.report(
						'Unable to resolve path to resource "phoebe/annie.css".'
					)
				}
			]
		}
	]
});

runCodeTest({
	ruleName: ruleName,
	config: {
		cwd: path.resolve(__dirname, 'fixtures'),
		roots: ['local_modules'],
		alias: {
			'assets': ['theme/assets', '/assets']
		},
		modules: ['node_modules', 'local_modules']
	},
	accept: [
		{
			input: 'body { background: url("assets/annie.css"); }',
			result: []
		},
		{
			input: 'body { background: url("assets/jasmine.css"); }',
			result: []
		}
	],
	reject: [
		{
			input: 'body { background: url("assets/trixie.css"); }',
			result: [
				{
					column: 25,
					line: 1,
					endColumn: 42,
					endLine: 1,
					text: messages.report(
						'Unable to resolve path to resource "assets/trixie.css".'
					)
				}
			]
		}
	]
});
