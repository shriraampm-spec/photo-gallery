import { useEffect, useState } from 'react';

const emptyForm = {
  title: '',
  description: '',
  category: '',
  captureDate: '',
  imageUrl: '',
};

const toDateInputValue = (value) => {
  if (!value) {
    return '';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().split('T')[0];
};

const PhotoForm = ({ editingPhoto, isSaving, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(emptyForm);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (editingPhoto) {
      setFormData({
        title: editingPhoto.title || '',
        description: editingPhoto.description || '',
        category: editingPhoto.category || '',
        captureDate: toDateInputValue(editingPhoto.captureDate),
        imageUrl: editingPhoto.imageUrl || '',
      });
      setImageFile(null);
      return;
    }

    setFormData(emptyForm);
    setImageFile(null);
  }, [editingPhoto]);

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(formData, imageFile);
  };

  return (
    <section className="rounded-[2rem] border border-slate-200/90 bg-white/95 p-6 shadow-[0_30px_70px_-45px_rgba(15,23,42,0.55)] lg:sticky lg:top-28 lg:p-8">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">
            {editingPhoto ? 'Update photo' : 'Create photo'}
          </p>
          <h2 className="mt-2 text-3xl font-semibold text-slate-900">
            {editingPhoto ? 'Edit gallery item' : 'Add a new gallery item'}
          </h2>
        </div>
        {editingPhoto ? (
          <button
            type="button"
            onClick={onCancel}
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
          >
            Cancel edit
          </button>
        ) : null}
      </div>

      <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Title</span>
          <input
            type="text"
            value={formData.title}
            onChange={(event) => setFormData({ ...formData, title: event.target.value })}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white"
            placeholder="Sunset at Mount Coot-tha"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Category</span>
          <input
            type="text"
            value={formData.category}
            onChange={(event) => setFormData({ ...formData, category: event.target.value })}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white"
            placeholder="Travel, Portrait, Nature"
            required
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Description</span>
          <textarea
            value={formData.description}
            onChange={(event) => setFormData({ ...formData, description: event.target.value })}
            className="min-h-[140px] w-full rounded-2xl border border-slate-300 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white"
            placeholder="Add a short story or context for this photo."
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Capture date</span>
          <input
            type="date"
            value={formData.captureDate}
            onChange={(event) => setFormData({ ...formData, captureDate: event.target.value })}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Image URL</span>
          <input
            type="url"
            value={formData.imageUrl}
            onChange={(event) => setFormData({ ...formData, imageUrl: event.target.value })}
            className="w-full rounded-2xl border border-slate-300 bg-slate-50/70 px-4 py-3 text-slate-900 outline-none transition focus:border-amber-500 focus:bg-white"
            placeholder="https://example.com/photo.jpg"
          />
        </label>

        <label className="block md:col-span-2">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Upload image</span>
          <div className="rounded-[1.6rem] border border-dashed border-slate-300 bg-slate-50/80 p-4 transition hover:border-amber-500">
            <input
              type="file"
              accept="image/*"
              onChange={(event) => setImageFile(event.target.files?.[0] || null)}
              className="w-full text-sm text-slate-600 outline-none file:mr-4 file:rounded-full file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
            />
            <p className="mt-3 text-sm font-medium text-slate-700">
              {imageFile ? `Selected file: ${imageFile.name}` : 'No file selected yet.'}
            </p>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Upload wins over the URL field when both are provided.
          </p>
        </label>

        <div className="md:col-span-2 flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={isSaving}
            className="rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSaving ? 'Saving...' : editingPhoto ? 'Update photo' : 'Create photo'}
          </button>
          {editingPhoto ? (
            <button
              type="button"
              onClick={onCancel}
              className="rounded-full border border-slate-300 px-6 py-3 text-sm font-semibold text-slate-600 transition hover:border-slate-900 hover:text-slate-900"
            >
              Reset
            </button>
          ) : null}
        </div>
      </form>
    </section>
  );
};

export default PhotoForm;
