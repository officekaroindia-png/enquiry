export function formatDate(iso) {
  if (!iso) return '';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function formatDateTime(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  return (
    d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) +
    ' · ' +
    d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  );
}

/**
 * Returns how many days the enquiry has been in its current stage.
 * Derives the stage-entry date from the activities array —
 * finds the most recent activity that matches the current stage
 * (i.e. when the stage was last entered). Falls back to createdAt.
 */
export function getDaysInStage(enquiry) {
  if (!enquiry) return 0;
  const { stage, activities = [], createdAt } = enquiry;

  // Walk activities in reverse to find the last time the stage was set to current
  let stageEnteredAt = null;
  for (let i = activities.length - 1; i >= 0; i--) {
    if (activities[i].stage === stage) {
      stageEnteredAt = activities[i].createdAt;
    } else {
      // Once we hit an activity with a different stage, stop
      break;
    }
  }

  const from = stageEnteredAt ? new Date(stageEnteredAt) : new Date(createdAt);
  const now = new Date();
  const diffMs = now - from;
  return Math.max(0, Math.floor(diffMs / (1000 * 60 * 60 * 24)));
}

/**
 * Returns a human-readable "X days in stage" label.
 */
export function formatDaysInStage(enquiry) {
  const days = getDaysInStage(enquiry);
  if (days === 0) return 'Today';
  if (days === 1) return '1 day';
  return `${days} days`;
}
