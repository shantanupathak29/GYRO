import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';

const FallContext = createContext();

export const useFall = () => useContext(FallContext);

// ── SENSOR SIMULATION HELPERS ──────────────────────
function randomWalk(base, noise) {
  return base + (Math.random() - 0.5) * noise;
}

function clamp(val, min, max) {
  return Math.max(min, Math.min(max, val));
}

export const FallProvider = ({ children }) => {
  // ── SENSOR STATE ──────────────────────────────────
  const [sensors, setSensors] = useState({ ax: 0.02, ay: -0.01, az: 1.0, mag: 1.0 });
  const [accelHistory, setAccelHistory] = useState(Array(40).fill(1.0));

  // ── FALL STATE ────────────────────────────────────
  const [fallState, setFallState] = useState('idle'); // idle | stage1 | stage2 | stage3 | fallen
  const [fallCount, setFallCount] = useState(0);
  const [alertHistory, setAlertHistory] = useState([
    { id: 1, type: 'system', title: 'System Started', time: new Date(), badge: 'OK' },
  ]);
  const [startTime] = useState(Date.now());
  const [uptime, setUptime] = useState('00:00:00');
  const [isSimulating, setIsSimulating] = useState(false);

  const sensorRef = useRef({ ax: 0.02, ay: -0.01, az: 1.0 });
  const simTimersRef = useRef([]);

  // ── UPTIME CLOCK ──────────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const h = String(Math.floor(elapsed / 3600)).padStart(2, '0');
      const m = String(Math.floor((elapsed % 3600) / 60)).padStart(2, '0');
      const s = String(elapsed % 60).padStart(2, '0');
      setUptime(`${h}:${m}:${s}`);
    }, 1000);
    return () => clearInterval(t);
  }, [startTime]);

  // ── LIVE SENSOR LOOP ──────────────────────────────
  useEffect(() => {
    const t = setInterval(() => {
      if (fallState !== 'fallen' && !isSimulating) {
        const s = sensorRef.current;
        const ax = clamp(randomWalk(s.ax, 0.04), -2, 2);
        const ay = clamp(randomWalk(s.ay, 0.04), -2, 2);
        const az = clamp(randomWalk(s.az, 0.04), 0, 2);
        const mag = Math.sqrt(ax * ax + ay * ay + az * az);
        sensorRef.current = { ax, ay, az };
        setSensors({ ax, ay, az, mag });
        setAccelHistory(prev => {
          const next = [...prev.slice(1), mag];
          return next;
        });
      }
    }, 200);
    return () => clearInterval(t);
  }, [fallState]);

  // ── FORCED SENSOR VALUES ──────────────────────────
  const forceSensors = useCallback((ax, ay, az) => {
    sensorRef.current = { ax, ay, az };
    const mag = Math.sqrt(ax * ax + ay * ay + az * az);
    setSensors({ ax, ay, az, mag });
    setAccelHistory(prev => [...prev.slice(1), mag]);
  }, []);

  // ── FALL SIMULATION ───────────────────────────────
  const simulateFall = useCallback(() => {
    if (isSimulating || fallState === 'fallen') return;
    setIsSimulating(true);

    const addTimer = (fn, delay) => {
      const id = setTimeout(fn, delay);
      simTimersRef.current.push(id);
      return id;
    };

    // Stage 1 — impact spike
    addTimer(() => {
      setFallState('stage1');
      forceSensors(1.8, 2.6, 0.4);
    }, 200);
    addTimer(() => forceSensors(2.1, 3.1, 0.2), 300);
    addTimer(() => forceSensors(1.5, 2.8, 0.1), 400);

    // Stage 2 — tilt
    addTimer(() => {
      setFallState('stage2');
      forceSensors(0.1, 0.95, 0.3);
    }, 900);
    addTimer(() => forceSensors(0.0, 0.98, 0.2), 1050);

    // Stage 3 — stillness
    addTimer(() => {
      setFallState('stage3');
      forceSensors(0.0, 0.97, 0.25);
    }, 1600);

    // FALL ALERT
    addTimer(() => {
      setFallState('fallen');
      setIsSimulating(false);
      setFallCount(c => c + 1);
      sensorRef.current = { ax: 0.0, ay: 0.97, az: 0.25 };
      const now = new Date();
      setAlertHistory(prev => [
        {
          id: Date.now(),
          type: 'fall',
          title: '⚠ Fall Detected',
          time: now,
          badge: 'FALL',
          detail: `Stage 3 confirmed · ${now.toLocaleTimeString()}`,
        },
        ...prev,
      ]);
    }, 3200);
  }, [isSimulating, fallState, forceSensors]);

  // ── MARK SAFE ────────────────────────────────────
  const markSafe = useCallback(() => {
    simTimersRef.current.forEach(clearTimeout);
    simTimersRef.current = [];
    setFallState('idle');
    setIsSimulating(false);
    sensorRef.current = { ax: 0.02, ay: -0.01, az: 1.0 };
    const now = new Date();
    setAlertHistory(prev => [
      {
        id: Date.now(),
        type: 'safe',
        title: '✓ Marked Safe',
        time: now,
        badge: 'SAFE',
        detail: now.toLocaleTimeString(),
      },
      ...prev,
    ]);
  }, []);

  const resetAll = useCallback(() => {
    simTimersRef.current.forEach(clearTimeout);
    simTimersRef.current = [];
    setFallState('idle');
    setIsSimulating(false);
    sensorRef.current = { ax: 0.02, ay: -0.01, az: 1.0 };
  }, []);

  const stageIndex = { idle: 0, stage1: 1, stage2: 2, stage3: 3, fallen: 3 };

  return (
    <FallContext.Provider value={{
      sensors,
      accelHistory,
      fallState,
      fallCount,
      alertHistory,
      uptime,
      isSimulating,
      stageActive: stageIndex[fallState] || 0,
      simulateFall,
      markSafe,
      resetAll,
    }}>
      {children}
    </FallContext.Provider>
  );
};
