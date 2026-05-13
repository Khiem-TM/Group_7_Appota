function AnnouncementCard({ item }) {
  return (
    <article className="rounded-xl border border-slate-700 bg-slate-900/70 p-3">
      <h4 className="font-medium text-slate-100">{item.title}</h4>
      <p className="mt-1 text-sm text-slate-400">{item.body}</p>
      <p className="mt-2 text-xs text-slate-500">{item.author} • {item.createdAt}</p>
    </article>
  );
}

export default AnnouncementCard;
