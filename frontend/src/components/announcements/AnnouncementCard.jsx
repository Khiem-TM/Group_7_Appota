function AnnouncementCard({ item }) {
  return (
    <article className="rounded-xl border border-outline-variant bg-surface-container-low/70 p-3">
      <h4 className="font-medium text-on-surface">{item.title}</h4>
      <p className="mt-1 text-sm text-on-surface-variant">{item.body}</p>
      <p className="mt-2 text-xs text-on-surface-variant/80">{item.author} • {item.createdAt}</p>
    </article>
  );
}

export default AnnouncementCard;

