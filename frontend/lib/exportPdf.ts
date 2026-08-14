import { Meeting, Summary, ActionItem, Transcript } from '@/types';

export function exportMeetingToPdf(
  meeting: Meeting,
  summary: Summary | null,
  actionItems: ActionItem[],
  transcript: Transcript | null
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    alert('Please allow popups to generate PDF exports.');
    return;
  }

  const formattedDate = new Date(meeting.meeting_date).toLocaleString();

  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>${meeting.title} - Meeting Summary</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            color: #111827;
            padding: 40px;
            line-height: 1.5;
          }
          h1 { color: #10072F; margin-bottom: 4px; font-size: 24px; }
          .meta { color: #667085; font-size: 12px; margin-bottom: 24px; }
          .section { margin-bottom: 24px; }
          h2 { color: #7C4DFF; font-size: 16px; border-bottom: 1px solid #E7E7EE; padding-bottom: 6px; }
          p { font-size: 13px; color: #374151; }
          ul { font-size: 13px; padding-left: 20px; }
          li { margin-bottom: 6px; }
          .segment { margin-bottom: 12px; }
          .speaker { font-weight: bold; font-size: 12px; color: #10072F; }
          .time { font-family: monospace; font-size: 11px; color: #7C4DFF; margin-left: 8px; }
          .text { font-size: 12px; color: #4B5563; margin-top: 2px; }
        </style>
      </head>
      <body>
        <h1>${meeting.title}</h1>
        <div class="meta">Date: ${formattedDate} | Duration: ${Math.floor(meeting.duration_seconds / 60)} mins</div>

        ${
          summary
            ? `<div class="section">
                <h2>AI Overview</h2>
                <p>${summary.overview.replace(/\n/g, '<br/>')}</p>
              </div>`
            : ''
        }

        ${
          actionItems && actionItems.length > 0
            ? `<div class="section">
                <h2>Action Items</h2>
                <ul>
                  ${actionItems
                    .map(
                      (a) =>
                        `<li><strong>[${a.status.toUpperCase()}]</strong> ${a.title} ${
                          a.assignee ? `(Assigned to ${a.assignee.name})` : ''
                        }</li>`
                    )
                    .join('')}
                </ul>
              </div>`
            : ''
        }

        ${
          transcript?.segments
            ? `<div class="section">
                <h2>Transcript</h2>
                ${transcript.segments
                  .map(
                    (s) => `
                  <div class="segment">
                    <span class="speaker">${s.speaker_label}</span>
                    <span class="time">[${formatTime(s.start_time)}]</span>
                    <div class="text">${s.text}</div>
                  </div>
                `
                  )
                  .join('')}
              </div>`
            : ''
        }

        <script>
          window.onload = function() {
            window.print();
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}

function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}
