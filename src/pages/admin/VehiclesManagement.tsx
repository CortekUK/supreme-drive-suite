import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Car, Users, Briefcase, PoundSterling, Moon, Upload, X, Loader2, RefreshCcw, ImagePlus, GripVertical, Star } from "lucide-react";

interface Vehicle {
  id: string;
  name: string;
  category: string;
  description: string;
  capacity: number;
  luggage_capacity: number;
  base_price_per_mile: number;
  overnight_surcharge: number;
  is_active: boolean;
  image_url: string | null;
}

interface VehicleImage {
  id: string;
  vehicle_id: string;
  image_url: string;
  display_order: number;
  is_cover: boolean;
}

interface PendingImage {
  file: File;
  preview: string;
  is_cover: boolean;
}

const VehiclesManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [vehicleImages, setVehicleImages] = useState<Record<string, VehicleImage[]>>({});
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [vehicleToDelete, setVehicleToDelete] = useState<Vehicle | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [uploading, setUploading] = useState(false);
  // Multi-image state
  const [pendingImages, setPendingImages] = useState<PendingImage[]>([]);
  const [existingImages, setExistingImages] = useState<VehicleImage[]>([]);
  const [imagesToDelete, setImagesToDelete] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    capacity: 4,
    luggage_capacity: 3,
    base_price_per_mile: 2.5,
    overnight_surcharge: 150,
    is_active: true,
  });

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    setLoading(true);
    const [vehiclesRes, imagesRes] = await Promise.all([
      supabase.from("vehicles").select("*").order("name"),
      supabase.from("vehicle_images").select("*").order("display_order"),
    ]);

    if (vehiclesRes.error) {
      toast.error("Failed to load vehicles");
    } else {
      setVehicles(vehiclesRes.data || []);
      setLastUpdated(new Date());
    }

    if (!imagesRes.error && imagesRes.data) {
      const grouped: Record<string, VehicleImage[]> = {};
      imagesRes.data.forEach((img: VehicleImage) => {
        if (!grouped[img.vehicle_id]) grouped[img.vehicle_id] = [];
        grouped[img.vehicle_id].push(img);
      });
      setVehicleImages(grouped);
    }
    setLoading(false);
  };

  const uploadImageFile = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    const { error, data } = await supabase.storage
      .from('vehicle-images')
      .upload(fileName, file, { cacheControl: '3600', upsert: false });
    if (error) { toast.error('Failed to upload image'); return null; }
    const { data: { publicUrl } } = supabase.storage.from('vehicle-images').getPublicUrl(fileName);
    return publicUrl;
  };

  const deleteStorageImage = async (imageUrl: string) => {
    const path = imageUrl.split('/vehicle-images/')[1];
    if (path) await supabase.storage.from('vehicle-images').remove([path]);
  };

  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const valid = files.filter(f => {
      if (f.size > 5 * 1024 * 1024) { toast.error(`${f.name} must be under 5MB`); return false; }
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(f.type)) { toast.error(`${f.name}: only JPG/PNG/WEBP`); return false; }
      return true;
    });
    const newPending: PendingImage[] = valid.map((file, i) => ({
      file,
      preview: URL.createObjectURL(file),
      is_cover: pendingImages.length === 0 && existingImages.length === 0 && i === 0,
    }));
    setPendingImages(prev => [...prev, ...newPending]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePendingImage = (idx: number) => {
    setPendingImages(prev => {
      const updated = prev.filter((_, i) => i !== idx);
      // If removed was cover and there are remaining images, set first as cover
      if (prev[idx].is_cover && updated.length > 0) updated[0].is_cover = true;
      return updated;
    });
  };

  const removeExistingImage = (img: VehicleImage) => {
    setImagesToDelete(prev => [...prev, img.id]);
    setExistingImages(prev => {
      const updated = prev.filter(i => i.id !== img.id);
      if (img.is_cover && updated.length > 0) updated[0].is_cover = true;
      return updated;
    });
  };

  const setCoverPending = (idx: number) => {
    setPendingImages(prev => prev.map((img, i) => ({ ...img, is_cover: i === idx })));
    setExistingImages(prev => prev.map(img => ({ ...img, is_cover: false })));
  };

  const setCoverExisting = (imgId: string) => {
    setExistingImages(prev => prev.map(img => ({ ...img, is_cover: img.id === imgId })));
    setPendingImages(prev => prev.map(img => ({ ...img, is_cover: false })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    try {
      let vehicleId = editingVehicle?.id;

      // Determine cover image URL for legacy image_url field
      let coverUrl: string | null = editingVehicle?.image_url || null;

      if (editingVehicle) {
        const { error } = await supabase.from("vehicles").update(formData).eq("id", editingVehicle.id);
        if (error) { toast.error("Failed to update vehicle"); setUploading(false); return; }
      } else {
        const { data, error } = await supabase.from("vehicles").insert({ ...formData, image_url: null }).select().single();
        if (error) { toast.error("Failed to create vehicle"); setUploading(false); return; }
        vehicleId = data.id;
      }

      // Delete removed existing images
      for (const imgId of imagesToDelete) {
        const img = (vehicleImages[vehicleId!] || []).find(i => i.id === imgId);
        if (img) await deleteStorageImage(img.image_url);
        await supabase.from("vehicle_images").delete().eq("id", imgId);
      }

      // Upload new pending images
      const baseOrder = existingImages.length;
      for (let i = 0; i < pendingImages.length; i++) {
        const p = pendingImages[i];
        const url = await uploadImageFile(p.file);
        if (!url) continue;
        await supabase.from("vehicle_images").insert({
          vehicle_id: vehicleId,
          image_url: url,
          display_order: baseOrder + i,
          is_cover: p.is_cover,
        });
        if (p.is_cover) coverUrl = url;
      }

      // Update cover status on existing images
      for (const img of existingImages) {
        await supabase.from("vehicle_images").update({ is_cover: img.is_cover }).eq("id", img.id);
        if (img.is_cover) coverUrl = img.image_url;
      }

      // Update legacy image_url with cover
      const allImagesRes = await supabase.from("vehicle_images").select("*").eq("vehicle_id", vehicleId!).order("display_order");
      if (allImagesRes.data && allImagesRes.data.length > 0) {
        const cover = allImagesRes.data.find((i: VehicleImage) => i.is_cover) || allImagesRes.data[0];
        await supabase.from("vehicles").update({ image_url: cover.image_url }).eq("id", vehicleId!);
      }

      toast.success(editingVehicle ? "Vehicle updated successfully" : "Vehicle created successfully");
      setDialogOpen(false);
      resetForm();
      loadVehicles();
    } catch (error) {
      toast.error("An error occurred");
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteClick = (vehicle: Vehicle) => {
    setVehicleToDelete(vehicle);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!vehicleToDelete) return;
    try {
      // Delete all images from storage
      const imgs = vehicleImages[vehicleToDelete.id] || [];
      for (const img of imgs) await deleteStorageImage(img.image_url);
      // vehicle_images rows cascade delete with the vehicle
      const { error } = await supabase.from("vehicles").delete().eq("id", vehicleToDelete.id);
      if (error) { toast.error("Failed to delete vehicle"); return; }
      toast.success("Vehicle removed successfully");
      loadVehicles();
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setDeleteDialogOpen(false);
      setVehicleToDelete(null);
    }
  };

  const handleEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setFormData({
      name: vehicle.name,
      category: vehicle.category,
      description: vehicle.description,
      capacity: vehicle.capacity,
      luggage_capacity: vehicle.luggage_capacity,
      base_price_per_mile: vehicle.base_price_per_mile,
      overnight_surcharge: vehicle.overnight_surcharge,
      is_active: vehicle.is_active,
    });
    setPendingImages([]);
    setImagesToDelete([]);
    const imgs = vehicleImages[vehicle.id] || [];
    setExistingImages(imgs.length > 0 ? imgs : []);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingVehicle(null);
    setPendingImages([]);
    setExistingImages([]);
    setImagesToDelete([]);
    setFormData({ name: "", category: "", description: "", capacity: 4, luggage_capacity: 3, base_price_per_mile: 2.5, overnight_surcharge: 150, is_active: true });
  };

  const allPreviewImages = [
    ...existingImages.map(img => ({ id: img.id, url: img.image_url, is_cover: img.is_cover, type: 'existing' as const })),
    ...pendingImages.map((img, i) => ({ id: `pending-${i}`, url: img.preview, is_cover: img.is_cover, type: 'pending' as const, idx: i })),
  ];

  if (loading) {
    return (
      <TooltipProvider>
        <div className="space-y-6 animate-fade-in">
          <div className="space-y-2">
            <Skeleton className="h-10 w-96" />
            <Skeleton className="h-4 w-full max-w-2xl" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-8 space-y-4">
                  <Skeleton className="h-8 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6 animate-fade-in">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-display font-bold text-gradient-metal mb-2">Vehicles Management</h1>
            <p className="text-muted-foreground">Maintain and manage your active vehicle fleet for bookings and operations.</p>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button onClick={loadVehicles} variant="outline" className="gap-2">
                  <RefreshCcw className="w-4 h-4" />Refresh
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Reload vehicles data</p></TooltipContent>
            </Tooltip>

            <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DialogTrigger asChild>
                    <Button className="gradient-accent shadow-glow" onClick={resetForm}>
                      <Plus className="w-4 h-4 mr-2" />Add Vehicle
                    </Button>
                  </DialogTrigger>
                </TooltipTrigger>
                <TooltipContent><p>Add new vehicle to fleet</p></TooltipContent>
              </Tooltip>

              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-display">
                    {editingVehicle ? "Edit Vehicle" : "Add Vehicle"}
                  </DialogTitle>
                  <DialogDescription>
                    Complete all required fields to {editingVehicle ? "update" : "add"} vehicle to fleet
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Vehicle Name <span className="text-destructive">*</span></Label>
                      <Input id="name" placeholder="e.g., Rolls-Royce Phantom" value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="category">Category <span className="text-destructive">*</span></Label>
                      <Input id="category" placeholder="e.g., Ultra Luxury, Executive" value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })} required />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea id="description" placeholder="Brief description of vehicle and features" value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} />
                  </div>

                  {/* Multi-Image Upload Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-sm font-medium">Vehicle Images</Label>
                        <p className="text-xs text-muted-foreground mt-0.5">Add multiple photos. Click ★ to set cover image.</p>
                      </div>
                      <Button type="button" variant="outline" size="sm" className="gap-2 border-accent/40 hover:border-accent"
                        onClick={() => fileInputRef.current?.click()}>
                        <ImagePlus className="w-4 h-4" />Add Photos
                      </Button>
                      <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp"
                        multiple onChange={handleFilesSelected} className="hidden" />
                    </div>

                    {allPreviewImages.length > 0 ? (
                      <div className="grid grid-cols-3 gap-3">
                        {allPreviewImages.map((img) => (
                          <div key={img.id} className="relative group aspect-[4/3] rounded-lg overflow-hidden border-2 border-border hover:border-accent/50 transition-colors">
                            <img src={img.url} alt="Vehicle" className="w-full h-full object-cover" />
                            {/* Cover star */}
                            <button
                              type="button"
                              onClick={() => img.type === 'existing' ? setCoverExisting(img.id) : setCoverPending((img as any).idx)}
                              className={`absolute top-1.5 left-1.5 p-1 rounded-full transition-all ${
                                img.is_cover
                                  ? 'bg-accent text-background shadow-glow'
                                  : 'bg-black/50 text-white/70 hover:text-accent hover:bg-black/70'
                              }`}
                              title={img.is_cover ? "Cover image" : "Set as cover"}
                            >
                              <Star className="w-3 h-3" fill={img.is_cover ? "currentColor" : "none"} />
                            </button>
                            {/* Remove button */}
                            <button
                              type="button"
                              onClick={() => img.type === 'existing' ? removeExistingImage(existingImages.find(e => e.id === img.id)!) : removePendingImage((img as any).idx)}
                              className="absolute top-1.5 right-1.5 p-1 bg-black/50 rounded-full text-white/70 hover:text-red-400 hover:bg-black/70 opacity-0 group-hover:opacity-100 transition-all"
                            >
                              <X className="w-3 h-3" />
                            </button>
                            {img.is_cover && (
                              <div className="absolute bottom-0 left-0 right-0 text-center text-xs bg-accent/90 text-background py-0.5 font-medium">
                                Cover
                              </div>
                            )}
                          </div>
                        ))}
                        {/* Add more button */}
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-[4/3] rounded-lg border-2 border-dashed border-border hover:border-accent/50 flex flex-col items-center justify-center gap-1 text-muted-foreground hover:text-accent transition-colors"
                        >
                          <Plus className="w-6 h-6" />
                          <span className="text-xs">Add more</span>
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent/50 transition-colors cursor-pointer"
                      >
                        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          <span className="text-accent hover:underline">Choose files</span> or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground/60 mt-1">JPG, PNG, or WEBP (max 5MB each)</p>
                      </div>
                    )}
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="capacity">Passenger Capacity <span className="text-destructive">*</span></Label>
                      <Input id="capacity" type="number" value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} min="1" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="luggage">Luggage Capacity <span className="text-destructive">*</span></Label>
                      <Input id="luggage" type="number" value={formData.luggage_capacity}
                        onChange={(e) => setFormData({ ...formData, luggage_capacity: parseInt(e.target.value) || 0 })} min="0" required />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Base Price per Mile (£) <span className="text-destructive">*</span></Label>
                      <Input id="price" type="number" step="0.1" value={formData.base_price_per_mile}
                        onChange={(e) => setFormData({ ...formData, base_price_per_mile: parseFloat(e.target.value) || 0 })} min="0" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="overnight">Overnight Surcharge (£) <span className="text-destructive">*</span></Label>
                      <Input id="overnight" type="number" value={formData.overnight_surcharge}
                        onChange={(e) => setFormData({ ...formData, overnight_surcharge: parseInt(e.target.value) || 0 })} min="0" required />
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 pt-2">
                    <Switch id="active" checked={formData.is_active}
                      onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })} />
                    <Label htmlFor="active" className="cursor-pointer">Active Status (visible on website)</Label>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button type="submit" className="gradient-accent shadow-glow" disabled={uploading}>
                      {uploading ? (<><Loader2 className="w-4 h-4 mr-2 animate-spin" />Saving...</>) : (editingVehicle ? "Update Vehicle" : "Create Vehicle")}
                    </Button>
                    <Button type="button" variant="outline" onClick={() => setDialogOpen(false)} disabled={uploading}>Cancel</Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        {/* Empty State */}
        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 px-4">
            <div className="rounded-full bg-muted/50 p-6 mb-6">
              <Car className="w-16 h-16 text-muted-foreground/50" />
            </div>
            <h3 className="text-2xl font-display font-bold mb-2">No vehicles in fleet</h3>
            <p className="text-muted-foreground mb-6 text-center max-w-md">Upload your first vehicle to make it available for booking.</p>
            <Button className="gradient-accent shadow-glow" onClick={() => setDialogOpen(true)}>
              <Plus className="w-4 h-4 mr-2" />Add Vehicle
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {vehicles.map((vehicle, index) => {
              const imgs = vehicleImages[vehicle.id] || [];
              const coverImg = imgs.find(i => i.is_cover) || imgs[0];
              const displayUrl = coverImg?.image_url || vehicle.image_url;
              return (
                <Card
                  key={vehicle.id}
                  className="relative overflow-hidden flex flex-col transition-all duration-300 hover:shadow-[0_0_30px_rgba(244,197,66,0.15)] hover:scale-[1.02] hover:border-accent/40 border-2 animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge
                        variant={vehicle.is_active ? "default" : "secondary"}
                        className={`absolute top-4 right-4 z-10 rounded-full px-3 py-1.5 text-xs font-medium shadow-lg ${vehicle.is_active ? "bg-white text-green-400 border border-green-500/30" : "bg-muted text-muted-foreground border"}`}
                      >
                        {vehicle.is_active ? "🟢 Active" : "🔴 Inactive"}
                      </Badge>
                    </TooltipTrigger>
                  </Tooltip>

                  {/* Image with count badge */}
                  <div className="h-48 w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center overflow-hidden relative">
                    {displayUrl ? (
                      <img src={`${displayUrl}?t=${lastUpdated.getTime()}`} alt={vehicle.name} className="w-full h-full object-cover" loading="lazy" />
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Car className="h-16 w-16 text-muted-foreground/30" />
                        <p className="text-xs text-muted-foreground/50">No image uploaded</p>
                      </div>
                    )}
                    {imgs.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-full">
                        {imgs.length} photos
                      </div>
                    )}
                  </div>

                  <CardContent className="p-8 flex-1 flex flex-col space-y-4">
                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold font-display leading-tight">{vehicle.name}</h3>
                      <p className="text-sm text-accent font-medium">{vehicle.category}</p>
                      <div className="h-px w-16 bg-gradient-to-r from-accent to-transparent" />
                    </div>
                    {vehicle.description && (
                      <p className="text-sm text-muted-foreground/80 line-clamp-2 leading-relaxed">{vehicle.description}</p>
                    )}
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <div className="p-3 rounded-lg bg-muted/50 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Users className="h-3.5 w-3.5" /><span>Capacity</span></div>
                        <p className="font-semibold">{vehicle.capacity} passengers</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Briefcase className="h-3.5 w-3.5" /><span>Luggage</span></div>
                        <p className="font-semibold">{vehicle.luggage_capacity} items</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground"><PoundSterling className="h-3.5 w-3.5" /><span>Price/Mile</span></div>
                        <p className="font-semibold">£{vehicle.base_price_per_mile.toFixed(2)}</p>
                      </div>
                      <div className="p-3 rounded-lg bg-muted/50 space-y-1.5">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground"><Moon className="h-3.5 w-3.5" /><span>Overnight</span></div>
                        <p className="font-semibold">{vehicle.overnight_surcharge > 0 ? `£${vehicle.overnight_surcharge}` : "N/A"}</p>
                      </div>
                    </div>
                    <div className="flex justify-end items-center gap-2 pt-4 border-t mt-auto">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => handleEdit(vehicle)}
                            className="hover:border-accent/50 hover:text-accent transition-all hover:scale-110">
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Edit Vehicle</p></TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon" onClick={() => handleDeleteClick(vehicle)}
                            className="hover:border-destructive hover:text-destructive transition-all hover:scale-110">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent><p>Remove Vehicle</p></TooltipContent>
                      </Tooltip>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-display">Remove Vehicle?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove <span className="font-semibold text-foreground">{vehicleToDelete?.name}</span>?
                This will also remove all images and cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Remove Vehicle
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </TooltipProvider>
  );
};

export default VehiclesManagement;
