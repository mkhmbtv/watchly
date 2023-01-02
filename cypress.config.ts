import {defineConfig} from 'cypress'

export default defineConfig({
  e2e: {
    specPattern: 'cypress/e2e',
    setupNodeEvents(on, config) {
      const isDev = config.watchForFileChanges
      const port = process.env.PORT ?? (isDev ? '3000' : '8811')

      const configOverrides: Partial<Cypress.PluginConfigOptions> = {
        baseUrl: `http://localhost:${port}`,
      }
      return {...config, ...configOverrides}
    },
  },
})
