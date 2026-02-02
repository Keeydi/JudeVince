# BantayPlaka Feature Audit

Branding has been updated: **ViolationLedger** → **BantayPlaka** across the codebase (README, index.html, Login, Dashboard, Sidebar, ai_service.py).

---

## Implementation vs Spec

### Core
| Spec | Status | Notes |
|------|--------|--------|
| Automatic number plate recognition | ✅ | AI service (Gemini) detects plates; detections stored with `plateNumber`. |
| Real-time vehicle monitoring | ✅ | Dashboard, cameras, detections, violations; live refresh. |
| OCR-based plate extraction | ⚠️ | Plate extraction via Gemini vision (not classic OCR); same outcome. |
| Entry and exit logging | ⚠️ | Violations/detections with timestamps; no explicit "entry/exit" flow. |
| Timestamped records | ✅ | All detections, violations, incidents have `timestamp` / `timeDetected`. |
| Centralized database storage | ✅ | SQLite DB (vehicles, cameras, detections, violations, incidents, users). |

### Camera
| Spec | Status | Notes |
|------|--------|--------|
| Live camera feed | ✅ | Dashboard CameraFeed, VideoPlayer; camera streams. |
| Automatic plate capture | ✅ | Monitoring service triggers captures; AI extracts plates. |
| OpenCV image processing | ❌ | Python uses **Gemini + Pillow**, not OpenCV. |
| Python-based recognition | ✅ | `server/ai_service.py` (Python). |

### Security guard
| Spec | Status | Notes |
|------|--------|--------|
| View live feed | ✅ | Dashboard + Cameras; any authenticated user. |
| Verify vehicle entry | ⚠️ | Via violations/warnings and manual actions; no dedicated "verify entry" UI. |
| Search vehicle logs | ✅ | Vehicles list with search; Violations History; Capture Results. |
| Manual plate entry | ✅ | Vehicles CRUD; Upload Image with plate. |
| Review recent records | ✅ | Capture Results, Recent Tickets, Violations History, Warnings. |

*Roles in app: `admin`, `encoder`, `barangay_user` — no explicit "security_guard" role; guard-style actions available to non-admin users.*

### HOA admin
| Spec | Status | Notes |
|------|--------|--------|
| Register resident plates | ✅ | Vehicles (plateNumber, ownerName, etc.); admin/barangay_user. |
| Manage stored plates | ✅ | Vehicles list: add/edit/delete. |
| Add/edit/remove guest plates | ✅ | Vehicles with hostId, purposeOfVisit; Hosts for guests. |
| Search vehicle history | ✅ | Vehicles search; Violations History; detections. |

*Mapped to `admin` / `barangay_user`; no "hoa_admin" role name.*

### Logs
| Spec | Status | Notes |
|------|--------|--------|
| Vehicle logs | ✅ | Detections, violations, incidents (plate, camera, time). |
| Guest logs | ⚠️ | Vehicles with hostId/purposeOfVisit; no separate "guest log" table. |
| Plate number | ✅ | In vehicles, detections, violations, incidents. |
| Vehicle type | ⚠️ | `detections.class_name`; not always "vehicle type" in spec sense. |
| Timestamp | ✅ | All relevant tables. |
| Entry/exit status | ⚠️ | Violation status (warning/issued/cleared); no explicit entry/exit. |

### Dashboard
| Spec | Status | Notes |
|------|--------|--------|
| User-friendly interface | ✅ | React + shadcn/ui. |
| Live camera preview | ✅ | Dashboard CameraFeed/VideoPlayer. |
| Searchable tables | ✅ | Vehicles, Violations, etc. with search/filters. |
| Current time display | ✅ | Header/subtitle; can add explicit clock if needed. |
| Settings page | ✅ | `/settings` (health, notifications, system). |

### Tech stack (spec vs actual)
| Spec | Actual |
|------|--------|
| Frontend: HTML, CSS, JavaScript | **React, TypeScript, Vite, Tailwind, shadcn/ui** |
| Backend: PHP | **Node.js, Express** |
| Processing: Python, OpenCV | **Python, Gemini, Pillow** (no OpenCV) |
| Database: MySQL | **SQLite** (same concepts, different engine) |

### Testing (spec)
| Spec | Status |
|------|--------|
| Unit testing | ❌ Not present in repo. |
| Integration testing | ❌ Not present. |
| System testing | ❌ Not present. |
| ISO 25010 evaluation | ❌ Not present. |

### Limitations (spec — awareness only)
- Motorcycle plate detection issues
- Lighting dependency
- No fake plate detection
- Speed-related misreads  

*These are product limitations to be aware of; no code changes required for "implementation".*

---

## Summary

- **Branding:** All **ViolationLedger** references have been replaced with **BantayPlaka**.
- **Core, camera (except OpenCV), security guard–style, HOA admin–style, logs, and dashboard** features are largely implemented, with some differences (e.g. entry/exit vs violation status, guest logs as part of vehicles/hosts).
- **Tech stack:** Implemented with React/Node/SQLite and Python/Gemini instead of HTML-PHP-MySQL and OpenCV; behavior aligns with BantayPlaka goals.
- **Gaps:** No OpenCV; no formal unit/integration/system or ISO 25010 testing in repo.

If you want, next step can be: add an explicit "BantayPlaka" app title/clock on the dashboard or align role names (e.g. `security_guard` / `hoa_admin`) in the backend and UI.
