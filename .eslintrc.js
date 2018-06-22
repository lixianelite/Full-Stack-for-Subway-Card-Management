module.exports = {
    "extends": "eslint:recommended",
    "rules": {
        "no-console": ["error", {
            "allow": ["log", "warn", "error", "info"]
        }],
        "indent": [
            "error",
            4
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-unused-vars": ["warn", { "vars": "all", "args": "after-used", "ignoreRestSiblings": false }]
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "script"
    },
    "env": {
        "browser": true,
        "es6": true,
        "commonjs": true,
        "node": true,
        "mocha":true,
        "jquery":true
    },
    "plugins": [
        "jquery"
      ]
};