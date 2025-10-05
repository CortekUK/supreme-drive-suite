import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { toast } from "sonner";
import { Search, Download, ChevronDown, FileText, Shield } from "lucide-react";
import { format } from "date-fns";

interface AuditLog {
  id: string;
  user_id: string;
  user_email?: string;
  action: string;
  table_name: string;
  record_id: string | null;
  affected_entity_type: string | null;
  affected_entity_id: string | null;
  old_values: any;
  new_values: any;
  created_at: string;
}

const ITEMS_PER_PAGE = 20;
const ENTITY_TYPES = ["All", "faqs", "testimonials", "vehicles", "portfolio", "pricing_extras", "fixed_routes", "bookings"];
const DATE_RANGES = [
  { label: "All time", value: "all" },
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
];

const AuditLogs = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [entityFilter, setEntityFilter] = useState("All");
  const [dateRange, setDateRange] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadAuditLogs();
  }, []);

  const loadAuditLogs = async () => {
    setLoading(true);
    
    const { data, error } = await supabase
      .from("audit_logs")
      .select(`
        *,
        profiles!audit_logs_user_id_fkey(email)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error("Failed to load audit logs");
      console.error(error);
    } else {
      const logsWithEmail = (data || []).map((log: any) => ({
        ...log,
        user_email: log.profiles?.email || "Unknown user"
      }));
      setLogs(logsWithEmail);
    }
    setLoading(false);
  };

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const exportToCSV = () => {
    const headers = ["Timestamp", "User", "Action", "Entity Type", "Entity ID"];
    const csvData = filteredLogs.map(log => [
      format(new Date(log.created_at), "dd MMM yyyy, HH:mm"),
      log.user_email,
      log.action,
      log.affected_entity_type || log.table_name,
      log.affected_entity_id || log.record_id || "N/A"
    ]);

    const csvContent = [
      headers.join(","),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `audit-logs-${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast.success("CSV exported");
  };

  const filteredLogs = useMemo(() => {
    let result = [...logs];

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (log) =>
          log.user_email?.toLowerCase().includes(query) ||
          log.action.toLowerCase().includes(query)
      );
    }

    // Filter by entity type
    if (entityFilter !== "All") {
      result = result.filter(
        (log) => log.table_name === entityFilter || log.affected_entity_type === entityFilter
      );
    }

    // Filter by date range
    if (dateRange !== "all") {
      const daysAgo = parseInt(dateRange);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo);
      result = result.filter((log) => new Date(log.created_at) >= cutoffDate);
    }

    return result;
  }, [logs, searchQuery, entityFilter, dateRange]);

  const paginatedLogs = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLogs.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredLogs, currentPage]);

  const totalPages = Math.ceil(filteredLogs.length / ITEMS_PER_PAGE);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  const getEntityBadgeColor = (entity: string) => {
    const colors: Record<string, string> = {
      faqs: "bg-blue-500/20 text-blue-300 border-blue-500/30",
      testimonials: "bg-purple-500/20 text-purple-300 border-purple-500/30",
      vehicles: "bg-green-500/20 text-green-300 border-green-500/30",
      portfolio: "bg-orange-500/20 text-orange-300 border-orange-500/30",
      pricing_extras: "bg-accent/20 text-accent border-accent/30",
      fixed_routes: "bg-accent/20 text-accent border-accent/30",
      bookings: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    };
    return colors[entity] || "bg-muted text-muted-foreground";
  };

  const formatEntityName = (name: string) => {
    return name
      .split("_")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-display font-bold text-gradient-metal">Audit Logs</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Security audit trail for pricing and configuration changes
          </p>
        </div>

        <Button
          variant="outline"
          className="gradient-accent shadow-glow"
          onClick={exportToCSV}
          disabled={filteredLogs.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="p-4 shadow-metal bg-card/50 backdrop-blur border border-border/50">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2 flex-1 min-w-[250px]">
            <Search className="w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by user or action…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>

          <Select value={entityFilter} onValueChange={setEntityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Entity type" />
            </SelectTrigger>
            <SelectContent>
              {ENTITY_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === "All" ? "All entities" : formatEntityName(type)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Date range" />
            </SelectTrigger>
            <SelectContent>
              {DATE_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Table */}
      {loading ? (
        <Card className="shadow-metal">
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </Card>
      ) : filteredLogs.length === 0 ? (
        <Card className="p-12 text-center shadow-metal">
          <Shield className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
          <h3 className="text-xl font-display font-bold mb-2">No activity recorded yet</h3>
          <p className="text-muted-foreground">
            Admin actions will appear here once activity begins
          </p>
        </Card>
      ) : (
        <>
          <Card className="shadow-metal overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-12"></TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Entity</TableHead>
                  <TableHead className="text-right">Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedLogs.map((log) => {
                  const isExpanded = expandedRows.has(log.id);
                  const entityType = log.affected_entity_type || log.table_name;
                  const entityId = log.affected_entity_id || log.record_id;
                  const hasDetails = log.new_values || log.old_values;

                  return (
                    <Collapsible key={log.id} open={isExpanded} onOpenChange={() => toggleRow(log.id)} asChild>
                      <>
                        <TableRow className="border-border/50 hover:bg-muted/30 transition-colors">
                          <TableCell>
                            {hasDetails && (
                              <CollapsibleTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0"
                                  aria-label="Toggle details"
                                >
                                  <ChevronDown
                                    className={`w-4 h-4 transition-transform ${
                                      isExpanded ? "rotate-180" : ""
                                    }`}
                                  />
                                </Button>
                              </CollapsibleTrigger>
                            )}
                          </TableCell>
                          <TableCell className="font-medium text-foreground">
                            {log.user_email}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {log.action}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Badge className={getEntityBadgeColor(entityType)}>
                                {formatEntityName(entityType)}
                              </Badge>
                              {entityId && (
                                <span className="text-xs text-muted-foreground font-mono">
                                  {entityId.substring(0, 8)}…
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {format(new Date(log.created_at), "dd MMM yyyy, HH:mm")}
                          </TableCell>
                        </TableRow>
                        {hasDetails && (
                          <CollapsibleContent asChild>
                            <TableRow className="border-border/50 bg-muted/20">
                              <TableCell colSpan={5} className="py-4">
                                <div className="space-y-3 px-4">
                                  {log.old_values && (
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-4 h-4 text-destructive" />
                                        <span className="text-sm font-medium text-destructive">
                                          Previous values
                                        </span>
                                      </div>
                                      <pre className="text-xs bg-card/50 p-3 rounded border border-border/30 overflow-x-auto">
                                        {JSON.stringify(log.old_values, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                  {log.new_values && (
                                    <div>
                                      <div className="flex items-center gap-2 mb-2">
                                        <FileText className="w-4 h-4 text-accent" />
                                        <span className="text-sm font-medium text-accent">
                                          New values
                                        </span>
                                      </div>
                                      <pre className="text-xs bg-card/50 p-3 rounded border border-border/30 overflow-x-auto">
                                        {JSON.stringify(log.new_values, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            </TableRow>
                          </CollapsibleContent>
                        )}
                      </>
                    </Collapsible>
                  );
                })}
              </TableBody>
            </Table>
          </Card>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, filteredLogs.length)} of{" "}
                {filteredLogs.length} {filteredLogs.length === 1 ? "entry" : "entries"}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className={currentPage === pageNum ? "gradient-accent" : ""}
                      >
                        {pageNum}
                      </Button>
                    );
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
        </>
      )}
    </div>
  );
};

export default AuditLogs;
