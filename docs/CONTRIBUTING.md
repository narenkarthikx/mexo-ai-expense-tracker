# Contributing to ExpenseAI

Thank you for your interest in contributing to ExpenseAI! This document provides guidelines and instructions for contributing.

## 🤝 How to Contribute

### Reporting Issues

1. **Check existing issues** before creating a new one
2. **Use the issue templates** when available
3. **Provide detailed information**:
   - Steps to reproduce
   - Expected vs actual behavior
   - Environment details (OS, browser, Node version)
   - Screenshots if applicable

### Suggesting Features

1. **Search existing feature requests** first
2. **Create a detailed proposal** including:
   - Use case and motivation
   - Proposed implementation approach
   - Potential challenges or considerations
   - Mockups or examples if applicable

### Contributing Code

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make your changes** following our coding standards
4. **Add tests** for new functionality
5. **Update documentation** as needed
6. **Submit a pull request**

## 📋 Development Setup

### Prerequisites

- Node.js 18+
- npm or pnpm
- Git
- Code editor (VS Code recommended)

### Setup Steps

1. Fork and clone the repository
2. Install dependencies: `npm install`
3. Copy environment file: `npm run setup:env`
4. Set up your development environment variables
5. Start development server: `npm run dev`

### Recommended VS Code Extensions

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- TypeScript Importer
- Prettier - Code formatter
- ESLint

## 🏗️ Project Architecture

### Technology Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Backend**: Next.js API routes, Supabase
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **AI**: OpenAI GPT-4 Vision
- **Styling**: Tailwind CSS, Shadcn/ui
- **PWA**: Next.js PWA plugin

### Folder Structure

```
app/          # Next.js App Router pages
components/   # Reusable React components
hooks/        # Custom React hooks
lib/          # Utility functions and configurations
types/        # TypeScript type definitions
public/       # Static assets
```

### Coding Standards

#### TypeScript

- Use strict TypeScript configuration
- Define proper interfaces and types
- Avoid `any` type when possible
- Use proper error handling

#### React

- Use functional components with hooks
- Follow React best practices
- Use proper key props for lists
- Implement proper error boundaries

#### Styling

- Use Tailwind CSS classes
- Follow responsive design principles
- Use Shadcn/ui components when possible
- Maintain consistent spacing and colors

#### Code Style

- Use Prettier for formatting
- Follow ESLint rules
- Use meaningful variable names
- Write clear, concise comments

## 🧪 Testing

### Running Tests

```bash
npm run test          # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Writing Tests

- Write unit tests for utility functions
- Write integration tests for API routes
- Write component tests for complex components
- Use Jest and React Testing Library

### Test Guidelines

- Test behavior, not implementation
- Use descriptive test names
- Setup and teardown properly
- Mock external dependencies

## 📝 Documentation

### Code Documentation

- Use JSDoc comments for functions
- Document complex logic
- Include examples in documentation
- Keep README and guides updated

### API Documentation

- Document all API endpoints
- Include request/response examples
- Specify error codes and messages
- Document authentication requirements

## 🚀 Deployment

### Environment Setup

Ensure all environment variables are properly configured:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
OPENAI_API_KEY=
```

### Build Process

```bash
npm run build        # Build for production
npm run start        # Test production build
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Build passes without errors
- [ ] Tests pass
- [ ] Performance optimized
- [ ] Security measures in place

## 🐛 Bug Fix Process

1. **Reproduce the bug** in development environment
2. **Write a failing test** that demonstrates the issue
3. **Fix the bug** with minimal changes
4. **Verify the test passes** and no regressions
5. **Update documentation** if necessary

## ✨ Feature Development Process

1. **Create an issue** or discussion first
2. **Get approval** from maintainers
3. **Design the feature** with proper planning
4. **Implement with tests** and documentation
5. **Submit PR** with detailed description

## 🔍 Code Review Process

### For Contributors

- **Self-review** your code before submitting
- **Write descriptive** PR titles and descriptions
- **Respond promptly** to review feedback
- **Update documentation** as needed

### For Reviewers

- **Be constructive** and helpful
- **Focus on code quality** and standards
- **Test the changes** locally if needed
- **Approve** when requirements are met

## 📋 Pull Request Guidelines

### PR Title Format

Use conventional commits:
- `feat: add receipt OCR processing`
- `fix: resolve authentication bug`
- `docs: update installation guide`
- `style: improve mobile responsive design`

### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tests pass locally
- [ ] Added new tests
- [ ] Manual testing completed

## Screenshots
(if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes
```

## 🤔 Getting Help

- **Discord**: Join our community chat
- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For questions and general discussion
- **Email**: Contact maintainers directly

## 📄 License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT License).

## 🙏 Recognition

All contributors will be recognized in our:
- README contributors section
- Release notes
- Hall of fame

Thank you for contributing to ExpenseAI! 🎉