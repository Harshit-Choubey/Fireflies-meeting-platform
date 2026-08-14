"""
Transcript parser.

Parses plain-text transcripts in the format:
    [HH:MM:SS] Speaker Name: text content

Multi-line continuation (lines without a timestamp prefix) are appended
to the current segment's text.

This module contains pure parsing logic with no database interaction.
The service layer calls the parser and then persists the result.
"""

import re
from dataclasses import dataclass

from app.core.exceptions import TranscriptParseError

# Matches lines that start a new segment: [HH:MM:SS] Speaker: text
# Group 1: hours, Group 2: minutes, Group 3: seconds, Group 4: speaker, Group 5: text
SEGMENT_PATTERN = re.compile(
    r"^\[(\d{2}):(\d{2}):(\d{2})\]\s*([^:\n]+):\s*(.*)$"
)

# Maximum number of bytes allowed in a transcript submission.
MAX_TRANSCRIPT_BYTES = 500_000


@dataclass
class ParsedSegment:
    """A single parsed transcript segment before persistence."""
    speaker_label: str
    text: str
    start_time: float   # seconds from recording start
    end_time: float     # estimated end (next segment's start_time, or start+30)
    sequence: int


def _timestamp_to_seconds(hours: str, minutes: str, seconds: str) -> float:
    """Convert HH:MM:SS string parts to a float number of seconds."""
    return int(hours) * 3600 + int(minutes) * 60 + int(seconds)


def parse_transcript(raw_text: str) -> list[ParsedSegment]:
    """
    Parse raw transcript text into a list of ParsedSegment objects.

    Raises TranscriptParseError if:
    - the text exceeds the size limit
    - no valid segments are found
    - timestamps are not monotonically increasing
    - a segment has an empty speaker or empty text
    """
    if len(raw_text.encode("utf-8")) > MAX_TRANSCRIPT_BYTES:
        raise TranscriptParseError(
            f"Transcript exceeds maximum size of {MAX_TRANSCRIPT_BYTES} bytes."
        )

    lines = raw_text.strip().splitlines()
    if not lines:
        raise TranscriptParseError("Transcript text is empty.")

    # We build segments incrementally, appending continuation lines as we go.
    raw_segments: list[dict] = []
    current: dict | None = None

    for line in lines:
        match = SEGMENT_PATTERN.match(line)
        if match:
            # This line starts a new segment — save the previous one first.
            if current is not None:
                raw_segments.append(current)

            hours, minutes, seconds, speaker, text = match.groups()
            start_time = _timestamp_to_seconds(hours, minutes, seconds)

            current = {
                "speaker_label": speaker.strip(),
                "text": text.strip(),
                "start_time": start_time,
            }
        elif current is not None and line.strip():
            # Continuation line — append to current segment's text.
            current["text"] = current["text"] + " " + line.strip()
        # Blank lines between segments are silently ignored.

    # Don't forget the final segment.
    if current is not None:
        raw_segments.append(current)

    if not raw_segments:
        raise TranscriptParseError(
            "No valid transcript segments found. "
            "Expected format: [HH:MM:SS] Speaker: text"
        )

    # Validate speakers and text.
    for seg in raw_segments:
        if not seg["speaker_label"]:
            raise TranscriptParseError("A segment has an empty speaker name.")
        if not seg["text"]:
            raise TranscriptParseError(
                f"Segment at {seg['start_time']}s has empty text."
            )

    # Validate monotonically increasing timestamps.
    for i in range(1, len(raw_segments)):
        if raw_segments[i]["start_time"] < raw_segments[i - 1]["start_time"]:
            raise TranscriptParseError(
                f"Timestamps must be monotonically increasing. "
                f"Segment {i} starts at {raw_segments[i]['start_time']}s "
                f"which is before segment {i - 1} at {raw_segments[i - 1]['start_time']}s."
            )

    # Assign sequence numbers and estimate end times.
    # end_time = next segment's start_time, or start_time + 30 for the last segment.
    result: list[ParsedSegment] = []
    for i, seg in enumerate(raw_segments):
        if i + 1 < len(raw_segments):
            end_time = raw_segments[i + 1]["start_time"]
        else:
            end_time = seg["start_time"] + 30.0

        result.append(
            ParsedSegment(
                speaker_label=seg["speaker_label"],
                text=seg["text"],
                start_time=seg["start_time"],
                end_time=end_time,
                sequence=i,
            )
        )

    return result
