import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

const ImageUpload = ({ images, setImages, previews, setPreviews }) => {
    const onDrop = useCallback((acceptedFiles) => {
        setImages((prev) => [...prev, ...acceptedFiles]);
        
        const newPreviews = acceptedFiles.map(file => URL.createObjectURL(file));
        setPreviews((prev) => [...prev, ...newPreviews]);
    }, [setImages, setPreviews]);

    const removeImage = (index) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        setPreviews((prev) => prev.filter((_, i) => i !== index));
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 'image/*': [] },
        maxFiles: 5
    });

    return (
        <div className="space-y-4">
            <div 
                {...getRootProps()} 
                className={`border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer
                    ${isDragActive ? 'border-gold bg-gold/5' : 'border-white/10 hover:border-white/20'}`}
            >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-white/5 rounded-full text-gold">
                        <Upload size={32} />
                    </div>
                    <div>
                        <p className="text-lg font-bold">Drag & drop photos</p>
                        <p className="text-sm text-gray-400">or click to browse (max 5)</p>
                    </div>
                </div>
            </div>

            {previews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {previews.map((preview, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden group">
                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                            <button 
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
