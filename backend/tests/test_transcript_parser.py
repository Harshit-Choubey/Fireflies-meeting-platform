"""
Unit tests for the transcript parser module.
"""

import pytest
from app.core.exceptions import TranscriptParseError
from app.parsers.transcript_parser import parse_transcript


def test_parse_valid_transcript():
    raw = (
        "[00:01:24] Rahul: I think we should move the API.\n"
        "[00:01:31] Priya: Agreed, let's discuss dependencies."
    )
    segments = parse_transcript(raw)
    assert len(segments) == 2
    assert segments[0].speaker_label == "Rahul"
    assert segments[0].start_time == 84.0
    assert segments[0].sequence == 0
    assert segments[1].speaker_label == "Priya"
    assert segments[1].start_time == 91.0


def test_parse_multiline_continuation():
    raw = (
        "[00:00:10] Alex: First part of statement\n"
        "and continuation line without timestamp.\n"
        "[00:00:25] Sarah: Next speaker"
    )
    segments = parse_transcript(raw)
    assert len(segments) == 2
    assert "continuation line" in segments[0].text
    assert segments[1].speaker_label == "Sarah"


def test_parse_non_monotonic_timestamps_fails():
    raw = (
        "[00:02:00] Rahul: Second segment\n"
        "[00:01:00] Priya: Earlier timestamp"
    )
    with pytest.raises(TranscriptParseError) as exc:
        parse_transcript(raw)
    assert "monotonically increasing" in str(exc.value)


def test_parse_empty_transcript_fails():
    with pytest.raises(TranscriptParseError):
        parse_transcript("   \n  ")
