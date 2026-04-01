import PhotoCard from './PhotoCard';

const PhotoList = ({ photos, deletingId, getImageSrc, onEdit, onDelete, onView }) => {
  if (!photos.length) {
    return (
      <section className="rounded-[2rem] border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-[0_24px_60px_-45px_rgba(15,23,42,0.55)]">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Your gallery is empty</p>
        <h2 className="mt-3 text-3xl font-semibold text-slate-900">Add your first photo</h2>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
          Start with an image URL or upload a file from your device. Every photo you add stays private to your account.
        </p>
      </section>
    );
  }

  return (
    <section className="grid gap-6 md:grid-cols-2 2xl:grid-cols-3">
      {photos.map((photo) => (
        <PhotoCard
          key={photo._id}
          photo={photo}
          imageSrc={getImageSrc(photo)}
          deletingId={deletingId}
          onEdit={onEdit}
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </section>
  );
};

export default PhotoList;
