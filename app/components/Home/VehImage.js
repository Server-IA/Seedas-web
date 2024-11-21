import React, { useState } from 'react';
import { uploadImage } from '../../firebase/firebaseVeh';

function VehImage({ images, setImages }) {
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    setUploading(true);
    try {
      const urls = await Promise.all(files.map((file) => uploadImage(file)));
      setImages((prev) => [...prev, ...urls]);
      const preview = files.map((file) => URL.createObjectURL(file));
      setPreviewImages((prev) => [...prev, ...preview]);
    } catch (error) {
      console.error('Error al subir las imágenes:', error);
      alert('Hubo un problema al subir las imágenes. Por favor, inténtalo de nuevo.');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="mt-4">
      <label className="block mb-2 font-semibold">Sube 2 imágenes del vehículo:</label>
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageUpload}
        className="p-2 border rounded w-full"
      />
      {uploading && <p className="mt-2 text-blue-500">Subiendo imágenes...</p>}
      <div className="grid mt-2 grid-cols-3 gap-2">
        {previewImages.map((src, index) => (
          <div key={index} className="relative">
            <img src={src} alt={`Imagen ${index}`} className="w-full h-20 object-cover rounded" />
            <button
              className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full p-1"
              onClick={() => handleRemoveImage(index)}
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default VehImage;
