const formatDate = (value) =>
  new Intl.DateTimeFormat('en-AU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(value));

const PhotoViewerModal = ({ photo, imageSrc, onClose }) => {
  if (!photo) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div
        className="grid max-h-[92vh] w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_40px_120px_-35px_rgba(15,23,42,0.75)] lg:grid-cols-[minmax(0,1.5fr)_360px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="bg-slate-950">
          <img src={imageSrc} alt={photo.title} className="max-h-[60vh] w-full object-contain lg:max-h-[92vh]" />
        </div>
        <aside className="flex flex-col bg-[linear-gradient(180deg,_#ffffff_0%,_#f8fafc_100%)] p-6 lg:p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-700">{photo.category}</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-900">{photo.title}</h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
            >
              Close
            </button>
          </div>

          <div className="mt-6 grid gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Captured</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{formatDate(photo.captureDate)}</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Source</p>
              <p className="mt-2 break-all text-sm leading-6 text-slate-600">{photo.imagePath ? 'Uploaded file' : photo.imageUrl}</p>
            </div>
          </div>

          <div className="mt-6 flex-1 rounded-[1.5rem] border border-slate-200 bg-white p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Description</p>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              {photo.description || 'No description was added for this photo.'}
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PhotoViewerModal;
