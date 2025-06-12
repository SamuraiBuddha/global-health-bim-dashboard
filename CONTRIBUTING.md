# Contributing to Global Health BIM Dashboard

We love contributions! This document outlines how to contribute to the project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct:
- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive criticism
- Respect differing viewpoints and experiences

## Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/global-health-bim-dashboard.git
   cd global-health-bim-dashboard
   ```
3. Add upstream remote:
   ```bash
   git remote add upstream https://github.com/SamuraiBuddha/global-health-bim-dashboard.git
   ```

## Development Setup

### Prerequisites
- Node.js 20+
- Rust 1.70+
- Docker & Docker Compose
- CUDA Toolkit (for GPU features)

### Environment Setup

1. Install dependencies:
   ```bash
   npm install
   cd rust-core && cargo build
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. Start development environment:
   ```bash
   docker-compose up -d
   npm run dev
   ```

## Development Workflow

### 1. Create a Feature Branch
```bash
git checkout -b feature/your-feature-name
```

### 2. Make Your Changes
- Write clean, documented code
- Follow the coding standards
- Add tests for new features
- Update documentation as needed

### 3. Test Your Changes
```bash
npm test
cargo test
npm run test:integration
```

### 4. Commit Your Changes
We follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add earthquake prediction model"
git commit -m "fix: correct coordinate transformation bug"
git commit -m "docs: update API documentation"
```

### 5. Push and Create PR
```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Coding Standards

### TypeScript/JavaScript
- Use ESLint configuration
- Prefer functional programming patterns
- Use TypeScript for type safety

### Rust
- Follow Rust standard formatting (`cargo fmt`)
- Use `clippy` for linting
- Document public APIs

### Python
- Follow PEP 8
- Use type hints
- Document with docstrings

## Testing

### Unit Tests
- Test individual functions/methods
- Mock external dependencies
- Aim for 80%+ coverage

### Integration Tests
- Test service interactions
- Use Docker for test environment
- Test error scenarios

### E2E Tests
- Test critical user workflows
- Use Cypress for frontend tests
- Test cross-browser compatibility

## Documentation

- Update README for new features
- Document API changes
- Add JSDoc/rustdoc comments
- Update architecture diagrams

## Pull Request Process

1. **PR Description**: Clearly describe changes and motivation
2. **Tests**: All tests must pass
3. **Documentation**: Update relevant docs
4. **Review**: Address reviewer feedback
5. **Squash**: Squash commits before merging

## Reporting Issues

### Bug Reports
Include:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- System information
- Error messages/logs

### Feature Requests
Include:
- Problem description
- Proposed solution
- Alternative solutions
- Implementation ideas

## Community

- GitHub Discussions: Questions and ideas
- Discord: Real-time chat (coming soon)
- Monthly contributor calls

## Recognition

Contributors are recognized in:
- CONTRIBUTORS.md file
- Release notes
- Project website

Thank you for contributing!