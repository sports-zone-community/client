import { useForm } from "react-hook-form";
import { CloudArrowUpIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { ToastContent } from "../../components/toastContent/toastContent";
import { ToastType } from "../../shared/enums/ToastType";
import { useState } from "react";
import { createPost } from "../../features/api/posts.ts";

const addPostSchema = z.object({
    image: z.instanceof(File),
    description: z
        .string()
        .min(1, { message: "Content cannot be empty" })
        .max(100, { message: "Content must be less than 100 characters" }),
});

type FormInputs = z.infer<typeof addPostSchema>;

const AddPost = () => {
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
    } = useForm<FormInputs>({
        resolver: zodResolver(addPostSchema),
        mode: "onChange",
    });

    const navigate = useNavigate();

    const onSubmitForm = async (data: FormInputs) => {
        const { image, description } = data;

        try {
            await createPost(image, description);
            toast.success(
                <ToastContent
                    message="Post created successfully!"
                    description="Redirecting to dashboard..."
                    type={ToastType.SUCCESS}
                />
            );
        } catch (error) {
            console.error("Failed to create post", error);
            toast.error(
                <ToastContent
                    message="Failed to create post"
                    description="Please try again later"
                    type={ToastType.ERROR}
                />
            );
        }

        reset();
        setTimeout(() => {
            navigate("/dashboard");
        }, 3000);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!["image/jpeg", "image/png"].includes(file.type)) {
                alert("Only JPEG, PNG, and GIF images are allowed");
                return;
            }

            if (file.size > 5 * 1024 * 1024) {
                alert("Image must be less than 5MB");
                return;
            }

            setValue("image", file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    return (
        <div className="min-h-screen flex justify-center items-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto bg-gray-900 rounded-2xl shadow-xl overflow-hidden"
            >
                <div className="w-120 p-8">
                    <div className="flex items-center justify-center space-x-2 mb-8">
                        <h1 className="text-3xl font-bold text-gray-100">
                            Create New Post
                        </h1>
                    </div>

                    <form
                        onSubmit={handleSubmit(onSubmitForm)}
                        className="space-y-6"
                    >
                        <div className="space-y-2">
                            <label className="block text-lg font-medium text-gray-300">
                                Post Image
                            </label>
                            <div
                                className={`border-2 border-dashed rounded-xl p-4 
                ${previewImage ? "border-blue-500" : "border-gray-700"} 
                hover:border-blue-400 transition-colors cursor-pointer
                bg-gray-800`}
                            >
                                <input
                                    {...register("image")}
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    className="hidden"
                                    id="post-image"
                                    onChange={handleImageChange}
                                />
                                <label
                                    htmlFor="post-image"
                                    className="cursor-pointer"
                                >
                                    {previewImage ? (
                                        <div className="relative group">
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="max-h-64 w-full rounded-lg object-cover"
                                            />
                                            <div
                                                className="absolute inset-0 bg-black bg-opacity-60
                        opacity-0 group-hover:opacity-100 transition-opacity
                        rounded-lg flex items-center justify-center"
                                            >
                                                <p className="text-gray-200">
                                                    Change Image
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <CloudArrowUpIcon className="mx-auto h-16 w-16 text-blue-400" />
                                            <p className="mt-2 text-sm text-gray-400">
                                                Click to upload group image
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                PNG, JPG less than 5MB
                                            </p>
                                        </div>
                                    )}
                                </label>
                                {errors.image && (
                                    <p className="text-red-400 text-sm mt-2">
                                        {errors.image.message}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="block text-lg font-medium text-gray-300">
                                Post Description
                            </label>
                            <textarea
                                {...register("description")}
                                className={`w-full px-4 py-3 border rounded-xl bg-gray-800
                  focus:ring-2 focus:ring-blue-500 focus:border-transparent
                  transition-all min-h-[120px] resize-none placeholder-gray-500
                  text-gray-100 ${errors.description ? "border-red-500" : "border-gray-700"}`}
                                placeholder="Write your description..."
                            />
                            {errors.description && (
                                <p className="text-red-400 text-sm mt-1">
                                    {errors.description.message}
                                </p>
                            )}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-800
                text-gray-100 py-4 px-6 rounded-xl font-medium text-lg
                hover:from-blue-700 hover:to-blue-900 transition-all
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                focus:ring-offset-gray-900 shadow-lg"
                        >
                            Create Post
                        </motion.button>
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AddPost;
