// expo-audio's native module doesn't exist under Jest (no microphone, no
// native runtime) and jest-expo ships no mock for it. Real recording is only
// ever exercised through src/services/recorder.ts, which tests fake directly —
// this stub exists purely so importing expo-audio elsewhere doesn't crash.
class AudioRecorder {
  uri: string | null = null
  prepareToRecordAsync = jest.fn().mockResolvedValue(undefined)
  record = jest.fn()
  stop = jest.fn().mockResolvedValue(undefined)
  release = jest.fn()
}

export const AudioModule = {
  AudioRecorder,
  requestRecordingPermissionsAsync: jest.fn().mockResolvedValue({ granted: true }),
}

export const RecordingPresets = { HIGH_QUALITY: {}, LOW_QUALITY: {} }

export const setAudioModeAsync = jest.fn().mockResolvedValue(undefined)
