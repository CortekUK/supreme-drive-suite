import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Plus, Trash2, Upload, Megaphone, ImageIcon } from "lucide-react";

interface Promotion {
  id: string;
  title: string;
  description: string | null;
  image_url: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

const PromotionsManagement = () => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    loadPromotions();
  }, []);

  const loadPromotions = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("promotions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load promotions");
    } else {
      setPromotions(data || []);
    }
    setLoading(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "application/pdf"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Please upload a JPG, PNG, WebP, GIF, or PDF file");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      toast.error("File must be under 20MB");
      return;
    }

    setSelectedFile(file);
    if (file.type === "application/pdf") {
      setPreviewUrl("pdf");
    } else {
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) {
      toast.error("Please enter a title");
      return;
    }
    if (!selectedFile) {
      toast.error("Please upload a flyer image");
      return;
    }

    setUploading(true);
    try {
      // Upload image to storage
      const ext = selectedFile.name.split(".").pop();
      const fileName = `promotion-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("promotions")
        .upload(fileName, selectedFile);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("promotions")
        .getPublicUrl(fileName);

      const { error: insertError } = await supabase.from("promotions").insert({
        title: form.title.trim(),
        description: form.description.trim() || null,
        image_url: publicUrl,
        is_active: false,
      });

      if (insertError) throw insertError;

      toast.success("Promotion added successfully");
      setForm({ title: "", description: "" });
      setSelectedFile(null);
      setPreviewUrl(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      loadPromotions();
    } catch (err: any) {
      toast.error(err.message || "Failed to add promotion");
    } finally {
      setUploading(false);
    }
  };

  const toggleActive = async (promo: Promotion) => {
    const newState = !promo.is_active;

    // If turning on, first turn off all others
    if (newState) {
      await supabase
        .from("promotions")
        .update({ is_active: false })
        .neq("id", promo.id);
    }

    const { error } = await supabase
      .from("promotions")
      .update({ is_active: newState })
      .eq("id", promo.id);

    if (error) {
      toast.error("Failed to update promotion");
    } else {
      toast.success(newState ? "Promotion is now live on the homepage" : "Promotion turned off");
      loadPromotions();
    }
  };

  const handleDelete = async (id: string) => {
    // Find image path from URL to also remove from storage
    const promo = promotions.find((p) => p.id === id);
    const { error } = await supabase.from("promotions").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete promotion");
      return;
    }

    // Try to delete the storage object (best effort)
    if (promo?.image_url) {
      const parts = promo.image_url.split("/promotions/");
      if (parts[1]) {
        await supabase.storage.from("promotions").remove([parts[1]]);
      }
    }

    toast.success("Promotion deleted");
    setDeleteTarget(null);
    loadPromotions();
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Megaphone className="w-6 h-6 text-accent" />
        </div>
        <div>
          <h1 className="text-2xl font-display font-bold text-gradient-metal">Promotions</h1>
          <p className="text-sm text-muted-foreground">
            Upload event flyers that pop up when visitors arrive on the homepage.
            Only one promotion can be active at a time.
          </p>
        </div>
      </div>

      {/* Add new promotion form */}
      <Card className="p-6 border-accent/20">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Plus className="w-4 h-4 text-accent" /> Add New Promotion
        </h2>
        <form onSubmit={handleAdd} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="promo-title">Title *</Label>
              <Input
                id="promo-title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. MOBO Awards VIP Experience"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="promo-desc">Short Description (optional)</Label>
              <Input
                id="promo-desc"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="e.g. Limited VIP bookings available"
              />
            </div>
          </div>

          {/* File upload */}
          <div className="space-y-2">
            <Label>Flyer Image or PDF * (JPG, PNG, WebP, PDF — max 20MB)</Label>
            <div
              className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-accent/50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {previewUrl === "pdf" ? (
                <div className="flex flex-col items-center gap-2 text-accent">
                  <div className="w-16 h-20 bg-red-500/10 border border-red-500/30 rounded flex items-center justify-center">
                    <span className="text-red-400 font-bold text-sm">PDF</span>
                  </div>
                  <p className="text-sm font-medium">{selectedFile?.name}</p>
                  <p className="text-xs text-muted-foreground">Click to change file</p>
                </div>
              ) : previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 mx-auto rounded object-contain"
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="w-10 h-10 opacity-40" />
                  <p className="text-sm">Click to upload your flyer (image or PDF)</p>
                  <p className="text-xs opacity-60">PNG, JPG, WebP, or PDF</p>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
              className="hidden"
              onChange={handleFileChange}
            />
            {selectedFile && previewUrl !== "pdf" && (
              <p className="text-xs text-muted-foreground">{selectedFile.name}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={uploading}
            className="gradient-accent shadow-glow"
          >
            <Upload className="w-4 h-4 mr-2" />
            {uploading ? "Uploading..." : "Add Promotion"}
          </Button>
        </form>
      </Card>

      {/* Existing promotions */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Promotions</h2>

        {loading ? (
          <div className="text-muted-foreground text-sm">Loading...</div>
        ) : promotions.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p>No promotions yet. Add your first one above.</p>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
            {promotions.map((promo) => (
              <Card key={promo.id} className={`overflow-hidden border transition-all ${promo.is_active ? "border-accent/50 shadow-glow" : "border-border"}`}>
                {/* Image/PDF preview on card */}
                <div className="relative">
                  {promo.image_url.endsWith(".pdf") || promo.image_url.includes(".pdf") ? (
                    <div className="w-full h-36 flex flex-col items-center justify-center bg-muted/30">
                      <div className="w-14 h-18 bg-red-500/10 border border-red-500/30 rounded flex items-center justify-center mb-2">
                        <span className="text-red-400 font-bold text-sm">PDF</span>
                      </div>
                      <span className="text-xs text-muted-foreground">PDF Flyer</span>
                    </div>
                  ) : (
                    <img
                      src={promo.image_url}
                      alt={promo.title}
                      className="w-full object-cover max-h-52"
                      onError={(e) => {
                        e.currentTarget.src = "";
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  )}
                  {promo.is_active && (
                    <Badge className="absolute top-2 left-2 bg-accent text-accent-foreground font-semibold text-xs">
                      ● LIVE
                    </Badge>
                  )}
                </div>

                {/* Details */}
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-sm">{promo.title}</h3>
                    {promo.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{promo.description}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={promo.is_active}
                        onCheckedChange={() => toggleActive(promo)}
                        aria-label={`Toggle ${promo.title}`}
                      />
                      <span className="text-xs text-muted-foreground">
                        {promo.is_active ? "Active — showing on homepage" : "Inactive"}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:bg-destructive/10 h-8 w-8"
                      onClick={() => setDeleteTarget(promo.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Promotion?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete the promotion and its image. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PromotionsManagement;
