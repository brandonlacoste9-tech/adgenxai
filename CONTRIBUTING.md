# Contributing to AdgenXAI

Thank you for your interest in contributing to AdgenXAI! This document provides guidelines and information for contributors.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- A code editor (VS Code recommended)

### Development Setup

1. **Fork the repository**
   - Click the "Fork" button on GitHub
   - Clone your fork locally

2. **Set up the development environment**
   ```bash
   git clone https://github.com/your-username/adgenxai.git
   cd adgenxai
   npm install
   cp .env.example .env.local
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Run tests to ensure everything works**
   ```bash
   npm test
   ```

## 📋 Development Workflow

### Branch Naming

Use descriptive branch names with prefixes:

- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation updates
- `refactor/` - Code refactoring
- `test/` - Test additions/updates
- `chore/` - Maintenance tasks

Examples:
```bash
git checkout -b feat/add-twitter-integration
git checkout -b fix/instagram-auth-issue
git checkout -b docs/update-api-guide
```

### Commit Messages

Follow the conventional commit format:

```
type(scope): description

[optional body]

[optional footer]
```

Types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `style` - Formatting, missing semicolons, etc.
- `refactor` - Code restructuring
- `test` - Adding tests
- `chore` - Maintenance

Examples:
```bash
git commit -m "feat(instagram): add story publishing support"
git commit -m "fix(auth): resolve token refresh issue"
git commit -m "docs(readme): update installation instructions"
```

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:ci
```

### Writing Tests

- Place test files next to the code they test or in `__tests__` directories
- Use descriptive test names
- Follow the AAA pattern (Arrange, Act, Assert)
- Test both happy paths and edge cases

Example test structure:
```typescript
describe('ComponentName', () => {
  it('should render correctly with default props', () => {
    // Arrange
    // Act
    // Assert
  });

  it('should handle error states properly', () => {
    // Test error handling
  });
});
```

## 🎨 Code Style

### TypeScript

- Use TypeScript for all new code
- Define proper types and interfaces
- Avoid `any` types when possible
- Use meaningful variable and function names

### React Components

- Use functional components with hooks
- Keep components small and focused
- Use proper prop types
- Follow the component structure:

```typescript
interface ComponentProps {
  // Props definition
}

export default function Component({ prop1, prop2 }: ComponentProps) {
  // Hooks
  // Event handlers
  // Render logic
  
  return (
    // JSX
  );
}
```

### Styling

- Use Tailwind CSS for styling
- Follow mobile-first responsive design
- Use semantic class names
- Maintain consistency with the design system

## 📚 Documentation

### Code Documentation

- Add JSDoc comments for complex functions
- Document API endpoints and their parameters
- Update README.md when adding new features
- Keep documentation in sync with code changes

### API Documentation

When adding new API endpoints:

1. Document the endpoint in the appropriate docs file
2. Include request/response examples
3. Document error cases
4. Update the API reference

## 🔍 Code Review Process

### Before Submitting a PR

1. **Self-review your code**
   - Check for console.log statements
   - Ensure proper error handling
   - Verify type safety

2. **Run the full test suite**
   ```bash
   npm run typecheck
   npm test
   npm run build
   ```

3. **Update documentation**
   - Update relevant docs
   - Add/update tests
   - Update changelog if needed

### Pull Request Guidelines

1. **Use the PR template**
   - Fill out all sections
   - Link related issues
   - Add screenshots for UI changes

2. **Keep PRs focused**
   - One feature/fix per PR
   - Keep changes as small as reasonable
   - Split large features into multiple PRs

3. **Write descriptive titles and descriptions**
   - Explain what the PR does
   - Explain why the change is needed
   - Mention any breaking changes

### Review Process

1. **Automated checks** must pass
   - TypeScript compilation
   - Tests
   - Linting

2. **Manual review** by maintainers
   - Code quality
   - Architecture decisions
   - Documentation completeness

3. **Testing** in development environment
   - Feature functionality
   - No regressions
   - Performance impact

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Environment information**
   - OS and version
   - Browser and version
   - Node.js version

2. **Steps to reproduce**
   - Detailed steps
   - Expected behavior
   - Actual behavior

3. **Additional context**
   - Screenshots/videos
   - Error messages
   - Related issues

## 💡 Feature Requests

For new features:

1. **Check existing issues** first
2. **Describe the use case** clearly
3. **Provide examples** of how it would work
4. **Consider alternatives** and explain why this approach is best

## 📞 Getting Help

- **GitHub Issues** - For bugs and feature requests
- **GitHub Discussions** - For questions and community discussion
- **Discord** - Real-time chat with the community (if available)

## 📄 License

By contributing to AdgenXAI, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AdgenXAI! 🎉
