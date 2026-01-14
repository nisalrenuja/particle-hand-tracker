import type { HandLandmarks } from '@/types/mediapipe';
import type { GestureResult, FingerState } from '@/types/shapes';
import { LANDMARK_INDICES, GESTURE_CONFIG } from '@/config/constants';

export class GestureRecognizer {
  private landmarks: HandLandmarks;

  constructor(landmarks: HandLandmarks) {
    this.landmarks = landmarks;
  }

  private isFingerUp(tipIdx: number, pipIdx: number): boolean {
    return this.landmarks[tipIdx].y < this.landmarks[pipIdx].y;
  }

  private isThumbUp(): boolean {
    const thumbTipY = this.landmarks[LANDMARK_INDICES.THUMB_TIP].y;
    const indexMcpY = this.landmarks[LANDMARK_INDICES.INDEX_MCP].y;
    return thumbTipY < indexMcpY;
  }

  public getFingerState(): FingerState {
    return {
      thumb: this.isThumbUp(),
      index: this.isFingerUp(LANDMARK_INDICES.INDEX_TIP, LANDMARK_INDICES.INDEX_PIP),
      middle: this.isFingerUp(LANDMARK_INDICES.MIDDLE_TIP, LANDMARK_INDICES.MIDDLE_PIP),
      ring: this.isFingerUp(LANDMARK_INDICES.RING_TIP, LANDMARK_INDICES.RING_PIP),
      pinky: this.isFingerUp(LANDMARK_INDICES.PINKY_TIP, LANDMARK_INDICES.PINKY_PIP),
    };
  }

  private countRaisedFingers(): number {
    const state = this.getFingerState();
    let count = 0;

    if (state.index) count++;
    if (state.middle) count++;
    if (state.ring) count++;
    if (state.pinky) count++;

    return count;
  }

  public recognizeGesture(): GestureResult {
    const state = this.getFingerState();
    const fingersUpCount = this.countRaisedFingers();

    // 1. Thumbs Up - Strict detection: thumb up, all others down
    if (state.thumb && fingersUpCount === 0) {
      return {
        name: 'thumbs-up',
        confidence: 1.0,
      };
    }

    // 2. Index finger (pointing)
    if (state.index && !state.middle && !state.ring && !state.pinky) {
      return {
        name: 'index',
        confidence: 1.0,
      };
    }

    // 3. Peace sign / V sign (index + middle)
    if (state.index && state.middle && !state.ring && !state.pinky) {
      return {
        name: 'peace',
        confidence: 1.0,
      };
    }

    // 4. Three fingers (index + middle + ring)
    if (state.index && state.middle && state.ring && !state.pinky) {
      return {
        name: 'three-fingers',
        confidence: 1.0,
      };
    }

    // 5. Open palm (four or more fingers)
    if (fingersUpCount >= GESTURE_CONFIG.OPEN_PALM_FINGER_COUNT) {
      return {
        name: 'open-palm',
        confidence: 1.0,
      };
    }

    // 6. Closed fist (no fingers raised)
    if (fingersUpCount === 0) {
      return {
        name: 'fist',
        confidence: 1.0,
      };
    }

    // Default: no recognized gesture
    return {
      name: 'none',
      confidence: 0.0,
    };
  }

  public getLandmark(index: number) {
    return this.landmarks[index];
  }

  public getHandCenter() {
    return this.landmarks[LANDMARK_INDICES.MIDDLE_MCP];
  }
}

export function mapGestureToShape(gestureName: string): string {
  const gestureToShapeMap: Record<string, string> = {
    'thumbs-up': 'scatter',
    'index': 'hello',
    'peace': 'gemini',
    'three-fingers': 'sinhala-great',
    'open-palm': 'sphere',
    'fist': 'sinhala-hello',
    'none': 'sphere',
  };

  return gestureToShapeMap[gestureName] || 'sphere';
}

export {};
