import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Shield,
  Loader2,
  Plus,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

interface ValidationErrors {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  experienceYears?: string;
  profileImage?: string;
  displayOrder?: string;
}

export default function SecurityTeamEditor() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Form state
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [experienceYears, setExperienceYears] = useState("");
  const [displayOrder, setDisplayOrder] = useState("1");
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);

  // Validation errors
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});

  // Arrays
  const [specializations, setSpecializations] = useState<string[]>([]);
  const [newSpecialization, setNewSpecialization] = useState("");
  const [certifications, setCertifications] = useState<string[]>([]);
  const [newCertification, setNewCertification] = useState("");

  // Image state
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (isEditMode) {
      loadTeamMember();
    }
  }, [id]);

  // Validation on field change
  useEffect(() => {
    if (touched.name) validateName(name);
  }, [name, touched.name]);

  useEffect(() => {
    if (touched.title) validateTitle(title);
  }, [title, touched.title]);

  useEffect(() => {
    if (touched.email) validateEmail(email);
  }, [email, touched.email]);

  useEffect(() => {
    if (touched.phone) validatePhone(phone);
  }, [phone, touched.phone]);

  useEffect(() => {
    if (touched.experienceYears) validateExperienceYears(experienceYears);
  }, [experienceYears, touched.experienceYears]);

  useEffect(() => {
    if (touched.displayOrder) validateDisplayOrder(displayOrder);
  }, [displayOrder, touched.displayOrder]);

  useEffect(() => {
    if (touched.profileImage) validateProfileImage();
  }, [profileImageUrl, touched.profileImage]);

  const loadTeamMember = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("security_team")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setName(data.name);
      setTitle(data.title);
      setBio(data.bio || "");
      setPhone(data.phone || "");
      setEmail(data.email || "");
      setExperienceYears(data.experience_years?.toString() || "");
      setDisplayOrder(data.display_order?.toString() || "0");
      setIsFeatured(data.is_featured);
      setIsActive(data.is_active);
      setSpecializations(data.specializations || []);
      setCertifications(data.certifications || []);
      setProfileImageUrl(data.profile_image_url);
      setImagePreview(data.profile_image_url);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Validation functions
  const validateName = (value: string): boolean => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, name: "Name is required" }));
      return false;
    }
    if (value.length < 2) {
      setErrors(prev => ({ ...prev, name: "Name must be at least 2 characters" }));
      return false;
    }
    // Only allow letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\s'-]+$/.test(value)) {
      setErrors(prev => ({ ...prev, name: "Name can only contain letters, spaces, hyphens, and apostrophes" }));
      return false;
    }
    setErrors(prev => ({ ...prev, name: undefined }));
    return true;
  };

  const validateTitle = (value: string): boolean => {
    if (!value.trim()) {
      setErrors(prev => ({ ...prev, title: "Title is required" }));
      return false;
    }
    if (value.length < 2) {
      setErrors(prev => ({ ...prev, title: "Title must be at least 2 characters" }));
      return false;
    }
    // Only allow letters, spaces, and common punctuation (no numbers)
    if (!/^[a-zA-Z\s&,.-]+$/.test(value)) {
      setErrors(prev => ({ ...prev, title: "Title can only contain letters and common punctuation" }));
      return false;
    }
    setErrors(prev => ({ ...prev, title: undefined }));
    return true;
  };

  const validateEmail = (value: string): boolean => {
    if (!value) {
      // Email is optional, so no error if empty
      setErrors(prev => ({ ...prev, email: undefined }));
      return true;
    }
    // RFC 5322 simplified email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      setErrors(prev => ({ ...prev, email: "Please enter a valid email address" }));
      return false;
    }
    setErrors(prev => ({ ...prev, email: undefined }));
    return true;
  };

  const validatePhone = (value: string): boolean => {
    if (!value) {
      // Phone is optional
      setErrors(prev => ({ ...prev, phone: undefined }));
      return true;
    }
    // Allow common phone formats: +44 7700 900000, (555) 555-5555, 555-555-5555, etc.
    const phoneRegex = /^[\d\s()+-]+$/;
    if (!phoneRegex.test(value)) {
      setErrors(prev => ({ ...prev, phone: "Phone number can only contain numbers, spaces, +, -, and parentheses" }));
      return false;
    }
    // Check if there are enough digits
    const digitsOnly = value.replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      setErrors(prev => ({ ...prev, phone: "Phone number must have at least 10 digits" }));
      return false;
    }
    setErrors(prev => ({ ...prev, phone: undefined }));
    return true;
  };

  const validateExperienceYears = (value: string): boolean => {
    if (!value) {
      // Experience is optional
      setErrors(prev => ({ ...prev, experienceYears: undefined }));
      return true;
    }
    const years = parseInt(value);
    if (isNaN(years)) {
      setErrors(prev => ({ ...prev, experienceYears: "Experience must be a number" }));
      return false;
    }
    if (years < 1) {
      setErrors(prev => ({ ...prev, experienceYears: "Experience must be at least 1 year" }));
      return false;
    }
    if (years > 100) {
      setErrors(prev => ({ ...prev, experienceYears: "Experience cannot exceed 100 years" }));
      return false;
    }
    setErrors(prev => ({ ...prev, experienceYears: undefined }));
    return true;
  };

  const validateDisplayOrder = (value: string): boolean => {
    if (!value) {
      setErrors(prev => ({ ...prev, displayOrder: undefined }));
      return true;
    }
    const order = parseInt(value);
    if (isNaN(order)) {
      setErrors(prev => ({ ...prev, displayOrder: "Display order must be a number" }));
      return false;
    }
    if (order < 1) {
      setErrors(prev => ({ ...prev, displayOrder: "Display order must be at least 1" }));
      return false;
    }
    setErrors(prev => ({ ...prev, displayOrder: undefined }));
    return true;
  };

  const validateProfileImage = (): boolean => {
    if (!profileImageUrl) {
      setErrors(prev => ({ ...prev, profileImage: "Profile image is required" }));
      return false;
    }
    setErrors(prev => ({ ...prev, profileImage: undefined }));
    return true;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  const validateForm = (): boolean => {
    setTouched({
      name: true,
      title: true,
      email: true,
      phone: true,
      experienceYears: true,
      displayOrder: true,
      profileImage: true,
    });

    const isNameValid = validateName(name);
    const isTitleValid = validateTitle(title);
    const isEmailValid = validateEmail(email);
    const isPhoneValid = validatePhone(phone);
    const isExperienceValid = validateExperienceYears(experienceYears);
    const isDisplayOrderValid = validateDisplayOrder(displayOrder);
    const isImageValid = validateProfileImage();

    return isNameValid && isTitleValid && isEmailValid && isPhoneValid &&
           isExperienceValid && isDisplayOrderValid && isImageValid;
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB max for profile images)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Profile image must be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, WebP)",
        variant: "destructive",
      });
      return;
    }

    try {
      setUploading(true);
      setUploadProgress(0);

      // Generate unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      // Show progress
      setUploadProgress(50);

      // Delete old image if exists and in edit mode
      if (profileImageUrl && isEditMode) {
        const oldFileName = profileImageUrl.split("/").pop();
        if (oldFileName && !profileImageUrl.includes('unsplash.com')) {
          await supabase.storage
            .from("security-team-images")
            .remove([oldFileName]);
        }
      }

      // Upload new image
      const { error: uploadError } = await supabase.storage
        .from("security-team-images")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setUploadProgress(80);

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("security-team-images")
        .getPublicUrl(fileName);

      setProfileImageUrl(publicUrl);
      setImagePreview(publicUrl);
      setUploadProgress(100);

      // Mark as touched and validate
      setTouched(prev => ({ ...prev, profileImage: true }));
      validateProfileImage();

      toast({
        title: "Success",
        description: "Image uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      setTimeout(() => setUploadProgress(0), 1000);
    }
  };

  const handleRemoveImage = async () => {
    if (!profileImageUrl) return;

    try {
      // Only delete from storage if it's not an external URL (like unsplash)
      if (!profileImageUrl.includes('unsplash.com')) {
        const fileName = profileImageUrl.split("/").pop();
        if (fileName) {
          await supabase.storage
            .from("security-team-images")
            .remove([fileName]);
        }
      }

      setProfileImageUrl(null);
      setImagePreview(null);

      // Mark as touched and validate
      setTouched(prev => ({ ...prev, profileImage: true }));
      validateProfileImage();

      toast({
        title: "Success",
        description: "Image removed",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const addSpecialization = () => {
    const trimmedValue = newSpecialization.trim();
    if (trimmedValue) {
      // Check if specialization already exists (case-insensitive)
      const exists = specializations.some(
        spec => spec.toLowerCase() === trimmedValue.toLowerCase()
      );

      if (exists) {
        toast({
          title: "Duplicate specialization",
          description: "This specialization has already been added.",
          variant: "destructive",
        });
        return;
      }

      setSpecializations([...specializations, trimmedValue]);
      setNewSpecialization("");
    }
  };

  const removeSpecialization = (index: number) => {
    setSpecializations(specializations.filter((_, i) => i !== index));
  };

  const addCertification = () => {
    const trimmedValue = newCertification.trim();
    if (trimmedValue) {
      // Check if certification already exists (case-insensitive)
      const exists = certifications.some(
        cert => cert.toLowerCase() === trimmedValue.toLowerCase()
      );

      if (exists) {
        toast({
          title: "Duplicate certification",
          description: "This certification has already been added.",
          variant: "destructive",
        });
        return;
      }

      setCertifications([...certifications, trimmedValue]);
      setNewCertification("");
    }
  };

  const removeCertification = (index: number) => {
    setCertifications(certifications.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please fix all validation errors before saving",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    try {
      const memberData = {
        name: name.trim(),
        title: title.trim(),
        bio: bio.trim() || null,
        phone: phone.trim() || null,
        email: email.trim() || null,
        experience_years: experienceYears ? parseInt(experienceYears) : null,
        display_order: displayOrder ? parseInt(displayOrder) : 1,
        is_featured: isFeatured,
        is_active: isActive,
        specializations: specializations.length > 0 ? specializations : null,
        certifications: certifications.length > 0 ? certifications : null,
        profile_image_url: profileImageUrl,
      };

      if (isEditMode) {
        const { error } = await supabase
          .from("security_team")
          .update(memberData)
          .eq("id", id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Team member updated successfully",
        });
      } else {
        const { error } = await supabase
          .from("security_team")
          .insert([memberData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Team member added successfully",
        });
      }

      navigate("/admin/security-team");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const ErrorMessage = ({ error }: { error?: string }) => {
    if (!error) return null;
    return (
      <div className="flex items-center gap-1 text-destructive text-sm mt-1">
        <AlertCircle className="h-3 w-3" />
        <span>{error}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton className="h-12 w-64" />
        <Card className="p-6 space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/admin/security-team")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-display font-bold text-gradient-metal">
              {isEditMode ? "Edit Team Member" : "Add Team Member"}
            </h1>
            <p className="text-muted-foreground">
              {isEditMode ? "Update security personnel details" : "Add new security personnel to your team"}
            </p>
          </div>
        </div>
        <Button
          onClick={handleSave}
          disabled={saving}
          className="shadow-glow hover:shadow-[0_0_40px_rgba(255,215,0,0.4)] transition-all"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Member
            </>
          )}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <Card className="lg:col-span-2 p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Basic Information</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">
                  Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onBlur={() => handleBlur('name')}
                  placeholder="John Smith"
                  className={errors.name ? "border-destructive" : ""}
                />
                <ErrorMessage error={errors.name} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={() => handleBlur('title')}
                  placeholder="Head of Close Protection"
                  className={errors.title ? "border-destructive" : ""}
                />
                <ErrorMessage error={errors.title} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Professional background and experience..."
                rows={5}
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold">Contact Information</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => handleBlur('email')}
                  placeholder="john@example.com"
                  className={errors.email ? "border-destructive" : ""}
                />
                <ErrorMessage error={errors.email} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  placeholder="+44 7700 900000"
                  className={errors.phone ? "border-destructive" : ""}
                />
                <ErrorMessage error={errors.phone} />
              </div>
            </div>
          </div>

          {/* Experience */}
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold">Experience</h2>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="experience">Years of Experience</Label>
                <Input
                  id="experience"
                  type="number"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  onBlur={() => handleBlur('experienceYears')}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  placeholder="15"
                  min="1"
                  max="100"
                  className={errors.experienceYears ? "border-destructive" : ""}
                />
                <ErrorMessage error={errors.experienceYears} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(e.target.value)}
                  onBlur={() => handleBlur('displayOrder')}
                  onKeyDown={(e) => {
                    if (e.key === '-' || e.key === '+' || e.key === 'e' || e.key === 'E') {
                      e.preventDefault();
                    }
                  }}
                  placeholder="1"
                  min="1"
                  className={errors.displayOrder ? "border-destructive" : ""}
                />
                <ErrorMessage error={errors.displayOrder} />
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold">Specializations</h2>

            <div className="flex gap-2">
              <Input
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialization())}
                placeholder="e.g., Close Protection, VIP Security"
              />
              <Button type="button" onClick={addSpecialization}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {specializations.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {specializations.map((spec, index) => (
                  <Badge key={index} variant="secondary" className="gap-2">
                    {spec}
                    <button
                      onClick={() => removeSpecialization(index)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Certifications */}
          <div className="space-y-4 border-t pt-6">
            <h2 className="text-xl font-semibold">Certifications</h2>

            <div className="flex gap-2">
              <Input
                value={newCertification}
                onChange={(e) => setNewCertification(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addCertification())}
                placeholder="e.g., SIA License, Counter-Terrorism"
              />
              <Button type="button" onClick={addCertification}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {certifications.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {certifications.map((cert, index) => (
                  <Badge key={index} variant="outline" className="gap-2">
                    {cert}
                    <button
                      onClick={() => removeCertification(index)}
                      className="hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Profile Image */}
          <Card className={`p-6 space-y-4 ${errors.profileImage ? 'border-destructive' : ''}`}>
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Profile Image</h2>
              <span className="text-destructive text-sm">*</span>
            </div>

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Profile preview"
                  className="w-full aspect-square object-cover rounded-lg ring-2 ring-accent/20"
                />
                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={handleRemoveImage}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a profile image
                </p>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="image-upload" className="cursor-pointer">
                <div className="flex items-center justify-center gap-2 p-3 border rounded-md hover:bg-accent/5 transition-colors">
                  <Upload className="h-4 w-4" />
                  <span>{imagePreview ? "Change Image" : "Upload Image"}</span>
                </div>
              </Label>
              <Input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
                disabled={uploading}
              />
              {uploading && (
                <Progress value={uploadProgress} className="h-2" />
              )}
              <p className="text-xs text-muted-foreground">
                Max file size: 5MB. Supports: JPG, PNG, WebP
              </p>
              <ErrorMessage error={errors.profileImage} />
            </div>
          </Card>

          {/* Settings */}
          <Card className="p-6 space-y-4">
            <h2 className="text-xl font-semibold">Settings</h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="active">Active</Label>
                  <p className="text-sm text-muted-foreground">
                    Show on public website
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={isActive}
                  onCheckedChange={setIsActive}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="featured">Featured</Label>
                  <p className="text-sm text-muted-foreground">
                    Highlight on team page
                  </p>
                </div>
                <Switch
                  id="featured"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
