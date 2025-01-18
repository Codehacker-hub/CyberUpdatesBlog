import React, { useEffect, useState, useCallback } from "react";
import { useAuth, useUser } from "@clerk/clerk-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Upload from "../components/Upload";

const CATEGORIES = [
  { value: "general", label: "General" },
  { value: "cyber-security", label: "Cyber Security" },
  { value: "ethical-hacking", label: "Ethical Hacking" },
  { value: "tech-news", label: "Tech News" },
  { value: "tutorial", label: "Tutorial" },
];

// Quill editor modules configuration
const EDITOR_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    ["blockquote", "code-block"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image", "video"],
    ["clean"],
  ],
  clipboard: {
    matchVisual: false,
  },
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

  // Form state
  const [formState, setFormState] = useState({
    title: "",
    category: "general",
    desc: "",
    content: "",
    isDirty: false,
  });

  // Media state
  const [mediaState, setMediaState] = useState({
    cover: "",
    img: "",
    video: "",
    progress: 0,
    showProgress: false,
  });

  // Handle progress bar visibility
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
    } else if (mediaState.progress > 0) {
      setMediaState((prev) => ({
        ...prev,
        showProgress: true,
      }));
    }
    return () => clearTimeout(timeoutId);
  }, [mediaState.progress]);

  // Handle unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (formState.isDirty) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [formState.isDirty]);

  // Handle media insertions
  useEffect(() => {
    if (mediaState.img) {
      setFormState((prev) => ({
        ...prev,
        content:
          prev.content +
          `<p><img src="${mediaState.img.url}" alt="Image"/></p>`,
        isDirty: true,
      }));
    }
  }, [mediaState.img]);

  useEffect(() => {
    if (mediaState.video) {
      setFormState((prev) => ({
        ...prev,
        content:
          prev.content +
          `<p><iframe class="ql-video" src="${mediaState.video.url}" frameborder="0"></iframe></p>`,
        isDirty: true,
      }));
    }
  }, [mediaState.video]);

  const handleInputChange = useCallback((field, value) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
      isDirty: true,
    }));
  }, []);

  const handleMediaProgress = useCallback((progress) => {
    setMediaState((prev) => ({
      ...prev,
      progress,
    }));
  }, []);

  const handleMediaUpload = useCallback((type, data) => {
    setMediaState((prev) => ({
      ...prev,
      [type]: data,
    }));
  }, []);

  const mutation = useMutation({
    mutationFn: async (postData) => {
      const token = await getToken();
      return axios.post(`${import.meta.env.VITE_API_URL}/posts`, postData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
      console.error("Error:", error);
    },
  });

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const data = {
        img: mediaState.cover?.filePath || "",
        title: formState.title,
        category: formState.category,
        desc: formState.desc,
        content: formState.content,
      };
      mutation.mutate(data);
    },
    [formState, mediaState.cover, mutation]
  );

  if (!isLoaded) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-800"></div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex h-[calc(100vh-80px)] items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <p className="text-lg">Please log in to create a post!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-80px)] p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-light mb-8">Create a New Post</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <Upload
            type="image"
            setProgress={handleMediaProgress}
            setData={(data) => handleMediaUpload("cover", data)}
          >
            <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center hover:border-blue-500 transition-colors cursor-pointer">
              {mediaState.cover ? (
                <img
                  src={mediaState.cover.url}
                  alt="Cover"
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="text-center">
                  <p className="text-gray-500">Drop your cover image here</p>
                  <p className="text-sm text-gray-400">or click to upload</p>
                </div>
              )}
            </div>
          </Upload>

          <input
            className="w-full text-4xl font-semibold bg-transparent outline-none border-b-2 border-gray-200 focus:border-blue-500 transition-colors"
            type="text"
            placeholder="My Awesome Story"
            value={formState.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            required
          />

          <div className="flex items-center gap-4">
            <label htmlFor="category" className="text-sm font-medium">
              Category:
            </label>
            <select
              value={formState.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              className="p-2 rounded-xl bg-white shadow-md border border-gray-200 focus:border-blue-500 outline-none"
              required
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <textarea
            className="w-full p-4 rounded-xl bg-white shadow-md border border-gray-200 focus:border-blue-500 outline-none min-h-[100px]"
            placeholder="A Short Description"
            value={formState.desc}
            onChange={(e) => handleInputChange("desc", e.target.value)}
            required
          />

          <div className="flex gap-4">
            <div className="flex flex-col gap-2">
              <Upload
                type="image"
                setProgress={handleMediaProgress}
                setData={(data) => handleMediaUpload("img", data)}
              >
                <button
                  type="button"
                  className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-50"
                >
                  🌆 Add Image
                </button>
              </Upload>
              <Upload
                type="video"
                setProgress={handleMediaProgress}
                setData={(data) => handleMediaUpload("video", data)}
              >
                <button
                  type="button"
                  className="p-2 rounded-lg bg-white shadow-md hover:bg-gray-50"
                >
                  ▶️ Add Video
                </button>
              </Upload>
            </div>

            <div className="flex-1">
              <div
                className="rounded-xl bg-white shadow-md overflow-hidden quill-editor"
                style={{ height: "600px" }}
              >
                <ReactQuill
                  theme="snow"
                  value={formState.content}
                  onChange={(content) => handleInputChange("content", content)}
                  modules={{
                    ...EDITOR_MODULES,
                    toolbar: {
                      ...EDITOR_MODULES.toolbar,
                      container: [
                        [{ header: [1, 2, 3, false] }],
                        ["bold", "italic", "underline", "strike"],
                        ["blockquote", "code-block"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image", "video"],
                        ["clean"],
                      ],
                    },
                  }}
                  formats={EDITOR_FORMATS}
                  readOnly={
                    mediaState.progress > 0 && mediaState.progress < 100
                  }
                  style={{ height: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        {mediaState.showProgress && (
          <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 w-80 transition-opacity duration-300">
            <div className="flex justify-between text-sm mb-2">
              <span>Upload Progress</span>
              <span>{mediaState.progress}%</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${mediaState.progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={
              mutation.isLoading ||
              (mediaState.progress > 0 && mediaState.progress < 100)
            }
            className="bg-blue-800 text-white font-medium rounded-xl px-6 py-3 hover:bg-blue-700 transition-colors disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {mutation.isLoading ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Publishing...
              </span>
            ) : (
              "Publish Post"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default WritePage;
