# Development notes

## E01 / E87 protocol changes

Before changing BLE upload speed, chunking, file metadata, storage handling, CRC,
or completion/error handling, compare the behavior against:

- `refs/e87_badge`
- `refs/web-bluetooth-e87`
- this AuraCast codebase

Do not guess protocol behavior from the UI symptom alone. Check the matching
implementation or protocol notes first, then make the smallest change that fits
the observed logs.
