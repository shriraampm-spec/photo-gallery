import { useEffect, useState } from 'react';
import axiosInstance from '../axiosConfig';
import PhotoForm from '../components/PhotoForm';
import PhotoList from '../components/PhotoList';
import PhotoViewerModal from '../components/PhotoViewerModal';
import { useAuth } from '../context/AuthContext';

const Gallery = () => {
  const { user } = useAuth();
  const [photos, setPhotos] = useState([]);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [viewingPhoto, setViewingPhoto] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchPhotos = async () => {
      setIsLoading(true);

      try {
        const response = await axiosInstance.get('/api/photos', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setPhotos(response.data);
      } catch (error) {
        setMessage({
          type: 'error',
          text: error.response?.data?.message || 'Failed to load your gallery.',
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.token) {
      fetchPhotos();
    }
  }, [user]);

  const handleSubmit = async (formData, imageFile) => {
    setIsSaving(true);
    setMessage({ type: '', text: '' });

    const payload = new FormData();
    payload.append('title', formData.title);
    payload.append('description', formData.description);
    payload.append('category', formData.category);
    payload.append('captureDate', formData.captureDate);
    payload.append('imageUrl', formData.imageUrl);

    if (imageFile) {
      payload.append('image', imageFile);
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data',
        },
      };

      if (editingPhoto) {
        const response = await axiosInstance.put(`/api/photos/${editingPhoto._id}`, payload, config);
        setPhotos((currentPhotos) =>
          currentPhotos.map((photo) => (photo._id === response.data._id ? response.data : photo))
        );
        setMessage({ type: 'success', text: 'Photo updated successfully.' });
      } else {
        const response = await axiosInstance.post('/api/photos', payload, config);
        setPhotos((currentPhotos) => [response.data, ...currentPhotos]);
        setMessage({ type: 'success', text: 'Photo added to your gallery.' });
      }

      setEditingPhoto(null);
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to save photo.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (photo) => {
    const confirmed = window.confirm(`Delete "${photo.title}" from your gallery?`);

    if (!confirmed) {
      return;
    }

    setDeletingId(photo._id);
    setMessage({ type: '', text: '' });

    try {
      await axiosInstance.delete(`/api/photos/${photo._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setPhotos((currentPhotos) => currentPhotos.filter((item) => item._id !== photo._id));
      if (editingPhoto?._id === photo._id) {
        setEditingPhoto(null);
      }
      if (viewingPhoto?._id === photo._id) {
        setViewingPhoto(null);
      }
      setMessage({ type: 'success', text: 'Photo deleted successfully.' });
    } catch (error) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to delete photo.',
      });
    } finally {
      setDeletingId(null);
    }
  };

  const getImageSrc = (photo) => {
    if (photo.imagePath) {
      return `${axiosInstance.defaults.baseURL}${photo.imagePath}`;
    }

    return photo.imageUrl;
  };

  return (
    <div className="min-h-[calc(100vh-88px)] bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.22),_transparent_25%),linear-gradient(180deg,_#f8fafc_0%,_#eef2ff_45%,_#f8fafc_100%)]">
      <div className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-8">
        <section className="mb-10 grid gap-6 overflow-hidden rounded-[2.25rem] bg-slate-900 p-6 text-white shadow-[0_35px_90px_-45px_rgba(15,23,42,0.8)] lg:grid-cols-[minmax(0,1.45fr)_360px] lg:p-8 xl:p-10">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-300">IFN636 Photo Gallery</p>
            <h1 className="mt-4 max-w-3xl text-3xl font-semibold leading-tight sm:text-4xl xl:text-5xl">
              Manage a private gallery with polished, end-to-end photo CRUD.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-slate-300 xl:text-lg">
              Save your images with a title, category, description, and capture date. Every gallery item belongs to your account only.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200">Owner-only access</span>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200">Image URL or upload</span>
              <span className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-sm font-medium text-slate-200">MongoDB-backed records</span>
            </div>
          </div>
          <div className="rounded-[1.9rem] border border-white/10 bg-white/10 p-6 backdrop-blur">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-amber-300">Signed in as</p>
            <h2 className="mt-3 text-2xl font-semibold">{user?.name}</h2>
            <p className="mt-2 break-all text-sm text-slate-300">{user?.email}</p>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Photos</p>
                <p className="mt-2 text-3xl font-semibold">{photos.length}</p>
              </div>
              <div className="rounded-2xl bg-white/10 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-300">Status</p>
                <p className="mt-2 text-lg font-semibold">{editingPhoto ? 'Editing' : 'Ready'}</p>
              </div>
            </div>
          </div>
        </section>

        {message.text ? (
          <div
            className={`mb-6 rounded-2xl border px-5 py-4 text-sm font-medium ${
              message.type === 'error'
                ? 'border-rose-200 bg-rose-50 text-rose-700'
                : 'border-emerald-200 bg-emerald-50 text-emerald-700'
            }`}
          >
            {message.text}
          </div>
        ) : null}

        <div className="grid gap-8 xl:grid-cols-[minmax(340px,420px)_minmax(0,1fr)] 2xl:grid-cols-[430px_minmax(0,1fr)]">
          <aside>
            <PhotoForm
              editingPhoto={editingPhoto}
              isSaving={isSaving}
              onSubmit={handleSubmit}
              onCancel={() => setEditingPhoto(null)}
            />
          </aside>

          <section className="space-y-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.28em] text-amber-700">Gallery collection</p>
                <h2 className="mt-2 text-3xl font-semibold text-slate-900">Your photos at a glance</h2>
                <p className="mt-2 max-w-2xl text-base leading-7 text-slate-600">
                  Browse, edit, and remove entries without leaving the dashboard. The layout adapts automatically as your collection grows.
                </p>
              </div>
            </div>

            {isLoading ? (
              <section className="rounded-[2rem] border border-slate-200 bg-white p-10 text-center shadow-[0_24px_60px_-40px_rgba(15,23,42,0.55)]">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-700">Loading</p>
                <h2 className="mt-3 text-3xl font-semibold text-slate-900">Fetching your gallery</h2>
              </section>
            ) : (
              <PhotoList
                photos={photos}
                deletingId={deletingId}
                getImageSrc={getImageSrc}
                onEdit={setEditingPhoto}
                onDelete={handleDelete}
                onView={setViewingPhoto}
              />
            )}
          </section>
        </div>
      </div>
      <PhotoViewerModal
        photo={viewingPhoto}
        imageSrc={viewingPhoto ? getImageSrc(viewingPhoto) : ''}
        onClose={() => setViewingPhoto(null)}
      />
    </div>
  );
};

export default Gallery;
