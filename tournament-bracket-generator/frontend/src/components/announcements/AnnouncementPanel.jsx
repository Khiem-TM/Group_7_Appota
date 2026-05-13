import AnnouncementCard from "./AnnouncementCard";

function AnnouncementPanel({ items, showCompose = false }) {
  return (
    <section className="soft-panel p-4">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-xl text-white">Announcements</h3>
        {showCompose && (
          <button className="rounded-lg border border-slate-700 px-3 py-1.5 text-xs text-slate-200 hover:border-cyan-400">
            New Post
          </button>
        )}
      </div>
      <div className="space-y-2">
        {items.map((item) => (
          <AnnouncementCard key={item.id} item={item} />
        ))}
      </div>
    </section>
  );
}

export default AnnouncementPanel;
