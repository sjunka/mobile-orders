import { AudioModule, RecordingPresets, setAudioModeAsync } from 'expo-audio'
import type { AudioRecorder } from 'expo-audio'

// The only module that touches the microphone. Everything else — hold gesture,
// upload, mapping — is fakeable in Jest without this; this is the one thing
// that isn't, so tests mock the module instead.
let recorder: AudioRecorder | undefined
let permissionGranted = false

export async function startRecording(): Promise<void> {
  if (!permissionGranted) {
    const permission = await AudioModule.requestRecordingPermissionsAsync()
    if (!permission.granted) throw new Error('Microphone permission denied')
    permissionGranted = true
  }

  await setAudioModeAsync({ playsInSilentMode: true, allowsRecording: true })
  recorder = new AudioModule.AudioRecorder(RecordingPresets.HIGH_QUALITY)
  await recorder.prepareToRecordAsync()
  recorder.record()
}

export async function stopRecording(): Promise<string> {
  if (!recorder) throw new Error('Not recording')
  await recorder.stop()
  const uri = recorder.uri
  recorder.release()
  recorder = undefined
  if (!uri) throw new Error('Recording produced no file')
  return uri
}
