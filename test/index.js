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
			files: './fixtures/accept.css'
		},
		{
			files: './fixtures/accept.scss'
		}
	],
	reject: [
		{
			files: './fixtures/reject.css',
			messages: [
				messages.report(
					'Unable to resolve path to import "./marley/index.css".'
				),
				messages.report(
					'Unable to resolve path to resource "phoebe/annie.css".'
				)
			]
		},
		{
			files: './fixtures/reject.scss',
			messages: [
				messages.report(
					'Unable to resolve path to import "loki/rudy".'
				),
				messages.report(
					'Unable to resolve path to module "loki/rudy".'
				),
				messages.report(
					'Unable to resolve path to module "loki/rudy".'
				),
				messages.report(
					'Unable to resolve path to resource "phoebe/annie.css".'
				)
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
			code: '@import url("./index.css");'
		},
		{
			code: '@import url("./");'
		},
		{
			code: '@import url("josie");'
		},
		{
			code: '@import url("josie/rusty.css");'
		},
		{
			code: '@import url("shelby");'
		},
		{
			code: '@import url("shelby/shelby.css");'
		},
		{
			code: '@import url("./milo/macy.css");'
		},
		{
			code: '@import url("//chico.com");'
		},
		{
			code: '@import "loki";'
		},
		{
			code: '@import "loki/index";'
		},
		{
			code: '@import "loki/_index";'
		},
		{
			code: '@import "loki/_index.scss";'
		},
		{
			code: '@use "sass:list";'
		},
		{
			code: '@forward "sass:list";'
		},
		{
			code: '@use "loki";'
		},
		{
			code: '@forward "loki";'
		},
		{
			code: 'body { background: url("lulu/annie.css"); }'
		}
	],
	reject: [
		{
			code: '@import url("./marley/index.css");',
			message: messages.report(
				'Unable to resolve path to import "./marley/index.css".'
			)
		},
		{
			code: '@import url("josie/millie.css");',
			message: messages.report(
				'Unable to resolve path to import "josie/millie.css".'
			)
		},
		{
			code: '@import url("shelby/index.css");',
			message: messages.report(
				'Unable to resolve path to import "shelby/index.css".'
			)
		},
		{
			code: '@import "loki/rudy";',
			message: messages.report(
				'Unable to resolve path to import "loki/rudy".'
			)
		},
		{
			code: '@use "loki/rudy";',
			message: messages.report(
				'Unable to resolve path to module "loki/rudy".'
			)
		},
		{
			code: '@forward "loki/rudy";',
			message: messages.report(
				'Unable to resolve path to module "loki/rudy".'
			)
		},
		{
			code: 'body { background: url("phoebe/annie.css"); }',
			message: messages.report(
				'Unable to resolve path to resource "phoebe/annie.css".'
			)
		}
	]
});
