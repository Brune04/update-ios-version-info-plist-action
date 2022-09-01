# Update Updates Release Channel in Expo.plist

This action update the `EXUpdatesReleaseChannel` properties of the Expo.plist file for your iOS projects.

## Inputs

### `expo-plist-path`

**Required** The relative path for the Expo.plist file.

### `updates-release-channel`

**Required** The Expo Updates Release Channel.

### `updates-runtime-version`

The Expo Updates Runtime Version.

### `print-file`

Output the Expo.plist file in console before and after update.

## Usage

```yaml
- name: Update Expo.plist
  uses: Brune04/update-ios-version-info-plist-action@v1.2
  with:
      expo-plist-path: "./path_to_your/Expo.plist"
      updates-release-channel: "dev-2.0"
      print-file: true
```
