export default {
  // Starts development mode: watches and compiles all source files including tests.
  dev: {
    run: ['#clean', 'tsc -b tests -w'],
    envGroups: ['development'],
  },

  // Cleans, lints, compiles sources and runs tests.
  build: {
    run: ['#clean', 'tsc -b tests', '#lint', '#t'],
    envGroups: ['production'],
  },

  // Deletes compiled files, auto triggered by `#dev` or `#build`.
  clean: {
    run: {
      del: ['dist', 'dist_tests'],
    },
  },

  // Lints the project using Oxlint, auto triggered by `#build`.
  lint: 'npx --yes oxlint --deny-warnings',

  // Runs tests when you already have `#dev` running.
  t: 'mocha --parallel --require source-map-support/register dist_tests/**/*.test.js',

  _: {
    envGroups: {
      production: {
        NODE_ENV: 'production',
      },
      development: {
        NODE_ENV: 'development',
      },
    },
  },
};
