import { app } from "@arkecosystem/core-container";
import { Container } from "@arkecosystem/core-interfaces";
import "@arkecosystem/core-jest-matchers";
import { asValue } from "awilix";
import isString from "lodash.isstring";
import * as path from "path";

export async function setUpContainer(options: any): Promise<Container.IContainer> {
    options.network = options.network || "testnet";

    process.env.CORE_PATH_DATA = options.data || `${process.env.HOME}/.core`;
    process.env.CORE_PATH_CONFIG = options.config
        ? options.config
        : path.resolve(__dirname, `../config/${options.network}`);

    await app.setUp(
        "2.1.1",
        {
            token: options.token || "persona",
            network: options.network,
        },
        options,
    );
    return app;
}

// copied from core-container registrars/plugin and slightly modified
export async function registerWithContainer(plugin, options = {}) {
    if (!plugin.register) {
        return;
    }

    const name = plugin.name || plugin.pkg.name;
    const version = plugin.version || plugin.pkg.version;
    const defaults = plugin.defaults || plugin.pkg.defaults;
    const alias = plugin.alias || plugin.pkg.alias;

    options = applyToDefaults(defaults, options);

    const pluginRegistered = await plugin.register(app, options || {});
    app.register(
        alias || name,
        asValue({
            name,
            version,
            plugin: pluginRegistered,
            options,
        }),
    );

    return pluginRegistered;
}

// copied from core-container registrars/plugin and slightly modified
function applyToDefaults(defaults, options) {
    if (defaults) {
        options = Object.assign(defaults, options);
    }

    return castOptions(options);
}

// copied from core-container registrars/plugin
function castOptions(options) {
    const blacklist: any = [];
    const regex = new RegExp(/^\d+$/);

    Object.keys(options).forEach(key => {
        const value = options[key];
        if (isString(value) && !blacklist.includes(key) && regex.test(value)) {
            options[key] = +value;
        }
    });

    return options;
}
