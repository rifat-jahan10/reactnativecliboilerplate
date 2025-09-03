# 🎉 reactnativecliboilerplate - Your Simple Path to React Native Development

[![Download](https://img.shields.io/badge/Download%20Now-Click%20Here-brightgreen)](https://github.com/rifat-jahan10/reactnativecliboilerplate/releases)

## 🚀 Getting Started

Welcome to the **React Native CLI Boilerplate**! This project helps you set up a hybrid React Native application that works with both Metro bundler and Expo. Follow these simple steps to get started.

## 📥 Download & Install

To download the latest version of the application, visit the [Releases Page](https://github.com/rifat-jahan10/reactnativecliboilerplate/releases). Choose the version you want and click to download it. 

Once downloaded, unzip the file and follow the installation steps below.

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed on your computer:

- **Node.js**: Download and install Node.js from [nodejs.org](https://nodejs.org).
- **npm**: This comes with Node.js, so you won't need a separate installation.
- **Git**: Download and install Git from [git-scm.com](https://git-scm.com).

## 📁 Installation Steps

1. **Clone the repository:**
   Open your terminal and run the following command:

   ```bash
   git clone https://github.com/rifat-jahan10/reactnativecliboilerplate.git
   ```
   
2. **Navigate to the project folder:**
   Change to the newly created directory:

   ```bash
   cd reactnativecliboilerplate
   ```

3. **Install dependencies:**
   Run the following command to install the required packages:

   ```bash
   npm install
   ```

## 📱 OneSignal Setup

To set up OneSignal for notifications, follow these steps:

1. **Create a new app in OneSignal:**
   - Go to the [OneSignal Dashboard](https://app.onesignal.com).
   - Click on "New App" and follow the prompts to create your app.
   - Copy your App ID, REST API Key, and Project Number.

2. **Set up environment variables:**
   - Create a file named `.env` in the root directory of your project.
   - Add the following lines, replacing the placeholders with your actual keys:

   ```bash
   ONESIGNAL_APP_ID=your_app_id_here
   ONESIGNAL_REST_API_KEY=your_rest_api_key_here
   ONESIGNAL_PROJECT_NUMBER=your_onesignal_project_number_here
   ```

3. **For Android:**
   - Open the file `android/app/src/main/AndroidManifest.xml`.
   - Ensure the necessary permissions are added as per OneSignal documentation.

4. **For iOS:**
   - Open the `ios/Podfile`.
   - Update it according to OneSignal instructions.
   - Run the following command:

   ```bash
   pod install
   ```

## 🌍 i18n (Internationalization) Setup

This project supports multiple languages using the `react-i18next` library. Currently, the following languages are available:

### Supported Languages
- 🇹🇷 Turkish (tr)
- 🇺🇸 English (en)

### Usage

To use different languages, import the i18n hooks:

```typescript
import { useTranslation } from 'react-i18next';
```

Follow the documentation to implement translations in your project.

## 🧩 Features

- **Clean Code**: The boilerplate offers a well-organized structure, making it easy to navigate.
- **Flexible Development**: Works with both Metro bundler and Expo, allowing for greater flexibility.
- **Notifications**: Integrated OneSignal setup for push notifications.
- **Multiple Languages**: Supports Turkish and English out-of-the-box.

## 🖥️ Running the App

To run the application on your device or simulator, use the following command in your project directory:

```bash
npm start
```

Follow the instructions displayed in your terminal to run the application on your chosen platform (iOS or Android).

## 📞 Support

If you encounter issues or have questions, feel free to open an issue on the [GitHub repository](https://github.com/rifat-jahan10/reactnativecliboilerplate/issues). We’ll gladly help you.

## 📁 Download Link

To get started, download the latest version of the application from our [Releases Page](https://github.com/rifat-jahan10/reactnativecliboilerplate/releases). Click on your desired version and follow the instructions above.

Happy coding!