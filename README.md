## Show My IP

Show My IP is a GNOME Shell extension that displays your local (LAN) and public (WAN) IP addresses in the top bar.

### Features

* **Displays IP Addresses:** Shows both your local and public IP addresses.
* **Automatic Updates:** The extension updates the IP addresses every 5 seconds.
* **Simple Interface:** Presents the IP information in the top bar with a label that says, for example, `LAN: 192.168.1.100 | WAN: 203.0.113.1`.

### How it Works

The extension retrieves your local IP address by executing a shell command that uses `ip` and `awk`. The public IP address is fetched by making an HTTP GET request to `https://ifconfig.me/ip`.

### Installation

The extension is compatible with GNOME Shell versions 46, 47, and 48.

### Development

The `package.json` file includes development dependencies for commitlint and husky, which are used for managing commit messages. The `prepare` script runs `husky`. The extension is licensed under the GNU General Public License (GPL-2.0-or-later).

### Contributing

We welcome contributions! Please read our:
- [Contributing Guidelines](CONTRIBUTING.md) for development workflows
- [Code of Conduct](CODE_OF_CONDUCT.md) for community standards

You can find the project repository on [GitHub](https://github.com/juliansantosinfo/gnome-shell-extension-show-my-ip). The author is Julian de Alemida Santos. Donations can be made via GitHub Sponsors.

---

**Project Links**:
- [Report an Issue](https://github.com/juliansantosinfo/gnome-shell-extension-show-my-ip/issues)
- [Changelog](CHANGELOG.md) (consider adding this file)
- [License](LICENSE)