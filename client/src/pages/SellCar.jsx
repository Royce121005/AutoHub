import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import api from '../services/api';
import { IoCloudUploadOutline, IoTrashOutline, IoCarSportOutline } from 'react-icons/io5';

const FUEL_TYPES = ['Petrol', 'Diesel', 'Electric', 'Hybrid', 'CNG', 'LPG'];
const TRANSMISSIONS = ['Manual', 'Automatic'];
const OWNERS = ['First', 'Second', 'Third', 'Fourth & Above'];
const INSURANCE_STATUSES = ['Comprehensive', 'Third-party', 'Expired', 'No Insurance'];

const SellCar = () => {
  const { user } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we are in Edit Mode
  const editCar = location.state?.editCar || null;
  const isEditMode = !!editCar;

  const [formData, setFormData] = useState({
    title: '',
    brand: '',
    model: '',
    variant: '',
    year: new Date().getFullYear(),
    price: '',
    fuelType: 'Petrol',
    transmission: 'Manual',
    owner: 'First',
    kilometers: '',
    color: '',
    registrationState: '',
    insurance: 'Comprehensive',
    description: '',
    city: user?.city || ''
  });

  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (isEditMode && editCar) {
      setFormData({
        title: editCar.title,
        brand: editCar.brand,
        model: editCar.model,
        variant: editCar.variant || '',
        year: editCar.year,
        price: editCar.price,
        fuelType: editCar.fuelType,
        transmission: editCar.transmission,
        owner: editCar.owner,
        kilometers: editCar.kilometers,
        color: editCar.color,
        registrationState: editCar.registrationState,
        insurance: editCar.insurance,
        description: editCar.description,
        city: editCar.city
      });
      // Pre-fill image previews with existing images
      if (editCar.images) {
        setImagePreviews(editCar.images.map(img => 
          img.startsWith('/uploads') ? `http://localhost:5000${img}` : img
        ));
      }
    }
  }, [isEditMode, editCar]);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;
    
    // Check maximum upload file count (Limit: 5)
    if (files.length + images.length > 5) {
      toast.error('You can upload a maximum of 5 images of the vehicle');
      return;
    }

    // Filter valid image files and sizes (Limit: 5MB)
    const validFiles = [];
    const newPreviews = [];

    files.forEach(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name} is not a valid image format.`);
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} exceeds the 5MB file limit.`);
        return;
      }
      validFiles.push(file);
      newPreviews.push(URL.createObjectURL(file));
    });

    setImages(prev => [...prev, ...validFiles]);
    setImagePreviews(prev => isEditMode ? newPreviews : [...prev, ...newPreviews]); // overwrite previews on edit
  };

  const handleRemoveImage = (index) => {
    setImages(prev => prev.filter((_, idx) => idx !== index));
    setImagePreviews(prev => prev.filter((_, idx) => idx !== index));
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.title.trim()) errors.title = 'Listing title is required';
    if (!formData.brand.trim()) errors.brand = 'Brand is required';
    if (!formData.model.trim()) errors.model = 'Model is required';
    if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
      errors.year = 'Please enter a valid manufacture year';
    }
    if (!formData.price || Number(formData.price) <= 0) {
      errors.price = 'Price must be a positive number';
    }
    if (formData.kilometers === '' || Number(formData.kilometers) < 0) {
      errors.kilometers = 'Kilometers driven must be 0 or higher';
    }
    if (!formData.color.trim()) errors.color = 'Color is required';
    if (!formData.registrationState.trim()) errors.registrationState = 'Registration RTO/State is required';
    if (!formData.description.trim()) errors.description = 'Description is required';
    if (!formData.city.trim()) errors.city = 'City location is required';
    
    // Images required only when creating a new listing
    if (!isEditMode && images.length === 0) {
      errors.images = 'Please select at least one image of the vehicle';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      
      // Append form fields
      Object.entries(formData).forEach(([key, val]) => {
        payload.append(key, val);
      });

      // Append image files
      images.forEach(file => {
        payload.append('images', file);
      });

      if (isEditMode) {
        await api.put(`/cars/${editCar._id}`, payload);
        toast.success('Car listing updated successfully!');
      } else {
        await api.post('/cars', payload);
        toast.success('Car listing created successfully!');
      }
      navigate('/my-listings');
    } catch (err) {
      console.error(err);
      toast.error(err.message || 'Error submitting car listing');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="sell-page-wrapper container">
      <div className="sell-form-card glass-card">
        <div className="sell-header flex-center">
          <IoCarSportOutline />
          <div>
            <h2>{isEditMode ? 'Edit Car Listing' : 'Sell Your Vehicle'}</h2>
            <p>{isEditMode ? 'Modify your vehicle details below' : 'Post details of your pre-owned car to find buyers'}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="sell-form" noValidate>
          <div className="form-sections-grid">
            
            {/* SECTION 1: BASIC INFORMATION */}
            <div className="form-section">
              <h3>Basic Specifications</h3>
              <div className="inputs-grid">
                
                <div className="form-group span-full">
                  <label htmlFor="title">Listing Title *</label>
                  <input 
                    type="text" 
                    id="title" 
                    placeholder="e.g. 2020 Honda Civic VX CVT" 
                    className={`form-input ${formErrors.title ? 'error' : ''}`}
                    value={formData.title} 
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.title && <span className="error-message">{formErrors.title}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="brand">Brand / Make *</label>
                  <input 
                    type="text" 
                    id="brand" 
                    placeholder="e.g. Honda" 
                    className={`form-input ${formErrors.brand ? 'error' : ''}`}
                    value={formData.brand} 
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.brand && <span className="error-message">{formErrors.brand}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="model">Model *</label>
                  <input 
                    type="text" 
                    id="model" 
                    placeholder="e.g. Civic" 
                    className={`form-input ${formErrors.model ? 'error' : ''}`}
                    value={formData.model} 
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.model && <span className="error-message">{formErrors.model}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="variant">Variant / Trim</label>
                  <input 
                    type="text" 
                    id="variant" 
                    placeholder="e.g. VX CVT" 
                    className="form-input"
                    value={formData.variant} 
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="year">Manufacture Year *</label>
                  <input 
                    type="number" 
                    id="year" 
                    className={`form-input ${formErrors.year ? 'error' : ''}`}
                    value={formData.year} 
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.year && <span className="error-message">{formErrors.year}</span>}
                </div>
              </div>
            </div>

            {/* SECTION 2: SPECS AND PRICING */}
            <div className="form-section">
              <h3>Pricing & Mechanical Details</h3>
              <div className="inputs-grid">
                
                <div className="form-group">
                  <label htmlFor="price">Asking Price (₹) *</label>
                  <input 
                    type="number" 
                    id="price" 
                    placeholder="e.g. 1250000" 
                    className={`form-input ${formErrors.price ? 'error' : ''}`}
                    value={formData.price} 
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.price && <span className="error-message">{formErrors.price}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="kilometers">Kilometers Driven *</label>
                  <input 
                    type="number" 
                    id="kilometers" 
                    placeholder="e.g. 45000" 
                    className={`form-input ${formErrors.kilometers ? 'error' : ''}`}
                    value={formData.kilometers} 
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.kilometers && <span className="error-message">{formErrors.kilometers}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="fuelType">Fuel Type *</label>
                  <select 
                    id="fuelType" 
                    className="form-input select-field"
                    value={formData.fuelType} 
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    {FUEL_TYPES.map(fuel => <option key={fuel} value={fuel}>{fuel}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="transmission">Transmission *</label>
                  <select 
                    id="transmission" 
                    className="form-input select-field"
                    value={formData.transmission} 
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    {TRANSMISSIONS.map(trans => <option key={trans} value={trans}>{trans}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="owner">Ownership *</label>
                  <select 
                    id="owner" 
                    className="form-input select-field"
                    value={formData.owner} 
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    {OWNERS.map(own => <option key={own} value={own}>{own} Owner</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="color">Exterior Color *</label>
                  <input 
                    type="text" 
                    id="color" 
                    placeholder="e.g. Platinum White" 
                    className={`form-input ${formErrors.color ? 'error' : ''}`}
                    value={formData.color} 
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.color && <span className="error-message">{formErrors.color}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="registrationState">Registration State / RTO *</label>
                  <input 
                    type="text" 
                    id="registrationState" 
                    placeholder="e.g. DL-3C (Delhi)" 
                    className={`form-input ${formErrors.registrationState ? 'error' : ''}`}
                    value={formData.registrationState} 
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.registrationState && <span className="error-message">{formErrors.registrationState}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="insurance">Insurance Status *</label>
                  <select 
                    id="insurance" 
                    className="form-input select-field"
                    value={formData.insurance} 
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  >
                    {INSURANCE_STATUSES.map(ins => <option key={ins} value={ins}>{ins}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="city">City Location *</label>
                  <input 
                    type="text" 
                    id="city" 
                    placeholder="e.g. Delhi" 
                    className={`form-input ${formErrors.city ? 'error' : ''}`}
                    value={formData.city} 
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                  {formErrors.city && <span className="error-message">{formErrors.city}</span>}
                </div>
              </div>
            </div>

            {/* SECTION 3: DESCRIPTION */}
            <div className="form-section span-full">
              <h3>Vehicle History & Description</h3>
              <div className="form-group">
                <label htmlFor="description">Detailed Description *</label>
                <textarea 
                  id="description" 
                  rows="5"
                  placeholder="Provide details about vehicle service history, major repairs, accidents, tyre condition, additional accessories..." 
                  className={`form-input text-area-field ${formErrors.description ? 'error' : ''}`}
                  value={formData.description} 
                  onChange={handleInputChange}
                  disabled={isSubmitting}
                />
                {formErrors.description && <span className="error-message">{formErrors.description}</span>}
              </div>
            </div>

            {/* SECTION 4: IMAGES */}
            <div className="form-section span-full">
              <h3>Upload Photos</h3>
              <p style={{ fontSize: '0.82rem', marginBottom: '16px' }}>
                {isEditMode 
                  ? 'Optional: Uploading new photos will overwrite existing images. Leave blank to preserve old files.'
                  : 'Add up to 5 clear photos of the vehicle (exterior, interior, engine). Max size 5MB each.'}
              </p>
              
              <div className="upload-container">
                <label className="upload-trigger glass-card flex-center">
                  <IoCloudUploadOutline />
                  <div>
                    <span>Select Images</span>
                    <p>PNG, JPG, JPEG, WEBP up to 5MB</p>
                  </div>
                  <input 
                    type="file" 
                    multiple 
                    accept="image/*" 
                    onChange={handleImageChange}
                    style={{ display: 'none' }}
                    disabled={isSubmitting}
                  />
                </label>

                {formErrors.images && <span className="error-message">{formErrors.images}</span>}

                {/* Previews */}
                {imagePreviews.length > 0 && (
                  <div className="previews-row">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="preview-bubble">
                        <img src={preview} alt="Upload Preview" />
                        <button 
                          type="button" 
                          className="btn-delete-img flex-center"
                          onClick={() => handleRemoveImage(index)}
                          disabled={isSubmitting}
                        >
                          <IoTrashOutline />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions flex-center">
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => navigate(-1)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn-primary submit-form-btn" 
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (isEditMode ? 'Updating Listing...' : 'Publishing Listing...') 
                : (isEditMode ? 'Update Listing' : 'Publish Listing')
              }
            </button>
          </div>
        </form>
      </div>

      <style>{`
        .sell-page-wrapper {
          margin-top: 100px;
          padding-bottom: 60px;
          display: flex;
          justify-content: center;
        }

        .sell-form-card {
          width: 100%;
          max-width: 850px;
          padding: 40px;
        }

        .sell-header {
          justify-content: flex-start;
          gap: 16px;
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 24px;
          margin-bottom: 30px;
        }

        .sell-header svg {
          font-size: 2.8rem;
          color: var(--accent-blue);
        }

        .sell-header h2 {
          font-size: 1.6rem;
          color: var(--text-primary);
        }

        .sell-form {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .form-sections-grid {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }

        .form-section {
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          padding: 24px;
          background: rgba(255, 255, 255, 0.01);
        }

        .form-section h3 {
          font-size: 1.1rem;
          margin-bottom: 20px;
          color: var(--text-primary);
          border-left: 3px solid var(--accent-blue);
          padding-left: 10px;
        }

        .inputs-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .span-full {
          grid-column: span 2;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-group label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--text-secondary);
        }

        .form-input.error {
          border-color: var(--error);
          box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
        }

        .error-message {
          font-size: 0.75rem;
          color: var(--error);
          font-weight: 500;
        }

        .select-field {
          background: rgba(255, 255, 255, 0.03);
          cursor: pointer;
        }

        .select-field option {
          background: var(--bg-secondary);
          color: var(--text-primary);
        }

        .text-area-field {
          resize: vertical;
          line-height: 1.6;
        }

        /* Image upload zone */
        .upload-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .upload-trigger {
          flex-direction: column;
          padding: 30px;
          border: 2px dashed var(--border-color);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          text-align: center;
          gap: 12px;
        }

        .upload-trigger:hover {
          border-color: var(--accent-blue);
          background: rgba(59, 130, 246, 0.03);
        }

        .upload-trigger svg {
          font-size: 2.2rem;
          color: var(--accent-blue);
        }

        .upload-trigger span {
          font-weight: 600;
          font-size: 0.95rem;
        }

        .upload-trigger p {
          font-size: 0.75rem;
        }

        .previews-row {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          padding: 10px 0;
        }

        .preview-bubble {
          position: relative;
          width: 100px;
          height: 80px;
          border-radius: var(--radius-sm);
          overflow: hidden;
          border: 1px solid var(--border-color);
          flex-shrink: 0;
        }

        .preview-bubble img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .btn-delete-img {
          position: absolute;
          top: 4px;
          right: 4px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: rgba(0, 0, 0, 0.7);
          color: white;
          font-size: 0.85rem;
          cursor: pointer;
        }

        .btn-delete-img:hover {
          background: var(--error);
        }

        .form-actions {
          gap: 16px;
          border-top: 1px solid var(--border-color);
          padding-top: 24px;
          justify-content: flex-end;
        }

        .submit-form-btn {
          padding: 0.85rem 2rem;
        }

        @media (max-width: 768px) {
          .inputs-grid {
            grid-template-columns: 1fr;
          }
          .span-full {
            grid-column: span 1;
          }
          .sell-form-card {
            padding: 24px 16px;
          }
        }
      `}</style>
    </div>
  );
};

export default SellCar;
