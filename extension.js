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
import Gio from 'gi://Gio';
import Clutter from 'gi://Clutter';
import GLib from 'gi://GLib';
import Soup from 'gi://Soup';
import { panel } from 'resource:///org/gnome/shell/ui/main.js';
import { Extension } from 'resource:///org/gnome/shell/extensions/extension.js';
import { Button } from 'resource:///org/gnome/shell/ui/panelMenu.js';

const IP_SERVICE_URL = 'https://ifconfig.me/ip';

export default class ShowMyIpExtension extends Extension {
    enable() {
        this._box = new St.BoxLayout({ vertical: false });
        const buttonStyle = 0;
        const buttonInternalName = 'Show My IP';
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
            text: 'Loading...',
            y_align: Clutter.ActorAlign.CENTER,
        });
        this._wanLabel = new St.Label({
            text: 'Loading...',
            y_align: Clutter.ActorAlign.CENTER,
        });

        this._indicator = new Button(
            buttonStyle,
            buttonInternalName,
            buttonIsInteractive
        );

        this._box.add_child(lanIcon);
        this._box.add_child(this._lanLabel);
        this._box.add_child(wanIcon);
        this._box.add_child(this._wanLabel);

        this._indicator.add_child(this._box);

        panel.addToStatusArea('show-my-ip', this._indicator, 1, 'left');

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
        this._wanLabel?.destroy();
        this._wanLabel = null;
        this._lanLabel?.destroy();
        this._lanLabel = null;
        this._box?.destroy();
        this._box = null;
        this._indicator?.destroy();
        this._indicator = null;
    }

    _updateIp() {
        this._getLocalIp()
            .then(ipLocal => {
                if (this._lanLabel)
                    this._lanLabel.set_text(ipLocal);
            })
            .catch(err => {
                console.error(`Show My IP: LAN Error ${err}`);
                if (this._lanLabel)
                    this._lanLabel.set_text('LAN error');
            });

        this._getPublicIp()
            .then(ipPublic => {
                if (this._wanLabel)
                    this._wanLabel.set_text(ipPublic);
            })
            .catch(err => {
                console.error(`Show My IP: WAN Error ${err}`);
                if (this._wanLabel)
                    this._wanLabel.set_text('WAN error');
            });
    }

    _getLocalIp() {
        return new Promise((resolve, reject) => {
            try {
                const proc = Gio.Subprocess.new(
                    ['bash', '-c', "ip route get 1.1.1.1 | awk '{for(i=1;i<=NF;i++) if ($i==\"src\") print $(i+1)}'"],
                    Gio.SubprocessFlags.STDOUT_PIPE | Gio.SubprocessFlags.STDERR_PIPE
                );
                proc.communicate_utf8_async(null, null, (p, res) => {
                    try {
                        const [, stdout, stderr] = p.communicate_utf8_finish(res);
                        if (p.get_successful()) {
                            resolve(stdout.trim() || 'IP not found');
                        } else {
                            console.error(`Show My IP: Subprocess error ${stderr}`);
                            resolve('IP not found');
                        }
                    } catch (e) {
                        reject(e);
                    }
                });
            } catch (e) {
                reject(e);
            }
        });
    }

    _getPublicIp() {
        return new Promise((resolve, reject) => {
            if (!this._httpSession) {
                reject(new Error('No HTTP session'));
                return;
            }

            const message = Soup.Message.new('GET', IP_SERVICE_URL);

            this._httpSession.send_and_read_async(message, GLib.PRIORITY_DEFAULT, null, (session, result) => {
                try {
                    const bytes = session.send_and_read_finish(result);
                    if (message.get_status() === Soup.Status.OK) {
                        const response = new TextDecoder().decode(bytes.toArray());
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
}
