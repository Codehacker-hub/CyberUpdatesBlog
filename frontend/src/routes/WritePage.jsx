import React, { useEffect, useState, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { PenLine, ImagePlus, Video, Calendar } from "lucide-react";
import Upload from "../components/Upload";
import Loader from "../components/Loader";

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "cyber-security", label: "Cyber Security" },
  { value: "ethical-hacking", label: "Ethical Hacking" },
  { value: "tech-news", label: "Tech News" },
  { value: "tutorial", label: "Tutorial" },
];

const EDITOR_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: { matchVisual: false },
};

const EDITOR_FORMATS = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "code-block",
  "list",
  "bullet",
  "link",
  "image",
  "video",
];

const WritePage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const { getToken } = useAuth();

  const [formState, setFormState] = useState({
    title: "",
    category: "general",
    desc: "",
    content: "",
    isDirty: false,
  });

  const [mediaState, setMediaState] = useState({
    cover: "",
    img: "",
    video: "",
    progress: 0,
    showProgress: false,
  });

  useEffect(() => {
    let timeoutId;
    if (mediaState.progress === 100) {
      timeoutId = setTimeout(() => {
        setMediaState((prev) => ({
          ...prev,
          progress: 0,
          showProgress: false,
        }));
      }, 2000);
    }
    return () => clearTimeout(timeoutId);
  }, [mediaState.progress]);

  const handleInputChange = useCallback((field, value) => {
    setFormState((prev) => ({ ...prev, [field]: value, isDirty: true }));
  }, []);

  const handleMediaUpload = useCallback((type, data) => {
    setMediaState((prev) => ({ ...prev, [type]: data }));
  }, []);

  const mutation = useMutation({
    mutationFn: async (postData) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, postData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: (res) => {
      toast.success("Post created successfully!");
      setFormState((prev) => ({ ...prev, isDirty: false }));
      navigate(`/${res.data.slug}`);
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message ||
          "Failed to create post. Please try again."
      );
    },
  });

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="bg-white rounded-xl shadow-lg p-8 w-96">
          <div className="text-center space-y-4">
            <PenLine className="mx-auto h-12 w-12 text-blue-600" />
            <h2 className="text-2xl font-semibold">Sign In Required</h2>
            <p className="text-gray-600">Please log in to create a post</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Create Post</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate({
                img: mediaState.cover?.filePath || "",
                title: formState.title,
                category: formState.category,
                desc: formState.desc,
                content: formState.content,
              });
            }}
            className="space-y-8"
          >
            <Upload
              type="image"
              setProgress={(progress) =>
                setMediaState((prev) => ({
                  ...prev,
                  progress,
                  showProgress: true,
                }))
              }
              setData={(data) => handleMediaUpload("cover", data)}
            >
              <div className="group relative w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden hover:border-blue-500">
                {mediaState.cover ? (
                  <img
                    src={mediaState.cover.url}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center">
                    <ImagePlus className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-gray-500 font-medium">Add Cover Image</p>
                  </div>
                )}
              </div>
            </Upload>

            <input
              type="text"
              placeholder="Your Post Title"
              value={formState.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full text-4xl font-bold border-b-2 focus:border-blue-500 py-2"
              required
            />

            <select
              value={formState.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 text-gray-700 hover:bg-gray-100 transition-all outline-none shadow-sm"
            >
              {CATEGORIES.map((category) => (
                <option
                  key={category.value}
                  value={category.value}
                  className="text-gray-700 bg-white hover:bg-gray-50"
                >
                  {category.label}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Write a brief description..."
              value={formState.desc}
              onChange={(e) => handleInputChange("desc", e.target.value)}
              className="w-full p-4 rounded-xl bg-gray-50 border min-h-[100px] resize-none"
              required
            />

            <ReactQuill
              theme="snow"
              value={formState.content}
              onChange={(content) => handleInputChange("content", content)}
              modules={EDITOR_MODULES}
              formats={EDITOR_FORMATS}
              className="h-96"
            />

            <button
              type="submit"
              disabled={
                mutation.isLoading ||
                (mediaState.progress > 0 && mediaState.progress < 100)
              }
              className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium"
            >
              {mutation.isLoading ? <Loader /> : "Publish Post"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default WritePage;
