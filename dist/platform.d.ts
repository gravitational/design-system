/**
 * Teleport
 * Copyright (C) 2023  Gravitational, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
export declare enum Platform {
    Windows = "Windows",
    macOS = "macOS",
    Linux = "Linux"
}
export declare enum UserAgent {
    Windows = "Windows",
    macOS = "Macintosh",
    Linux = "Linux"
}
/**
 * getPlatform returns the platform of the user based on the browser user agent or the Node.js
 * binary.
 *
 * getPlatform must work in both environments. It must be defined within the design package and not
 * the shared package to avoid circular dependencies – the design package needs to be able to detect
 * the platform and the shared package depends on the design package.
 */
export declare function getPlatform(): Platform;
