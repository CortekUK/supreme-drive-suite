import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Eye, CheckCircle, XCircle, MessageSquare, Star } from "lucide-react";

interface FeedbackSubmission {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  service_type: string | null;
  booking_reference: string | null;
  rating: number;
  feedback_message: string;
  would_recommend: boolean;
  status: string;
  created_at: string;
  admin_notes: string | null;
  converted_to_testimonial_id: string | null;
}

export default function FeedbackManagement() {
  const { toast } = useToast();
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState<FeedbackSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackSubmission | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [convertDialogOpen, setConvertDialogOpen] = useState(false);
  const [testimonialTitle, setTestimonialTitle] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    loadFeedbacks();
  }, []);

  useEffect(() => {
    filterFeedbacks();
  }, [feedbacks, statusFilter, ratingFilter, searchTerm]);

  const loadFeedbacks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("feedback_submissions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load feedback submissions",
        variant: "destructive",
      });
    } else {
      setFeedbacks(data || []);
    }
    setLoading(false);
  };

  const filterFeedbacks = () => {
    let filtered = [...feedbacks];

    if (statusFilter !== "all") {
      filtered = filtered.filter((f) => f.status === statusFilter);
    }

    if (ratingFilter !== "all") {
      filtered = filtered.filter((f) => f.rating === parseInt(ratingFilter));
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (f) =>
          f.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          f.feedback_message.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFeedbacks(filtered);
  };

  const updateStatus = async (id: string, status: string, notes?: string) => {
    const { error } = await supabase
      .from("feedback_submissions")
      .update({ status, admin_notes: notes || null })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to update status",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: `Feedback ${status}`,
      });
      loadFeedbacks();
    }
  };

  const convertToTestimonial = async () => {
    if (!selectedFeedback) return;

    const { data: testimonial, error } = await supabase
      .from("testimonials")
      .insert({
        customer_name: selectedFeedback.customer_name,
        customer_title: testimonialTitle || null,
        content: selectedFeedback.feedback_message,
        rating: selectedFeedback.rating,
        is_active: false,
        is_featured: false,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: "Error",
        description: "Failed to convert to testimonial",
        variant: "destructive",
      });
      return;
    }

    await supabase
      .from("feedback_submissions")
      .update({
        status: "converted",
        converted_to_testimonial_id: testimonial.id,
      })
      .eq("id", selectedFeedback.id);

    toast({
      title: "Success",
      description: "Converted to testimonial (inactive). Review in Testimonials Management.",
    });

    setConvertDialogOpen(false);
    setTestimonialTitle("");
    loadFeedbacks();
  };

  const stats = {
    total: feedbacks.length,
    pending: feedbacks.filter((f) => f.status === "pending").length,
    avgRating: feedbacks.length
      ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
      : "0",
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "default",
      approved: "secondary",
      rejected: "destructive",
      converted: "outline",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Feedback Management</h1>
        <p className="text-muted-foreground">Review and manage customer feedback submissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold flex items-center gap-2">
              {stats.avgRating}
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Feedback Submissions</CardTitle>
          <CardDescription>Filter and manage customer feedback</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <Input
              placeholder="Search by name, email, or message..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="md:max-w-xs"
            />

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="md:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="md:w-40">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="5">5 Stars</SelectItem>
                <SelectItem value="4">4 Stars</SelectItem>
                <SelectItem value="3">3 Stars</SelectItem>
                <SelectItem value="2">2 Stars</SelectItem>
                <SelectItem value="1">1 Star</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {loading ? (
            <p>Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Rating</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredFeedbacks.map((feedback) => (
                    <TableRow key={feedback.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{feedback.customer_name}</p>
                          <p className="text-sm text-muted-foreground">{feedback.customer_email}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {feedback.rating}
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        </div>
                      </TableCell>
                      <TableCell>{feedback.service_type || "N/A"}</TableCell>
                      <TableCell>{getStatusBadge(feedback.status)}</TableCell>
                      <TableCell>{new Date(feedback.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedFeedback(feedback);
                              setViewDialogOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          {feedback.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updateStatus(feedback.id, "approved")}
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedFeedback(feedback);
                                  setConvertDialogOpen(true);
                                }}
                              >
                                <MessageSquare className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  const notes = prompt("Rejection reason (optional):");
                                  updateStatus(feedback.id, "rejected", notes || undefined);
                                }}
                              >
                                <XCircle className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Feedback Details</DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div>
                <Label>Customer Name</Label>
                <p>{selectedFeedback.customer_name}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p>{selectedFeedback.customer_email}</p>
              </div>
              {selectedFeedback.customer_phone && (
                <div>
                  <Label>Phone</Label>
                  <p>{selectedFeedback.customer_phone}</p>
                </div>
              )}
              <div>
                <Label>Rating</Label>
                <div className="flex gap-1">
                  {Array.from({ length: selectedFeedback.rating }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
              <div>
                <Label>Feedback Message</Label>
                <p className="whitespace-pre-wrap">{selectedFeedback.feedback_message}</p>
              </div>
              <div>
                <Label>Would Recommend</Label>
                <p>{selectedFeedback.would_recommend ? "Yes" : "No"}</p>
              </div>
              {selectedFeedback.admin_notes && (
                <div>
                  <Label>Admin Notes</Label>
                  <p>{selectedFeedback.admin_notes}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={convertDialogOpen} onOpenChange={setConvertDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Convert to Testimonial</DialogTitle>
            <DialogDescription>
              This will create an inactive testimonial that you can review and activate later.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="testimonial_title">Customer Title (Optional)</Label>
              <Input
                id="testimonial_title"
                placeholder="e.g., CEO, Business Owner"
                value={testimonialTitle}
                onChange={(e) => setTestimonialTitle(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="outline" onClick={() => setConvertDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={convertToTestimonial}>Convert</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
