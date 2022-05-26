# probot-test-app

> A GitHub App built with [Probot](https://github.com/probot/probot) that A &#x27;hello world&#x27; github app build with probot

## Setup

```sh
# Install dependencies
npm install

# Run the bot
npm start
```

## Docker

```sh
# 1. Build container
docker build -t probot-test-app .

# 2. Start container
docker run -e APP_ID=<app-id> -e PRIVATE_KEY=<pem-value> probot-test-app
```

## Contributing

If you have suggestions for how probot-test-app could be improved, or want to report a bug, open an issue! We'd love all and any contributions.

For more, check out the [Contributing Guide](CONTRIBUTING.md).

## License

[ISC](LICENSE) © 2022 Lendly Cagata <lendly.cagata@telus.com>
