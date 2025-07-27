/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

import St from 'gi://St';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import Soup from 'gi://Soup';
import { panel } from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import { Button } from 'resource:///org/gnome/shell/ui/panelMenu.js';

const ByteArray = imports.byteArray;
const IP_SERVICE_URL = 'https://ifconfig.me/ip';

export default class ShowMyIpExtension extends Extension {
    enable() {
        const box = new St.BoxLayout({ vertical: false });
        const buttonStyle = 0;
        const buttonInternalName = "Show My IP";
        const buttonIsInteractive = false;

        const lanIcon = new St.Icon({
            icon_name: 'network-wired-symbolic',
            style_class: 'system-status-icon',
        });

        const wanIcon = new St.Icon({
            icon_name: 'network-workgroup-symbolic',
            style_class: 'system-status-icon',
        });

        this._lanLabel = new St.Label({
            text: "Loading...",
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._wanLabel = new St.Label({
            text: "Loading...",
            y_align: Clutter.ActorAlign.CENTER,
        });

        this._indicator = new Button(
            buttonStyle, 
            buttonInternalName, 
            buttonIsInteractive
        );

        box.add_child(lanIcon);
        box.add_child(this._lanLabel);
        box.add_child(wanIcon);
        box.add_child(this._wanLabel);

        this._indicator.add_child(box);

        panel.addToStatusArea('show-my-ip', this._indicator, 0);

        this._httpSession = new Soup.Session();

        this._updateIp();

        this._timeout = GLib.timeout_add_seconds(GLib.PRIORITY_DEFAULT, 30, () => {
            this._updateIp();
            return true;
        });
    }

    disable() {
        if (this._timeout) {
            GLib.source_remove(this._timeout);
            this._timeout = null;
        }
        if (this._httpSession) {
            this._httpSession.abort();
            this._httpSession = null;
        }
        if (this._indicator) {
            this._indicator.destroy();
        }
    }

    _updateIp() {
        const ipLocal = this._getLocalIp();
        this._lanLabel.set_text(ipLocal);
        this._getPublicIp().then(ipPublic => {
            this._wanLabel.set_text(ipPublic);
        }).catch(() => {
            this._wanLabel.set_text('IP error');
        });
    }

    _getLocalIp() {
        try {
            let command = "bash -c \"ip route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if ($i==\\\"src\\\") print $(i+1)}'\"";

            let [ok, stdout, stderr, status] = GLib.spawn_command_line_sync(command);

            if (ok && status === 0) {
                let ip = ByteArray.toString(stdout).trim();
                return ip || "IP not found";
            } else {
                return "IP not found";
            }
        } catch (e) {
            return "IP error";
        }
    }

    _getPublicIp() {
        return new Promise((resolve, reject) => {
            const message = Soup.Message.new('GET', IP_SERVICE_URL);

            this._httpSession.send_and_read_async(message, GLib.PRIORITY_DEFAULT, null, (session, result) => {
                try {
                    const bytes = session.send_and_read_finish(result);
                    if (message.get_status() === Soup.Status.OK) {
                        const response = ByteArray.toString(bytes.get_data());
                        resolve(response.trim());
                    } else {
                        reject(new Error(`HTTP error: ${message.get_status()}`));
                    }
                } catch (e) {
                    reject(e);
                }
            });
        });
    }

    _getPublicIpByCurl() {
        try {
            let command = `/bin/sh -c "curl -s ifconfig.me"`;

            let [ok, stdout, stderr, status] = GLib.spawn_command_line_sync(command);

            if (ok && status === 0) {
                let ip = ByteArray.toString(stdout).trim();
                return ip;
            } else {
                let ip = "IP not found"
                return ip;
            }
        } catch (e) {
            ip = "IP error";
            return ip;
        }
    }
}
