module.exports = {
  extends: ['plugin:cypress/recommended'],
  rules: {
    'no-unused-expressions': 0, // chai assertions trigger this rule
  },
};
