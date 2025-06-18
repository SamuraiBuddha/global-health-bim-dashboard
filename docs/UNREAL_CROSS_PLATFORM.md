# Unreal Engine Cross-Platform Development Guide

## Overview

This guide details the complete cross-platform strategy for developing the Global Health Dashboard using Unreal Engine 5, targeting all major desktop and mobile platforms.

## Platform Support Matrix

| Platform | UE5 Support | Build Target | Min Version | Notes |
|----------|-------------|--------------|-------------|-------|
| **Windows** | ✅ Primary | Win64 | Windows 10 | Best development environment |
| **macOS** | ✅ Full | Mac | macOS 10.15 | Intel & Apple Silicon |
| **Linux** | ✅ Full | Linux | Ubuntu 20.04 | Various distros supported |
| **Android** | ✅ Full | Android | API 26 (8.0) | ARMv7, ARM64 |
| **iOS** | ✅ Full | iOS | iOS 14.0 | iPhone & iPad |

## Development Environment Setup

### Windows Development (Primary)
```bash
# Required Software
- Visual Studio 2022 (with C++ workload)
- Unreal Engine 5.4+ from Epic Games Launcher
- Android Studio (for Android builds)
- Git for Windows

# Recommended Specs
- Windows 10/11 64-bit
- 32GB+ RAM
- NVIDIA RTX 3060+ or AMD equivalent
- 500GB+ SSD
```

### macOS Development
```bash
# Required Software
- Xcode 14+
- Unreal Engine 5.4+ from Epic Games Launcher
- Android Studio (for Android builds)
- Command Line Tools

# M1/M2 Macs fully supported with native ARM builds
```

### Linux Development
```bash
# Ubuntu/Debian setup
sudo apt-get update
sudo apt-get install build-essential mono-mcs mono-devel mono-xbuild
sudo apt-get install cmake dos2unix git unzip
sudo apt-get install libx11-dev libxcursor-dev libxrandr-dev libxi-dev
sudo apt-get install libnss3 libgconf-2-4 libgtk-3-0
```

## Project Architecture for Cross-Platform

### Core Module Structure
```
GlobalHealthDashboard/
├── Source/
│   ├── Core/                    # Platform-agnostic core logic
│   │   ├── DataModels/         # Health data structures
│   │   ├── Networking/         # API communication
│   │   └── BusinessLogic/      # Donation tracking, etc.
│   ├── Platforms/              # Platform-specific implementations
│   │   ├── Windows/
│   │   ├── Mac/
│   │   ├── Linux/
│   │   ├── Android/
│   │   └── iOS/
│   └── UI/                     # Shared UI components
│       ├── Globe/              # 3D globe visualization
│       ├── Widgets/            # HUD elements
│       └── Menus/              # Navigation
```

### Platform-Specific Features

#### Mobile Optimizations (Android/iOS)
```cpp
// Example: Platform-specific ad integration
#if PLATFORM_ANDROID || PLATFORM_IOS
    #include "MobileAds/MobileAdManager.h"
    
    void UDonationManager::ShowScrollAd()
    {
        #if PLATFORM_ANDROID
            UMobileAdManager::ShowAndroidAd(AdType::Scroll);
        #elif PLATFORM_IOS
            UMobileAdManager::ShowIOSAd(AdType::Scroll);
        #endif
    }
#endif
```

#### Desktop Features (Windows/Mac/Linux)
```cpp
// Example: Enhanced graphics for desktop
#if PLATFORM_DESKTOP
    void AGlobeActor::BeginPlay()
    {
        Super::BeginPlay();
        
        // Enable high-quality rendering on desktop
        SetRenderQuality(ERenderQuality::Epic);
        EnableRayTracing(true);
        SetMaxDrawDistance(50000.0f);
    }
#endif
```

## Build Configuration

### Project Settings (DefaultEngine.ini)
```ini
[/Script/Engine.Engine]
+ActiveGameNameRedirects=(OldGameName="/Script/TP_Blank",NewGameName="/Script/GlobalHealthDashboard")

[/Script/IOSRuntimeSettings.IOSRuntimeSettings]
BundleIdentifier=com.ehrigbim.globalhealthdashboard
VersionInfo=1.0.0
bSupportsPortraitOrientation=True
bSupportsLandscapeLeftOrientation=True

[/Script/AndroidRuntimeSettings.AndroidRuntimeSettings]
PackageName=com.ehrigbim.globalhealthdashboard
VersionDisplayName=1.0.0
MinSDKVersion=26
TargetSDKVersion=33
bBuildForArmV7=True
bBuildForArm64=True

[/Script/LinuxTargetPlatform.LinuxTargetSettings]
TargetArchitecture=X86_64UnknownLinuxGnu
```

### Platform-Specific Build Scripts

#### Windows Build Script (BuildWindows.bat)
```batch
@echo off
set UE5_PATH="C:\Program Files\Epic Games\UE_5.4"
set PROJECT_PATH="%~dp0\..\GlobalHealthDashboard.uproject"

%UE5_PATH%\Engine\Build\BatchFiles\RunUAT.bat BuildCookRun ^
    -project=%PROJECT_PATH% ^
    -platform=Win64 ^
    -clientconfig=Shipping ^
    -build -cook -stage -package -pak
```

#### macOS Build Script (BuildMac.sh)
```bash
#!/bin/bash
UE5_PATH="/Users/Shared/Epic Games/UE_5.4"
PROJECT_PATH="$(dirname "$0")/../GlobalHealthDashboard.uproject"

"$UE5_PATH/Engine/Build/BatchFiles/RunUAT.sh" BuildCookRun \
    -project="$PROJECT_PATH" \
    -platform=Mac \
    -clientconfig=Shipping \
    -build -cook -stage -package -pak
```

