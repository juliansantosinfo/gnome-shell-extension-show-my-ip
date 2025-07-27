# Contributing to Show My IP

Thank you for your interest in contributing to our GNOME Shell extension! This document outlines how you can help improve the project.

## 🚀 Getting Started

1. **Communication**:
   - For major changes, please open an issue first to discuss your proposal
   - For small fixes, feel free to submit a PR directly

2. **Development Environment**:
   - GNOME Shell 46+
   - Node.js (for build tools)
   - `glib-compile-schemas` installed

## 🛠 Setup Instructions

1. Clone the repository:
   ```bash
   git clone https://github.com/juliansantosinfo/gnome-shell-extension-show-my-ip.git
   cd gnome-shell-extension-show-my-ip
   ```

2. Install development dependencies:
   ```bash
   sudo apt-get install nodejs gettext meson
   ```

3. Compile GSettings schemas:
   ```bash
   glib-compile-schemas schemas/
   ```

## 🔄 Workflow

1. Create a feature branch:
   ```bash
   git checkout -b my-feature
   ```

2. Make your changes following our standards:
   - Use ES6+ JavaScript syntax
   - Maintain consistent code style
   - Document new features

3. Test your changes:
   ```bash
   make install && gnome-shell --replace
   ```

4. Submit your Pull Request:
   - Clearly describe the changes
   - Include screenshots when applicable
   - Reference related issues (e.g., "Fixes #123")

## 📜 Code Standards

- **JavaScript**:
  ```javascript
  // Use camelCase for variables/functions
  const myVariable = 'example';
  
  function myFunction() {
    // Place comments above the code
    return true;
  }
  ```

- **Commit Messages**:
  ```
  type(scope): concise message

  Examples:
  feat(ip): add IPv6 support
  fix(ui): correct panel alignment
  docs: update contributing guide
  ```

## 🐛 Reporting Bugs

When creating an issue, please include:
1. GNOME Shell version
2. Steps to reproduce
3. Expected vs. actual behavior
4. Error logs (if available)

## 🌍 Translations

To contribute translations:
1. Edit `.po` files in the `po/` directory
2. Update strings with:
   ```bash
   make update-po
   ```

## 📃 License

By contributing, you agree to license your work under the GPL-2.0-or-later license.

Thank you for helping improve this extension! 💙
