const labels = {
  registration_open: "Registration Open",
  in_progress: "In Progress",
  completed: "Completed"
};

const classes = {
  registration_open: "bg-lime-500/20 text-lime-300 border-lime-500/30",
  in_progress: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  completed: "bg-slate-500/20 text-slate-300 border-slate-500/30"
};

function TournamentStatusBadge({ status }) {
  return (
    <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${classes[status] || classes.completed}`}>
      {labels[status] || status}
    </span>
  );
}

export default TournamentStatusBadge;
