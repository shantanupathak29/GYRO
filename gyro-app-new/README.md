# GYRO React Native App
## Fall Detection Caregiver Dashboard

---

## FILE STRUCTURE

```
gyro-app/
├── App.js                          ← Root entry point
├── package.json                    ← Dependencies
├── babel.config.js
└── src/
    ├── context/
    │   └── FallContext.js          ← Global state (sensors, fall events, simulation)
    ├── utils/
    │   └── theme.js                ← Colors, fonts, spacing tokens
    ├── components/
    │   ├── MiniChart.js            ← SVG accelerometer sparkline
    │   ├── SensorBar.js            ← Animated sensor value bars
    │   └── StageIndicator.js       ← 3-stage fall detection display
    ├── screens/
    │   ├── DashboardScreen.js      ← Main monitoring dashboard
    │   ├── AlertScreen.js          ← Full-screen fall alert
    │   ├── HistoryScreen.js        ← Alert event log
    │   └── ProfileScreen.js        ← Patient + device profile
    └── navigation/
        └── AppNavigator.js         ← Bottom tab navigator
```

---

## SETUP (Expo — Recommended)

### Prerequisites
- Node.js 18+
- npm or yarn
- Expo Go app on your phone (iOS/Android)
  OR Android Studio / Xcode for emulator

### Steps

```bash
# 1. Install dependencies
cd gyro-app
npm install

# 2. Start Expo dev server
npx expo start

# 3. Options to run:
#    → Press 'a' for Android emulator
#    → Press 'i' for iOS simulator
#    → Scan QR code with Expo Go app on your phone
```

---

## SCREENS

### 1. Dashboard (main)
- Live MPU6050 sensor data (AX, AY, AZ, |a|) with animated bars
- Real-time SVG accelerometer chart
- 3-Stage fall detection indicator
- Stats: falls count, accel magnitude, device uptime
- **"▶ Simulate Fall"** button — triggers the full 3-stage sequence
- Fall alert banner with "Call Emergency", "Mark Safe", "Reset"

### 2. Alert
- Full-screen emergency view with pulsing rings
- Stage progress pills (Impact → Tilt → Stillness)
- WhatsApp alert chip (simulated)
- Shake animation when fall is confirmed
- Call Emergency / Mark Safe buttons

### 3. History
- FlatList of all events (falls, safe marks, system start)
- Color-coded badges (FALL = red, SAFE = green, OK = blue)
- Summary chips: total falls, safe events, total log entries

### 4. Profile
- Patient info: Ram Kumar, 72, Dehradun
- Device: GYRO-001, ESP32, MPU6050, battery %, uptime
- Caregiver: Priya Kumar, +91 98765 43210
- Thresholds: impact > 2.0g, tilt > 45°, stillness 2000ms
- Hardware cost breakdown: ₹700–1200

---

## HOW FALL SIMULATION WORKS

The app replicates the exact 3-stage algorithm from `sketch.ino`:

| Time  | Event                        | Sensors              |
|-------|------------------------------|----------------------|
| 200ms | Stage 1 — Impact spike       | AX=2.1g, AY=3.1g    |
| 900ms | Stage 2 — Tilt detected      | Body orientation shift |
| 1600ms| Stage 3 — Stillness begins   | Near-zero movement   |
| 3200ms| FALL CONFIRMED               | Alert triggered      |

---

## ADDING REAL FIREBASE BACKEND

When ready to connect to real hardware:

```javascript
// In FallContext.js, inside triggerFallAlert():
const response = await fetch('https://your-firebase-function.com/fall-alert', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    deviceId: 'GYRO-001',
    timestamp: new Date().toISOString(),
    location: 'Dehradun, Uttarakhand',
    patientName: 'Ram Kumar',
  }),
});
```

---

## TECH STACK

| Layer      | Tech                            |
|------------|---------------------------------|
| Framework  | React Native (Expo)             |
| Navigation | React Navigation (bottom tabs)  |
| Charts     | react-native-svg (custom)       |
| State      | React Context + useState/useRef |
| Animations | React Native Animated API       |
| (Future)   | Firebase + Twilio               |

---

## HACKATHON DEMO FLOW

```
STEP 1 → Open app → Dashboard tab
STEP 2 → Show live sensor bars fluctuating
STEP 3 → Click "▶ Simulate Fall"
STEP 4 → Watch Stage 1 → 2 → 3 light up
STEP 5 → Fall alert banner + red flash appears
STEP 6 → Switch to Alert tab — full screen emergency
STEP 7 → Switch to History tab — shows event log
STEP 8 → "In production, this triggers Firebase + Twilio WhatsApp"
STEP 9 → Click "Mark Safe" → system resets
```
