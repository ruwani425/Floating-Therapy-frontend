// src/pages/admin/ContentManagementPage.tsx
// Note: To enable rich text editor, run: npm install react-quill
// Then uncomment the ReactQuill import and usage below

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';
import apiRequest from '../../core/axios';
import { uploadImage } from '../../firebase/firebase-config';
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ArrowLeft,
  Image as ImageIcon,
  Save,
  X,
  Search,
} from 'lucide-react';
import Swal from 'sweetalert2';

const THETA_COLORS = {
  darkestBlue: '#0F1F2E',
  darkBlue: '#1a3a52',
  mediumBlue: '#3a7ca5',
  lightBlue: '#6ab4dc',
  cyan: '#A0E7E5',
  lightCyan: '#D4F1F9',
  white: '#FFFFFF',
  bgLight: '#F5F8FC',
};

interface Blog {
  _id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  imageUrl: string;
  author: string;
  category: string;
  tags: string[];
  isActive: boolean;
  viewCount: number;
  createdAt: string;
  updatedAt: string;
}

const ContentManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    description: '',
    content: '',
    imageUrl: '',
    author: 'Admin',
    category: 'General',
    tags: [] as string[],
    isActive: false,
  });

  // Rich text editor configuration (uncomment when react-quill is installed)
  // const quillModules = {
  //   toolbar: [
  //     [{ header: [1, 2, 3, false] }],
  //     ['bold', 'italic', 'underline', 'strike'],
  //     [{ list: 'ordered' }, { list: 'bullet' }],
  //     [{ color: [] }, { background: [] }],
  //     ['link'],
  //     ['clean'],
  //   ],
  // };

  useEffect(() => {
    fetchBlogs();
  }, [statusFilter, searchTerm]);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await apiRequest.get<{ success: boolean; data: Blog[] }>(
        '/blogs/admin/all',
        {
          params: {
            status: statusFilter !== 'all' ? statusFilter : undefined,
            search: searchTerm || undefined,
          },
        }
      );

      if (response.success) {
        setBlogs(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch blogs:', error);
      Swal.fire('Error', 'Failed to load blogs', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (title: string) => {
    setFormData({
      ...formData,
      title,
      slug: generateSlug(title),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsUploading(true);

      let imageUrl = formData.imageUrl;

      // Upload image if new one selected
      if (imageFile) {
        const imagePath = `blogs/${Date.now()}-${imageFile.name}`;
        imageUrl = await uploadImage(imageFile, imagePath);
      }

      const blogData = {
        ...formData,
        imageUrl,
      };

      if (editingBlog) {
        // Update existing blog
        await apiRequest.put(`/blogs/${editingBlog._id}`, blogData);
        Swal.fire('Success', 'Blog updated successfully', 'success');
      } else {
        // Create new blog
        await apiRequest.post('/blogs', blogData);
        Swal.fire('Success', 'Blog created successfully', 'success');
      }

      setShowModal(false);
      resetForm();
      fetchBlogs();
    } catch (error: any) {
      console.error('Failed to save blog:', error);
      Swal.fire('Error', error.response?.data?.message || 'Failed to save blog', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      description: '',
      content: '',
      imageUrl: '',
      author: 'Admin',
      category: 'General',
      tags: [],
      isActive: false,
    });
    setImageFile(null);
    setImagePreview('');
    setEditingBlog(null);
  };

  const handleEdit = (blog: Blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      slug: blog.slug,
      description: blog.description,
      content: blog.content,
      imageUrl: blog.imageUrl,
      author: blog.author,
      category: blog.category,
      tags: blog.tags,
      isActive: blog.isActive,
    });
    setImagePreview(blog.imageUrl);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await apiRequest.delete(`/blogs/${id}`);
        Swal.fire('Deleted!', 'Blog has been deleted.', 'success');
        fetchBlogs();
      } catch (error) {
        Swal.fire('Error', 'Failed to delete blog', 'error');
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    try {
      await apiRequest.patch(`/blogs/${id}/toggle-status`);
      Swal.fire('Success', 'Blog status updated', 'success');
      fetchBlogs();
    } catch (error) {
      Swal.fire('Error', 'Failed to update blog status', 'error');
    }
  };

  return (
    <div style={{ backgroundColor: THETA_COLORS.bgLight }} className="min-h-screen">
      <div className="w-full mx-auto p-6 md:p-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center text-sm font-semibold mb-4 hover:opacity-70 transition-opacity"
            style={{ color: THETA_COLORS.mediumBlue }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>

          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-bold mb-2" style={{ color: THETA_COLORS.darkestBlue }}>
                Content Management
              </h1>
              <p className="text-sm font-semibold" style={{ color: THETA_COLORS.mediumBlue }}>
                Manage your blog posts and articles
              </p>
            </div>

            <button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm text-white transition-all hover:opacity-90 shadow-sm"
              style={{ backgroundColor: THETA_COLORS.mediumBlue }}
            >
              <Plus className="w-4 h-4" />
              Create Blog Post
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Blogs</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
          </select>
        </div>

        {/* Blog List */}
        {isLoading ? (
          <div className="flex justify-center items-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : blogs.length === 0 ? (
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <p className="text-lg text-slate-600">No blogs found. Create your first blog post!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-md transition-all"
              >
                <div className="relative h-48">
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        blog.isActive
                          ? 'bg-green-500 text-white'
                          : 'bg-slate-500 text-white'
                      }`}
                    >
                      {blog.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2" style={{ color: THETA_COLORS.darkestBlue }}>
                    {blog.title}
                  </h3>
                  <p className="text-sm text-slate-600 mb-3 line-clamp-2">{blog.description}</p>

                  <div className="flex items-center justify-between text-xs text-slate-500 mb-4">
                    <span>{blog.category}</span>
                    <span>{blog.viewCount} views</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleToggleStatus(blog._id)}
                      className="flex items-center justify-center px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors"
                    >
                      {blog.isActive ? (
                        <EyeOff className="w-4 h-4 text-slate-600" />
                      ) : (
                        <Eye className="w-4 h-4 text-slate-600" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className="flex items-center justify-center px-3 py-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl max-w-4xl w-full my-8 max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
                <h2 className="text-2xl font-bold" style={{ color: THETA_COLORS.darkestBlue }}>
                  {editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}
                </h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.darkestBlue }}>
                    Featured Image *
                  </label>
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center">
                    {imagePreview ? (
                      <div className="relative">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="max-h-64 mx-auto rounded-lg"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                            setFormData({ ...formData, imageUrl: '' });
                          }}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                        <label className="cursor-pointer">
                          <span className="text-blue-600 hover:text-blue-700 font-semibold">
                            Click to upload
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageSelect}
                            className="hidden"
                          />
                        </label>
                        <p className="text-sm text-slate-500 mt-2">PNG, JPG up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.darkestBlue }}>
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Slug */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.darkestBlue }}>
                    Slug *
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="text-xs text-slate-500 mt-1">URL-friendly version of the title</p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.darkestBlue }}>
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Content (Rich Text Editor) */}
                <div>
                  <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.darkestBlue }}>
                    Content *
                  </label>
                  {/* Temporary textarea - Replace with ReactQuill after installing react-quill */}
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    required
                    rows={10}
                    placeholder="Enter blog content... (Install react-quill for rich text editing)"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    💡 Tip: Run <code className="bg-slate-100 px-2 py-1 rounded">npm install react-quill</code> to enable rich text editor
                  </p>
                  {/* After installing react-quill, replace textarea with:
                  <ReactQuill
                    value={formData.content}
                    onChange={(value) => setFormData({ ...formData, content: value })}
                    modules={quillModules}
                    theme="snow"
                    className="bg-white"
                  />
                  */}
                </div>

                {/* Category & Author */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.darkestBlue }}>
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2" style={{ color: THETA_COLORS.darkestBlue }}>
                      Author
                    </label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Active Status */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 rounded border-slate-300 focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold" style={{ color: THETA_COLORS.darkestBlue }}>
                    Publish immediately (make blog visible to public)
                  </label>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-4 border-t border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      resetForm();
                    }}
                    className="flex-1 px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading || !imagePreview}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: THETA_COLORS.mediumBlue }}
                  >
                    {isUploading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        {editingBlog ? 'Update Blog' : 'Create Blog'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ContentManagementPage;

