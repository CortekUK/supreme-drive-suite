import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Car, Users, Briefcase, PoundSterling, Moon } from "lucide-react";

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
}

const VehiclesManagement = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
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
    const { data, error } = await supabase
      .from("vehicles")
      .select("*")
      .order("name");

    if (error) {
      toast.error("Failed to load vehicles");
    } else {
      setVehicles(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingVehicle) {
      const { error } = await supabase
        .from("vehicles")
        .update(formData)
        .eq("id", editingVehicle.id);

      if (error) {
        toast.error("Failed to update vehicle");
        return;
      }
      toast.success("Vehicle updated");
    } else {
      const { error } = await supabase.from("vehicles").insert(formData);

      if (error) {
        toast.error("Failed to create vehicle");
        return;
      }
      toast.success("Vehicle created");
    }

    setDialogOpen(false);
    resetForm();
    loadVehicles();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this vehicle?")) return;

    const { error } = await supabase.from("vehicles").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete vehicle");
      return;
    }

    toast.success("Vehicle deleted");
    loadVehicles();
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
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingVehicle(null);
    setFormData({
      name: "",
      category: "",
      description: "",
      capacity: 4,
      luggage_capacity: 3,
      base_price_per_mile: 2.5,
      overnight_surcharge: 150,
      is_active: true,
    });
  };

  if (loading) {
    return <div className="p-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-display font-bold text-gradient-metal">Vehicles Management</h1>
        
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-accent shadow-glow" onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingVehicle ? "Edit Vehicle" : "Add New Vehicle"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Vehicle Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="capacity">Passenger Capacity</Label>
                  <Input
                    id="capacity"
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                    min="1"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="luggage">Luggage Capacity</Label>
                  <Input
                    id="luggage"
                    type="number"
                    value={formData.luggage_capacity}
                    onChange={(e) => setFormData({ ...formData, luggage_capacity: parseInt(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Base Price per Mile (£)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.1"
                    value={formData.base_price_per_mile}
                    onChange={(e) => setFormData({ ...formData, base_price_per_mile: parseFloat(e.target.value) })}
                    min="0"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="overnight">Overnight Surcharge (£)</Label>
                  <Input
                    id="overnight"
                    type="number"
                    value={formData.overnight_surcharge}
                    onChange={(e) => setFormData({ ...formData, overnight_surcharge: parseInt(e.target.value) })}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label htmlFor="active">Active</Label>
              </div>

              <div className="flex gap-3">
                <Button type="submit" className="gradient-accent shadow-glow">
                  {editingVehicle ? "Update Vehicle" : "Create Vehicle"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {vehicles.map((vehicle) => (
          <Card 
            key={vehicle.id} 
            className="relative overflow-hidden min-h-[420px] flex flex-col transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-2 hover:border-amber-600/50"
          >
            {/* Status Badge - Top Right */}
            <Badge 
              variant={vehicle.is_active ? "default" : "secondary"}
              className={`absolute top-4 right-4 z-10 rounded-full px-3 py-1 text-xs ${
                vehicle.is_active 
                  ? "bg-green-500/20 text-green-600 border border-green-500/30" 
                  : "bg-gray-500/20 text-gray-600 border border-gray-500/30"
              }`}
            >
              {vehicle.is_active ? "Active" : "Inactive"}
            </Badge>

            {/* Vehicle Thumbnail Banner */}
            <div className="h-48 w-full bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center">
              <Car className="h-20 w-20 text-muted-foreground/30" />
            </div>

            {/* Card Content */}
            <CardContent className="p-8 flex-1 flex flex-col space-y-4">
              {/* Vehicle Name & Category */}
              <div className="space-y-1">
                <h3 className="text-2xl font-bold font-display">{vehicle.name}</h3>
                <p className="text-sm text-amber-600 font-medium">{vehicle.category}</p>
                {/* Gold Divider */}
                <div className="h-px w-20 bg-gradient-to-r from-amber-600 to-transparent mt-2"></div>
              </div>

              {/* Description */}
              {vehicle.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">{vehicle.description}</p>
              )}

              {/* Details Grid */}
              <div className="grid grid-cols-2 gap-3 flex-1">
                <div className="p-3 rounded-md bg-muted/50 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Users className="h-3 w-3" />
                    <span>Capacity</span>
                  </div>
                  <p className="font-medium">{vehicle.capacity} passengers</p>
                </div>

                <div className="p-3 rounded-md bg-muted/50 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Briefcase className="h-3 w-3" />
                    <span>Luggage</span>
                  </div>
                  <p className="font-medium">{vehicle.luggage_capacity} items</p>
                </div>

                <div className="p-3 rounded-md bg-muted/50 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <PoundSterling className="h-3 w-3" />
                    <span>Price/Mile</span>
                  </div>
                  <p className="font-medium">£{vehicle.base_price_per_mile}</p>
                </div>

                <div className="p-3 rounded-md bg-muted/50 space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Moon className="h-3 w-3" />
                    <span>Overnight</span>
                  </div>
                  <p className="font-medium">
                    {vehicle.overnight_surcharge > 0 ? `£${vehicle.overnight_surcharge}` : "N/A"}
                  </p>
                </div>
              </div>

              {/* Action Bar Footer */}
              <div className="flex justify-end items-center gap-2 pt-4 border-t mt-auto">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(vehicle)}
                      className="hover:border-amber-600/50 hover:text-amber-600"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Edit Vehicle</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(vehicle.id)}
                      className="hover:border-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Remove Vehicle</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VehiclesManagement;
