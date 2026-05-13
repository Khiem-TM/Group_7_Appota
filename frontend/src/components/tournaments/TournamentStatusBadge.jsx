const labels = {
  registration_open: "Registration Open",
  in_progress: "In Progress",
  completed: "Completed"
};

const classes = {
  registration_open: "bg-lime-500/20 text-lime-300 border-lime-500/30",
  in_progress: "bg-primary-container/20 text-primary-fixed border-primary-container/30",
  completed: "bg-surface-bright/20 text-on-surface-variant border-outline-variant/40"
};

function TournamentStatusBadge({ status }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${classes[status] || classes.completed}`}>
      {labels[status] || status}
    </span>
  );
}

export default TournamentStatusBadge;


