module.exports = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          cleanupNumericValues: {
            floatPrecision: 2,
          },
        },
      },
    },
    {
      name: 'convertShapeToPath',
      active: false,
    },
  ],
};
