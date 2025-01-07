import { useState, ChangeEvent } from 'react';
import { IoMdCloudUpload } from 'react-icons/io';

interface AddPostProps {
  groupName: string;
}

const AddPost = ({ groupName }: AddPostProps) => {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [description, setDescription] = useState('');

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ image, description });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
            {groupName}
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <label className="block text-lg font-medium text-gray-700">Add Photo</label>
              <div className={`border-2 border-dashed rounded-lg p-4 
                ${preview ? 'border-green-500' : 'border-gray-300'} 
                hover:border-blue-500 transition-colors cursor-pointer`}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="max-h-64 mx-auto rounded-lg object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <IoMdCloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-gray-500">Click to upload image</p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* תיבת תיאור */}
            <div className="space-y-2">
              <label className="block text-lg font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                  focus:ring-blue-500 focus:border-transparent transition-all
                  min-h-[100px] resize-none"
                placeholder="Write your post description..."
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg
                hover:bg-blue-700 transition-colors font-medium
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
