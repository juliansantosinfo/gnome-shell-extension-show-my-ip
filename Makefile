PACKAGE_NAME=show-my-ip@github.com.juliansantosinfo

install:
	mkdir -p ~/.local/share/gnome-shell/extensions/${PACKAGE_NAME}
	cp extension.js ~/.local/share/gnome-shell/extensions/${PACKAGE_NAME}
	cp LICENSE ~/.local/share/gnome-shell/extensions/${PACKAGE_NAME}
	cp metadata.json ~/.local/share/gnome-shell/extensions/${PACKAGE_NAME}
	cp README.md ~/.local/share/gnome-shell/extensions/${PACKAGE_NAME}
	cp -r icons ~/.local/share/gnome-shell/extensions/${PACKAGE_NAME}

package:
	mkdir -p dist
	zip -r dist/${PACKAGE_NAME}.zip extension.js LICENSE metadata.json README.md