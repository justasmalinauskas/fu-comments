import {pluginRunner} from './core/pluginRunner.js'
import {delfiPlugin} from "./plugins/delfi.js";
import {delfiGraphQlPlugin} from "./plugins/delfi-graphql.js";
pluginRunner.addPlugin(delfiPlugin);
pluginRunner.addPlugin(delfiGraphQlPlugin);
pluginRunner.run();
