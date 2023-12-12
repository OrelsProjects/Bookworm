module.exports = {
  webpack: (config) => {
    if (!config.module.rules) {
      config.module.rules = [];
    }

    config.module.rules.push({
      test: /\.(mp4|mov)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: 'videos/[name].[ext]',
          },
        },
      ],
    });

    return config;
  },
};
