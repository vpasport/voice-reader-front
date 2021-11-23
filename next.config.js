module.exports = {
  reactStrictMode: true,
  // webpack5: false,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /encoderWorker\.min\.js$/,
      use: [{ loader: 'file-loader' }]
    })
    return config
  }
}
