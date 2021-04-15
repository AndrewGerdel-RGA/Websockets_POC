module.exports = {
  env: {
    mocha: true,
  },
  plugins: ["chai-friendly"],
  extends: ["standard", "prettier", "prettier/standard"],
  rules: {
    "no-unused-vars": [
      "error",
      {
        varsIgnorePattern: "should|expect",
      },
    ],
    "no-inner-declarations": "off",
    // disable the original no-unused-expressions use chai-friendly
    "no-unused-expressions": "off",
    // chai-friendly/no-unused-expressions errors except on should|expect
    "chai-friendly/no-unused-expressions": "error",
  },
};
