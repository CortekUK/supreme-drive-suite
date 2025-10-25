import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import {
  Search,
  Download,
  CalendarIcon,
  ChevronUp,
  ChevronDown,
  FileDown,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface JobData {
  id: string;
  pickup_date: string;
  customer_name: string;
  service_type: string | null;
  driver_id: string | null;
  vehicle_id: string | null;
  total_price: number | null;
  distance_miles: number | null;
  status: string | null;
  pickup_location: string | null;
  dropoff_location: string | null;
  vehicles?: { name: string } | null;
  drivers?: { name: string } | null;
}

type SortField = "pickup_date" | "customer_name" | "total_price" | "distance_miles";
type SortOrder = "asc" | "desc";

export const ReportsDataTable = () => {
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [serviceFilter, setServiceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dateFrom, setDateFrom] = useState<Date | undefined>(undefined);
  const [dateTo, setDateTo] = useState<Date | undefined>(undefined);
  const [sortField, setSortField] = useState<SortField>("pickup_date");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          pickup_date,
          customer_name,
          service_type,
          driver_id,
          vehicle_id,
          total_price,
          distance_miles,
          status,
          pickup_location,
          dropoff_location,
          vehicles:vehicle_id(name),
          drivers:driver_id(name)
        `)
        .order("pickup_date", { ascending: false })
        .limit(500);

      if (error) throw error;
      setJobs((data || []) as JobData[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load job data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedJobs = useMemo(() => {
    let filtered = [...jobs];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(
        (job) =>
          job.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.pickup_location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          job.dropoff_location?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Service type filter
    if (serviceFilter !== "all") {
      filtered = filtered.filter((job) => job.service_type === serviceFilter);
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((job) => job.status === statusFilter);
    }

    // Date range filter
    if (dateFrom) {
      filtered = filtered.filter(
        (job) => new Date(job.pickup_date) >= dateFrom
      );
    }
    if (dateTo) {
      filtered = filtered.filter(
        (job) => new Date(job.pickup_date) <= dateTo
      );
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (sortField === "pickup_date") {
        aVal = new Date(aVal as string).getTime();
        bVal = new Date(bVal as string).getTime();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [jobs, searchQuery, serviceFilter, statusFilter, dateFrom, dateTo, sortField, sortOrder]);

  const paginatedJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedJobs.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedJobs, currentPage]);

  const totalPages = Math.ceil(filteredAndSortedJobs.length / itemsPerPage);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  const exportToCSV = () => {
    const headers = ["Date", "Job ID", "Customer", "Service", "Driver", "Vehicle", "Revenue", "Distance", "Status"];
    const rows = filteredAndSortedJobs.map((job) => [
      format(new Date(job.pickup_date), "dd MMM yyyy"),
      job.id,
      job.customer_name || "—",
      job.service_type || "—",
      job.drivers?.name || "—",
      job.vehicles?.name || "—",
      `£${job.total_price || 0}`,
      job.distance_miles ? `${job.distance_miles} mi` : "—",
      job.status || "—",
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map((cell) => `"${cell}"`).join(","))
      .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `jobs-report-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Success",
      description: "Report exported successfully",
    });
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-display font-bold text-gradient-metal">
            Detailed Reports
          </h2>
          <p className="text-muted-foreground mt-1">
            Review and export operational data across all services
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="shadow-glow">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={exportToCSV}>
              <FileDown className="w-4 h-4 mr-2" />
              Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <FileDown className="w-4 h-4 mr-2" />
              Export as PDF (Coming Soon)
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <FileDown className="w-4 h-4 mr-2" />
              Export as Excel (Coming Soon)
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Filters Bar */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 p-6 rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm">
        {/* Date From */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !dateFrom && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateFrom ? format(dateFrom, "PPP") : "Date From"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateFrom}
              onSelect={setDateFrom}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        {/* Date To */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal",
                !dateTo && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dateTo ? format(dateTo, "PPP") : "Date To"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={dateTo}
              onSelect={setDateTo}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
          </PopoverContent>
        </Popover>

        {/* Service Type */}
        <Select value={serviceFilter} onValueChange={setServiceFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Service Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Services</SelectItem>
            <SelectItem value="chauffeur">Chauffeur</SelectItem>
            <SelectItem value="close_protection">Close Protection</SelectItem>
            <SelectItem value="Airport transfer">Airport Transfer</SelectItem>
            <SelectItem value="Corporate travel">Corporate Travel</SelectItem>
          </SelectContent>
        </Select>

        {/* Status */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>

        {/* Search */}
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by job ID, customer, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="rounded-lg border border-border/50 bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead
                  className="cursor-pointer hover:bg-accent/5 transition-colors"
                  onClick={() => handleSort("pickup_date")}
                >
                  <div className="flex items-center">
                    Date <SortIcon field="pickup_date" />
                  </div>
                </TableHead>
                <TableHead>Job ID</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-accent/5 transition-colors"
                  onClick={() => handleSort("customer_name")}
                >
                  <div className="flex items-center">
                    Customer <SortIcon field="customer_name" />
                  </div>
                </TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-accent/5 transition-colors text-right"
                  onClick={() => handleSort("total_price")}
                >
                  <div className="flex items-center justify-end">
                    Revenue <SortIcon field="total_price" />
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer hover:bg-accent/5 transition-colors text-right"
                  onClick={() => handleSort("distance_miles")}
                >
                  <div className="flex items-center justify-end">
                    Distance <SortIcon field="distance_miles" />
                  </div>
                </TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <>
                  {[...Array(10)].map((_, i) => (
                    <TableRow key={i}>
                      {[...Array(9)].map((_, j) => (
                        <TableCell key={j}>
                          <Skeleton className="h-5 w-full" />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </>
              ) : paginatedJobs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    <p className="text-muted-foreground">No jobs found matching your filters.</p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedJobs.map((job) => (
                  <TableRow
                    key={job.id}
                    className="hover:bg-accent/5 transition-colors"
                  >
                    <TableCell className="font-medium">
                      {format(new Date(job.pickup_date), "dd MMM yyyy")}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      #{job.id.slice(0, 8)}
                    </TableCell>
                    <TableCell>{job.customer_name || "—"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="font-normal">
                        {job.service_type
                          ? job.service_type.charAt(0).toUpperCase() + job.service_type.slice(1).replace(/_/g, ' ')
                          : "—"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {job.drivers?.name || "—"}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {job.vehicles?.name || "—"}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      £{job.total_price || 0}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {job.distance_miles ? `${job.distance_miles} mi` : "—"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          job.status === "completed"
                            ? "default"
                            : job.status === "confirmed"
                            ? "secondary"
                            : "outline"
                        }
                        className={
                          job.status === "completed"
                            ? "bg-green-500/10 text-green-500 border-green-500/20"
                            : ""
                        }
                      >
                        {job.status
                          ? job.status.charAt(0).toUpperCase() + job.status.slice(1).replace(/_/g, ' ')
                          : "New"}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {!loading && filteredAndSortedJobs.length > 0 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-border/50">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredAndSortedJobs.length)} of{" "}
              {filteredAndSortedJobs.length} entries
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {[...Array(totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={i}
                        variant={currentPage === pageNumber ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNumber)}
                        className={
                          currentPage === pageNumber
                            ? "bg-accent text-accent-foreground"
                            : ""
                        }
                      >
                        {pageNumber}
                      </Button>
                    );
                  } else if (
                    pageNumber === currentPage - 2 ||
                    pageNumber === currentPage + 2
                  ) {
                    return <span key={i}>...</span>;
                  }
                  return null;
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