#### Android Build Script (BuildAndroid.sh)
```bash
#!/bin/bash
# Ensure Android SDK/NDK paths are set
export ANDROID_HOME=$HOME/Android/Sdk
export NDKROOT=$ANDROID_HOME/ndk/25.1.8937393

UE5_PATH="/opt/UnrealEngine"
PROJECT_PATH="$(pwd)/GlobalHealthDashboard.uproject"

$UE5_PATH/Engine/Build/BatchFiles/RunUAT.sh BuildCookRun \
    -project="$PROJECT_PATH" \
    -platform=Android \
    -cookflavor=ASTC \
    -clientconfig=Shipping \
    -build -cook -stage -package
```

## Monetization Integration

### Samsung Global Goals-Style Ad System

#### Core Ad Manager (Cross-Platform)
```cpp
UCLASS()
class GLOBALHEALTHDASHBOARD_API UAdManager : public UObject
{
    GENERATED_BODY()
    
public:
    // Platform-agnostic ad interface
    UFUNCTION(BlueprintCallable, Category = "Ads")
    void ShowScrollAd();
    
    UFUNCTION(BlueprintCallable, Category = "Ads")
    float GetEarningsPerAd() { return 0.05f; } // $0.05 per ad
    
    UPROPERTY(BlueprintReadOnly, Category = "Ads")
    float TotalEarnings = 0.0f;
    
private:
    void RecordAdView();
    void UpdateDonationPool();
};
```

### Platform-Specific Ad Providers

#### Android (Google AdMob)
```xml
<!-- AndroidManifest.xml additions -->
<uses-permission android:name="android.permission.INTERNET"/>
<meta-data 
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-xxxxxxxxxxxxx~yyyyyyyyyy"/>
```

#### iOS (Apple Ads)
```xml
<!-- Info.plist additions -->
<key>SKAdNetworkItems</key>
<array>
    <dict>
        <key>SKAdNetworkIdentifier</key>
        <string>cstr6suwn9.skadnetwork</string>
    </dict>
</array>
```

## Performance Optimization

### Mobile Performance Targets
- 60 FPS on flagship devices
- 30 FPS on mid-range devices
- Dynamic quality scaling
- LOD system for globe detail

### Desktop Performance Features
- Uncapped framerate
- Ray tracing support
- 4K texture support
- Advanced post-processing

## Testing Strategy

### Device Testing Matrix
```yaml
Android:
  - Samsung Galaxy S23 (flagship)
  - Google Pixel 6a (mid-range)
  - OnePlus Nord (budget)
  
iOS:
  - iPhone 14 Pro (flagship)
  - iPhone 12 (mid-range)
  - iPad Air (tablet)
  
Windows:
  - RTX 4070 (high-end)
  - GTX 1660 (mid-range)
  - Intel Iris Xe (integrated)
  
macOS:
  - M2 MacBook Pro
  - Intel Mac Mini
  
Linux:
  - Ubuntu 22.04 (NVIDIA)
  - Fedora 38 (AMD)
```

## Deployment Pipeline

### CI/CD with GitHub Actions
```yaml
name: Cross-Platform Build

on:
  push:
    branches: [ main, develop ]

jobs:
  build-windows:
    runs-on: windows-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build Windows
        run: ./Scripts/BuildWindows.bat
        
  build-mac:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v3
      - name: Build macOS
        run: ./Scripts/BuildMac.sh
        
  build-android:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Android SDK
        uses: android-actions/setup-android@v2
      - name: Build Android
        run: ./Scripts/BuildAndroid.sh
```

## Store Submissions

### Google Play Store
- Package as AAB (Android App Bundle)
- Target API level 33+
- 64-bit requirement
- Privacy policy required

### Apple App Store
- Universal binary (Intel + ARM)
- App Store Connect setup
- TestFlight for beta testing
- App review guidelines compliance

### Microsoft Store (Windows)
- MSIX packaging
- Windows App Certification Kit
- Age rating required

### Steam (Windows/Mac/Linux)
- Steamworks SDK integration
- Steam Cloud saves
- Achievement system
- Workshop support for custom content

## Unique Features by Platform

### Mobile-Specific
- Touch gestures for globe rotation
- Lock screen widget (like Samsung)
- Push notifications for donation milestones
- Background ad loading while charging

### Desktop-Specific
- Multi-monitor support
- Keyboard shortcuts
- Advanced graphics settings
- Mod support for custom visualizations

## Next Steps

1. **Set up development environment** for your primary platform
2. **Clone the repository** and open in Unreal Engine
3. **Install platform SDKs** for target platforms
4. **Configure code signing** certificates
5. **Run platform-specific tests**
6. **Build and deploy** to test devices

## Resources

- [Unreal Engine Platform Development](https://docs.unrealengine.com/5.4/en-US/developing-for-different-platforms-in-unreal-engine/)
- [Mobile Development Guide](https://docs.unrealengine.com/5.4/en-US/mobile-development-in-unreal-engine/)
- [Pixel Streaming for Web](https://docs.unrealengine.com/5.4/en-US/pixel-streaming-in-unreal-engine/)
- [Platform-Specific Code](https://docs.unrealengine.com/5.4/en-US/platform-specific-code-in-unreal-engine/)

---

*This guide is part of the Global Health Dashboard project by Ehrig BIM & IT Consultation, Inc.*
