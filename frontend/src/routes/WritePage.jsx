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
  "header", "bold", "italic", "underline", "strike",
  "blockquote", "code-block", "list", "bullet", "link",
  "image", "video"
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
        setMediaState(prev => ({ ...prev, progress: 0, showProgress: false }));
      }, 2000);
    }
    return () => clearTimeout(timeoutId);
  }, [mediaState.progress]);

  const handleInputChange = useCallback((field, value) => {
    setFormState(prev => ({ ...prev, [field]: value, isDirty: true }));
  }, []);

  const handleMediaUpload = useCallback((type, data) => {
    setMediaState(prev => ({ ...prev, [type]: data }));
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
      setFormState(prev => ({ ...prev, isDirty: false }));
      navigate(`/${res.data.slug}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || "Failed to create post. Please try again.");
    },
  });

  if (!isLoaded) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
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
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Create Post</h1>
            <p className="text-gray-600 mt-2">Share your thoughts with the world</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-gray-900"
          >
            Cancel
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <form onSubmit={(e) => {
              e.preventDefault();
              mutation.mutate({
                img: mediaState.cover?.filePath || "",
                title: formState.title,
                category: formState.category,
                desc: formState.desc,
                content: formState.content,
              });
            }} className="space-y-8">
              <Upload
                type="image"
                setProgress={(progress) => setMediaState(prev => ({ ...prev, progress, showProgress: true }))}
                setData={(data) => handleMediaUpload("cover", data)}
              >
                <div className="group relative w-full h-64 border-2 border-dashed border-gray-300 rounded-2xl overflow-hidden transition-all hover:border-blue-500">
                  {mediaState.cover ? (
                    <>
                      <img
                        src={mediaState.cover.url}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <p className="text-white">Change Cover Image</p>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center">
                      <ImagePlus className="h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-gray-500 font-medium">Add Cover Image</p>
                      <p className="text-sm text-gray-400 mt-2">Recommended: 1600x900px</p>
                    </div>
                  )}
                </div>
              </Upload>

              <div className="space-y-6">
                <input
                  type="text"
                  placeholder="Your Post Title"
                  value={formState.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className="w-full text-4xl font-bold bg-transparent outline-none border-b-2 border-gray-200 focus:border-blue-500 transition-all py-2"
                  required
                />

                <div className="flex gap-4 items-center">
                  <select
                    value={formState.category}
                    onChange={(e) => handleInputChange("category", e.target.value)}
                    className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none transition-all"
                  >
                    {CATEGORIES.map((category) => (
                      <option key={category.value} value={category.value}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                  <div className="flex items-center text-gray-500">
                    <Calendar className="h-4 w-4 mr-2" />
                    {new Date().toLocaleDateString()}
                  </div>
                </div>

                <textarea
                  placeholder="Write a brief description..."
                  value={formState.desc}
                  onChange={(e) => handleInputChange("desc", e.target.value)}
                  className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 outline-none min-h-[100px] resize-none transition-all"
                  required
                />

                <div className="border-t border-gray-200 my-6"></div>

                <div className="flex gap-4">
                  <div className="flex flex-col gap-3">
                    <Upload
                      type="image"
                      setProgress={(progress) => setMediaState(prev => ({ ...prev, progress }))}
                      setData={(data) => handleMediaUpload("img", data)}
                    >
                      <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all">
                        <ImagePlus className="h-4 w-4" />
                        Add Image
                      </button>
                    </Upload>
                    <Upload
                      type="video"
                      setProgress={(progress) => setMediaState(prev => ({ ...prev, progress }))}
                      setData={(data) => handleMediaUpload("video", data)}
                    >
                      <button type="button" className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-200 transition-all">
                        <Video className="h-4 w-4" />
                        Add Video
                      </button>
                    </Upload>
                  </div>

                  <div className="flex-1">
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                      <ReactQuill
                        theme="snow"
                        value={formState.content}
                        onChange={(content) => handleInputChange("content", content)}
                        modules={EDITOR_MODULES}
                        formats={EDITOR_FORMATS}
                        readOnly={mediaState.progress > 0 && mediaState.progress < 100}
                        className="h-96"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-6">
                <button
                  type="submit"
                  disabled={mutation.isLoading || (mediaState.progress > 0 && mediaState.progress < 100)}
                  className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {mutation.isLoading ? <Loader /> : "Publish Post"}
                </button>
              </div>
            </form>
        </div>

        {mediaState.showProgress && (
          <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-lg p-4 w-80">
            <div className="flex justify-between text-sm mb-2">
              <span>Upload Progress</span>
              <span>{mediaState.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${mediaState.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WritePage;