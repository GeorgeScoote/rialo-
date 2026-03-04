# Contributing to ChainSure

First off, thank you for considering contributing to ChainSure! It's people like you that make ChainSure such a great project.

## Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When you create a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed**
- **Explain which behavior you expected**
- **Include screenshots if applicable**
- **Include your environment details** (OS, browser, Node version, etc.)

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear and descriptive title**
- **Provide a detailed description of the proposed enhancement**
- **Explain why this enhancement would be useful**
- **List any alternative solutions you've considered**

### Pull Requests

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code follows the existing style
6. Issue that pull request!

## Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/chainsure-project.git
cd chainsure-project

# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Lint code
npm run lint
```

## Style Guidelines

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

### TypeScript Style

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable names
- Add JSDoc comments for public APIs
- Prefer `const` over `let`
- Use async/await over callbacks

### Rust Style

- Follow Rust conventions and idioms
- Use `cargo fmt` before committing
- Run `cargo clippy` and address warnings
- Add documentation for public items

## Project Structure

```
chainsure-project/
├── src/
│   ├── components/     # React components
│   ├── hooks/         # Custom React hooks
│   ├── sdk/           # Rialo SDK wrapper
│   ├── i18n/          # Translations
│   └── styles/        # CSS/styling
├── contracts/         # Rust smart contracts
├── docs/             # Documentation
└── tests/            # Test files
```

## Testing

- Write unit tests for utilities and hooks
- Write integration tests for components
- Test edge cases and error states
- Aim for high code coverage

## Documentation

- Keep README.md up to date
- Document all public APIs
- Add inline comments for complex logic
- Update docs when changing functionality

## Questions?

Feel free to reach out:

- Open a [GitHub Discussion](https://github.com/chainsure/protocol/discussions)
- Join our [Discord](https://discord.gg/chainsure)
- Email us at dev@chainsure.app

Thank you for contributing! 🙏
