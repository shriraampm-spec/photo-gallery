const formatDate = (value) =>
  new Intl.DateTimeFormat('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

const PhotoCard = ({ photo, imageSrc, onEdit, onDelete, onView, deletingId }) => {
  const isDeleting = deletingId === photo._id;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_26px_70px_-45px_rgba(15,23,42,0.55)] transition-transform duration-300 hover:-translate-y-1">
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        <img src={imageSrc} alt={photo.title} className="h-full w-full object-cover" />
        <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
          {photo.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col space-y-4 p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-slate-900">{photo.title}</h3>
            <p className="text-sm font-medium text-amber-700">Captured {formatDate(photo.captureDate)}</p>
          </div>
        </div>
        <p className="flex-1 text-sm leading-6 text-slate-600">
          {photo.description || 'No description added for this photo yet.'}
        </p>
        <div className="mt-auto grid gap-3 pt-2 sm:grid-cols-3">
          <button
            type="button"
            onClick={() => onView(photo)}
            className="rounded-2xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800 transition hover:border-amber-400 hover:bg-amber-100"
          >
            View
          </button>
          <button
            type="button"
            onClick={() => onEdit(photo)}
            className="rounded-2xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-900 hover:text-slate-900"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(photo)}
            disabled={isDeleting}
            className="rounded-2xl bg-rose-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:cursor-not-allowed disabled:bg-rose-300"
          >
            {isDeleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>
    </article>
  );
};

export default PhotoCard;
