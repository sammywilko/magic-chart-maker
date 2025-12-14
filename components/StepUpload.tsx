import React, { useRef } from 'react';
import { Upload, X, Camera, Image as ImageIcon, Sparkles, FolderOpen } from 'lucide-react';
import { UploadedImage, GeneratedAssets } from '../types';
import { Button } from './Button';

interface Props {
  referenceImages: UploadedImage[];
  childPhoto?: UploadedImage;
  onReferenceChange: (images: UploadedImage[]) => void;
  onChildPhotoChange: (image: UploadedImage | undefined) => void;
  onNext: () => void;
  onOpenTemplates?: () => void;
  hasTemplates?: boolean;
}

export const StepUpload: React.FC<Props> = ({
  referenceImages,
  childPhoto,
  onReferenceChange,
  onChildPhotoChange,
  onNext,
  onOpenTemplates,
  hasTemplates
}) => {
  const refInputRef = useRef<HTMLInputElement>(null);
  const childInputRef = useRef<HTMLInputElement>(null);

  const handleRefChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages: UploadedImage[] = [];
      Array.from(e.target.files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result as string;
          const base64Data = base64String.split(',')[1];
          newImages.push({
            id: Math.random().toString(36).substr(2, 9),
            data: base64Data,
            mimeType: file.type,
            type: 'reference'
          });
          if (newImages.length === e.target.files?.length) {
            onReferenceChange([...referenceImages, ...newImages]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleChildChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        onChildPhotoChange({
          id: 'child_photo',
          data: base64Data,
          mimeType: file.type,
          type: 'child'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (id: string) => {
    onReferenceChange(referenceImages.filter(img => img.id !== id));
  };

  return (
    <div className="space-y-12 animate-fade-in pb-10">
      <div className="text-center space-y-4">
        <h2 className="text-4xl font-bold text-purple-900 display-font">Create Your World</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto font-medium">
          Upload 2-4 images of a favorite show/book for the style, and a photo of your child to put them IN the story!
        </p>

        {/* Templates Button */}
        {hasTemplates && onOpenTemplates && (
          <button
            onClick={onOpenTemplates}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-400 to-orange-400 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <FolderOpen size={20} />
            Use Saved Template
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* SECTION 1: STYLE REFERENCES */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border-4 border-purple-50 hover:border-purple-100 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-purple-100 p-3 rounded-2xl text-purple-600">
              <ImageIcon size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">1. Art Style</h3>
              <p className="text-gray-500 text-sm">Screenshots of cartoons, books, or art.</p>
            </div>
          </div>

          <div 
            className="border-4 border-dashed border-purple-200 bg-purple-50/50 rounded-3xl p-8 text-center cursor-pointer hover:bg-purple-100/50 transition-colors mb-6"
            onClick={() => refInputRef.current?.click()}
          >
            <input 
              type="file" 
              multiple 
              accept="image/*" 
              className="hidden" 
              ref={refInputRef}
              onChange={handleRefChange}
            />
            <div className="mx-auto w-12 h-12 bg-white rounded-full flex items-center justify-center text-purple-500 shadow-sm mb-3">
              <Upload size={20} />
            </div>
            <span className="font-bold text-purple-700">Add Style References</span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {referenceImages.map((img) => (
              <div key={img.id} className="relative group aspect-square rounded-2xl overflow-hidden shadow-sm border-2 border-white">
                <img 
                  src={`data:${img.mimeType};base64,${img.data}`} 
                  alt="Reference" 
                  className="w-full h-full object-cover"
                />
                <button 
                  onClick={(e) => { e.stopPropagation(); removeImage(img.id); }}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
            {referenceImages.length === 0 && (
               <div className="col-span-3 text-center py-4 text-gray-400 text-sm italic">
                 No images selected yet
               </div>
            )}
          </div>
        </div>

        {/* SECTION 2: CHILD PHOTO */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border-4 border-orange-50 hover:border-orange-100 transition-all">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-orange-100 p-3 rounded-2xl text-orange-600">
              <Camera size={28} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">2. The Star</h3>
              <p className="text-gray-500 text-sm">A clear photo of your child's face.</p>
            </div>
          </div>

          {!childPhoto ? (
            <div 
              className="border-4 border-dashed border-orange-200 bg-orange-50/50 rounded-3xl p-12 text-center cursor-pointer hover:bg-orange-100/50 transition-colors h-64 flex flex-col items-center justify-center"
              onClick={() => childInputRef.current?.click()}
            >
              <input 
                type="file" 
                accept="image/*" 
                className="hidden" 
                ref={childInputRef}
                onChange={handleChildChange}
              />
              <div className="mx-auto w-16 h-16 bg-white rounded-full flex items-center justify-center text-orange-500 shadow-sm mb-4">
                <Sparkles size={32} />
              </div>
              <span className="font-bold text-orange-700 text-lg">Upload Photo</span>
            </div>
          ) : (
            <div className="relative w-full h-64 rounded-3xl overflow-hidden shadow-md border-4 border-white group">
              <img 
                src={`data:${childPhoto.mimeType};base64,${childPhoto.data}`} 
                alt="Child" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="danger" onClick={() => onChildPhotoChange(undefined)}>
                  Remove
                </Button>
              </div>
            </div>
          )}
        </div>

      </div>

      <div className="flex justify-center pt-8">
        <Button 
          onClick={onNext} 
          disabled={referenceImages.length < 1 || !childPhoto}
          className="w-full md:w-1/2 text-xl py-4 shadow-xl shadow-purple-300/50"
        >
          Next: Child Details
        </Button>
      </div>
    </div>
  );
};