<div align="center">
  <img src="https://www.dropbox.com/scl/fi/b5836ni4cpjjipmufag2j/logo.png?rlkey=lhcosvpxhdqjgumedoi34a8ze&st=57vjq5hb&raw=1" alt="QRWallet Logo" width="120" style="border-radius: 20px;">
  
  # QRWallet 
  ### The Ultimate Offline UPI Ledger & QR Manager
  
  [![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
  [![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
  [![100% Offline](https://img.shields.io/badge/100%25_Offline-10B981?style=for-the-badge&logo=cachet&logoColor=white)](#-privacy-promise)
  [![No Ads](https://img.shields.io/badge/No_Ads-FF3366?style=for-the-badge&logo=adblock&logoColor=white)](#)

  <p align="center">
    <strong>Experience a highly secure, beautifully crafted digital wallet designed solely for managing your UPI QR codes. No clutter. No internet needed. No compromises.</strong>
  </p>
  
  [**⬇️ Download APK (Android)**](https://github.com/soumyadip-adak99/QRWallet/releases/download/v1.0.0/QRWallet.apk) | [**Explore the Web Demo**](#)
</div>

<br/>

## 📸 App Interface

Take a look at the meticulously crafted premium interface, designed to feel like a flagship OS application.

| Dashboard & Overview | QR Generator & Tools | Live Native Scanning | Theming & Settings |
|:---:|:---:|:---:|:---:|
| <img src="https://www.dropbox.com/scl/fi/02qihla8ao6vseuu1x68e/IMG_20260705_005929.jpg?rlkey=s6iv2wmdnt5ohzsz28x6gn1bo&st=5cnus1qa&raw=1" width="200" style="border-radius:15px;"/> | <img src="https://www.dropbox.com/scl/fi/svdxq26vufe7u85rleuv2/IMG_20260705_010004.jpg?rlkey=7ocysldqdbxlmcib1vyvfr06k&st=fxq5saxr&raw=1" width="200" style="border-radius:15px;"/> | <img src="https://www.dropbox.com/scl/fi/ax3mrcman0wgl0el9l2jh/IMG_20260705_010140.jpg?rlkey=hpe5aqpozhhytvge0x43huktw&st=ajlxd1it&raw=1" width="200" style="border-radius:15px;"/> | <img src="https://www.dropbox.com/scl/fi/2xg0rwzdpxarl0yvxat4a/IMG_20260705_010202.jpg?rlkey=fm8bkra0b9dlbj8f9k1r5xdfe&st=xa7kd06l&raw=1" width="200" style="border-radius:15px;"/> |

<hr>

## 🌟 What is QRWallet?

### 👥 For Everyday Users (Non-Tech)
Have you ever struggled to find that one UPI QR code you saved in your phone's gallery months ago? **QRWallet** fixes this. 

It is a digital binder for all your UPI payment codes. You can instantly scan a friend's QR, or generate a new one by just typing their UPI ID, and save it in the app. The app automatically groups them by apps like GPay, PhonePe, Paytm, or BHIM. 

**Why you'll love it:**
- **Zero Internet Required:** Your data never leaves your phone. It works perfectly even in airplane mode.
- **Privacy by Default:** There are no backend servers, no cloud storage, and absolutely zero ads or tracking.
- **Lightning Fast:** Fluid animations and instant loads mean you're never waiting to make a payment.

### 💻 For Developers & Tech Enthusiasts
Under the hood, QRWallet is a showcase of modern React Native development. It prioritizes offline-first architecture, buttery smooth 60fps animations, and strict type safety.

**Technical Highlights:**
- **Framework:** React Native with Expo SDK 51+ and Expo Router for file-based navigation.
- **State Management:** Powered by `Zustand` and persisted instantly to disk via `react-native-mmkv` for synchronous, high-performance storage.
- **Animations:** Fully utilizing `react-native-reanimated` v3 for layout transitions, shared element transitions, and gesture-driven UI.
- **Hardware Integration:** Native camera parsing using `expo-camera` to instantly decode `upi://pay` URIs, alongside `expo-haptics` for tactile physical feedback.

<hr>

## 🚀 Features at a Glance

* 📷 **Live Native Scanning:** A full-screen camera overlay instantly parses UPI links and auto-populates your saving form.
* 🎨 **Provider Branding:** Assign specific bank/app branding to your QRs. The app dynamically applies the gorgeous gradient associated with that provider.
* ⌨️ **Keyboard Aware UI:** Built with meticulous attention to input handling. Forms smoothly float above the iOS/Android keyboard without flickering or jumping.
* 📱 **Push Notifications:** Instant native feedback when a new QR code is generated or when you update your profile.
* 🌙 **Dark/Light Mode:** Gorgeous system-aware theming designed to save battery on OLED screens and reduce eye strain.

<hr>

## 📥 Download & Install

You don't need to build the app from source to enjoy it! You can download the latest Android release directly:

**[Download QRWallet v1.0.0 APK](https://github.com/soumyadip-adak99/QRWallet/releases/download/v1.0.0/QRWallet.apk)**

**How to install on Android:**
1. Download the `.apk` file to your device.
2. Tap on the downloaded file.
3. If prompted, grant your browser or file manager permission to "Install unknown apps".
4. Follow the on-screen instructions and enjoy!

<hr>

## 🛠 Development Setup

Want to contribute, tweak, or build it yourself? Setting up the repository is incredibly easy.

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Expo Go app installed on your physical device (or an Android/iOS emulator)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/QRWallet.git
   cd QRWallet
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Start the Development Server:**
   ```bash
   npx expo start
   ```

4. **Run the App:**
   - Scan the QR code shown in the terminal using your phone's camera (iOS) or the Expo Go app (Android).
   - Press `a` in the terminal to open on a connected Android emulator.
   - Press `i` to open in an iOS simulator (Requires macOS).

*(Note: If you run into issues on Expo Go, ensure you are not relying on removed remote push notification dependencies, as this app utilizes local device alerts to ensure Expo Go compatibility.)*

<hr>

## 🔒 The Privacy Promise

QRWallet was built out of a necessity for an organizational tool that **doesn't spy on you**. Financial data, even just UPI IDs, is personal. 

- **No Analytics:** We don't track what you tap.
- **No Crashlytics:** We don't send crash reports to a server.
- **No Cloud:** Your data is written directly to your device's solid-state storage. If you uninstall the app, your data is gone forever.

<hr>

<div align="center">
  <p>Built with ❤️ by <strong>Soumyadip Adak</strong></p>
  <p>
    <a href="mailto:work.soumyadipadak@gmail.com">Contact Developer</a>
  </p>
</div>
