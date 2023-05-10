// Augment the Cypress namespace to include type definitions for
// your custom command.
// Alternatively, can be defined in cypress/support/component.d.ts
// with a <reference path="./component" /> at the top of your spec.
import { mount } from "cypress/vue";
import { Router } from "vue-router";

type MountParams = Parameters<typeof mount>;
type OptionsParam = MountParams[1] & { router?: Router };

declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Helper mount function for Vue Components
             * @param component Vue Component or JSX Element to mount
             * @param options Options passed to Vue Test Utils
             */
            mount(component: any, options?: OptionsParam): Chainable<any>;
        }
    }
}
