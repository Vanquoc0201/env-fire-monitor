# Env Fire Monitor

A mini-project for building a real-time environmental monitoring and fire-risk alert system using ESP32, MQTT, NestJS, MongoDB, and a web dashboard.

## 1. Project Overview

This project aims to build a small end-to-end IoT system that can:

- collect environmental data from sensors
- monitor temperature, humidity, and smoke/gas indicators in real time
- send sensor telemetry from ESP32 through MQTT
- process and store data in a backend service
- display live data on a web dashboard
- trigger emergency alerts when abnormal conditions are detected

The long-term goal is to use this mini-project as a practical foundation for a future interdisciplinary research project related to embedded systems, IoT, and software engineering.

---

## 2. Team Roles

### Member 1 — Backend / Full-stack
Responsible for:
- NestJS backend development
- MQTT consumer integration
- MongoDB data storage
- WebSocket / Socket.IO real-time delivery
- Telegram alert integration
- Frontend dashboard integration

### Member 2 — Hardware / Firmware / Telecommunications
Responsible for:
- ESP32 firmware development
- sensor integration (DHT11, MQ-2)
- Wi-Fi and MQTT publishing from device side
- sensor testing and hardware validation

---

## 3. System Architecture

The system is designed with 5 layers:

1. **Device Layer**
   - ESP32
   - DHT11 temperature/humidity sensor
   - MQ-2 smoke/gas sensor

2. **Communication Layer**
   - MQTT over Wi-Fi
   - Public broker for development or cloud broker for deployment

3. **Backend Layer**
   - NestJS application
   - MQTT subscriber / message processor
   - business logic for alerting

4. **Database Layer**
   - MySQL for telemetry logs and alert history

5. **Presentation & Alert Layer**
   - Web dashboard for real-time monitoring
   - Telegram Bot for emergency notifications

---

## 4. Repository Structure

```bash
env-fire-monitor/
├─ README.md
├─ backend/
│  └─ env-monitor-api/
├─ frontend/
│  └─ env-monitor-web/
└─ firmware/
   └─ esp32-env-node/
      ├─ sketches/
      │  ├─ wifi_test/
      │  ├─ dht11_test/
      │  ├─ mq2_test/
      │  ├─ sensor_combined_test/
      │  └─ mqtt_publish_test/
      └─ README.md
