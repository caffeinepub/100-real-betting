import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Loader2, Plus, Trash2, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Status } from "../backend";
import type { Event } from "../backend";
import {
  useActiveMarkets,
  useCancelEvent,
  useCreateEvent,
  useSettleEvent,
  useUpdateEventStatus,
} from "../hooks/useQueries";

const SPORTS = [
  "Football",
  "Basketball",
  "Tennis",
  "Esports",
  "Baseball",
  "Hockey",
];
const SKELETON_KEYS = ["sk1", "sk2", "sk3"];

function EventRow({ event }: { event: Event }) {
  const settleEvent = useSettleEvent();
  const updateStatus = useUpdateEventStatus();
  const cancelEvent = useCancelEvent();
  const [settleOpen, setSettleOpen] = useState(false);
  const [winningSelId, setWinningSelId] = useState("");

  const handleSettle = async () => {
    if (!winningSelId) {
      toast.error("Select a winning outcome");
      return;
    }
    try {
      await settleEvent.mutateAsync({
        eventId: event.id,
        winningSelectionId: BigInt(winningSelId),
      });
      toast.success("Event settled!");
      setSettleOpen(false);
    } catch {
      toast.error("Failed to settle event");
    }
  };

  const handleStatusChange = async (status: Status) => {
    try {
      await updateStatus.mutateAsync({ eventId: event.id, status });
      toast.success("Status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleCancel = async () => {
    try {
      await cancelEvent.mutateAsync(event.id);
      toast.success("Event cancelled");
    } catch {
      toast.error("Failed to cancel event");
    }
  };

  const statusColors: Record<Status, string> = {
    [Status.live]: "bg-red-100 text-red-700",
    [Status.upcoming]: "bg-blue-100 text-blue-700",
    [Status.settled]: "bg-green-100 text-green-700",
    [Status.closed]: "bg-gray-100 text-gray-500",
  };

  return (
    <>
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-foreground truncate">
            {event.title}
          </div>
          <div className="text-xs text-muted-foreground">
            {event.sport} · {event.selections.length} selections
          </div>
        </div>
        <Badge
          className={`text-[10px] px-1.5 py-0 border-0 font-bold ${statusColors[event.status]}`}
        >
          {event.status.toUpperCase()}
        </Badge>
        <div className="flex items-center gap-2">
          {event.status !== Status.settled &&
            event.status !== Status.closed && (
              <>
                <Select onValueChange={(v) => handleStatusChange(v as Status)}>
                  <SelectTrigger
                    data-ocid="admin.status.select"
                    className="h-7 text-xs w-28"
                  >
                    <SelectValue placeholder="Set status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={Status.upcoming}>Upcoming</SelectItem>
                    <SelectItem value={Status.live}>Live</SelectItem>
                    <SelectItem value={Status.closed}>Close</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  data-ocid="admin.settle.button"
                  size="sm"
                  className="h-7 text-xs bg-emerald-brand hover:bg-emerald-light text-white border-0"
                  onClick={() => setSettleOpen(true)}
                >
                  <CheckCircle className="h-3 w-3 mr-1" /> Settle
                </Button>
                <Button
                  data-ocid="admin.cancel.delete_button"
                  size="sm"
                  variant="outline"
                  className="h-7 text-xs text-destructive border-destructive/30 hover:bg-destructive hover:text-white"
                  onClick={handleCancel}
                  disabled={cancelEvent.isPending}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </>
            )}
        </div>
      </div>

      <Dialog open={settleOpen} onOpenChange={setSettleOpen}>
        <DialogContent data-ocid="admin.settle.dialog" className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Settle Event</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <p className="text-sm text-muted-foreground">{event.title}</p>
            <div className="space-y-1.5">
              <Label>Winning Selection</Label>
              <Select onValueChange={setWinningSelId}>
                <SelectTrigger data-ocid="admin.winning.select">
                  <SelectValue placeholder="Choose winner..." />
                </SelectTrigger>
                <SelectContent>
                  {event.selections.map((sel) => (
                    <SelectItem
                      key={sel.id.toString()}
                      value={sel.id.toString()}
                    >
                      {sel.name} ({sel.odds.toFixed(2)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              data-ocid="admin.settle.cancel_button"
              variant="outline"
              onClick={() => setSettleOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.settle.confirm_button"
              className="bg-emerald-brand hover:bg-emerald-light text-white border-0"
              onClick={handleSettle}
              disabled={settleEvent.isPending}
            >
              {settleEvent.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

interface SelectionInput {
  id: string;
  name: string;
  odds: string;
}

let selId = 0;
function newSel(): SelectionInput {
  selId += 1;
  return { id: `sel-${selId}`, name: "", odds: "" };
}

export default function AdminPanel() {
  const { data: markets, isLoading } = useActiveMarkets();
  const createEvent = useCreateEvent();

  const [createOpen, setCreateOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    sport: "",
    startTime: "",
  });
  const [selections, setSelections] = useState<SelectionInput[]>([
    newSel(),
    newSel(),
  ]);

  const addSelection = () => setSelections((p) => [...p, newSel()]);
  const removeSelection = (id: string) =>
    setSelections((p) => p.filter((s) => s.id !== id));
  const updateSelection = (id: string, field: "name" | "odds", value: string) =>
    setSelections((p) =>
      p.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    );

  const handleCreate = async () => {
    if (!form.title || !form.sport || !form.startTime) {
      toast.error("Fill in all required fields");
      return;
    }
    const validSels = selections.filter(
      (s) => s.name && Number.parseFloat(s.odds) > 0,
    );
    if (validSels.length < 2) {
      toast.error("Add at least 2 valid selections");
      return;
    }
    try {
      await createEvent.mutateAsync({
        title: form.title,
        description: form.description,
        sport: form.sport,
        startTime: BigInt(new Date(form.startTime).getTime()),
        selections: validSels.map((s, i) => ({
          id: BigInt(i),
          name: s.name,
          odds: Number.parseFloat(s.odds),
        })),
      });
      toast.success("Event created!");
      setCreateOpen(false);
      setForm({ title: "", description: "", sport: "", startTime: "" });
      setSelections([newSel(), newSel()]);
    } catch {
      toast.error("Failed to create event");
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-sm text-muted-foreground">
              Manage events and markets
            </p>
          </div>
          <Button
            data-ocid="admin.create.open_modal_button"
            className="bg-emerald-brand hover:bg-emerald-light text-white border-0"
            onClick={() => setCreateOpen(true)}
          >
            <Plus className="h-4 w-4 mr-2" /> Create Event
          </Button>
        </div>

        <div className="bg-white rounded-xl card-shadow border border-border overflow-hidden">
          <div className="px-4 py-3 border-b border-border">
            <h2 className="text-sm font-bold uppercase tracking-wide">
              All Events
            </h2>
          </div>
          {isLoading ? (
            <div
              data-ocid="admin.events.loading_state"
              className="p-4 space-y-3"
            >
              {SKELETON_KEYS.map((k) => (
                <Skeleton key={k} className="h-12 w-full rounded-lg" />
              ))}
            </div>
          ) : !markets || markets.length === 0 ? (
            <div
              data-ocid="admin.events.empty_state"
              className="py-12 text-center text-muted-foreground text-sm"
            >
              No events yet. Create your first event above.
            </div>
          ) : (
            markets.map((event) => (
              <EventRow key={event.id.toString()} event={event} />
            ))
          )}
        </div>
      </motion.div>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent
          data-ocid="admin.create.dialog"
          className="max-w-lg max-h-[90vh] overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2 space-y-1">
                <Label>Event Title *</Label>
                <Input
                  data-ocid="admin.title.input"
                  placeholder="e.g. Arsenal vs Man City"
                  value={form.title}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, title: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-1">
                <Label>Sport *</Label>
                <Select
                  onValueChange={(v) => setForm((p) => ({ ...p, sport: v }))}
                >
                  <SelectTrigger data-ocid="admin.sport.select">
                    <SelectValue placeholder="Select sport" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPORTS.map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1">
                <Label>Start Time *</Label>
                <Input
                  data-ocid="admin.starttime.input"
                  type="datetime-local"
                  value={form.startTime}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, startTime: e.target.value }))
                  }
                />
              </div>
              <div className="col-span-2 space-y-1">
                <Label>Description</Label>
                <Input
                  data-ocid="admin.description.input"
                  placeholder="Short description..."
                  value={form.description}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, description: e.target.value }))
                  }
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Selections</Label>
                <Button
                  data-ocid="admin.addselection.button"
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={addSelection}
                  className="h-7 text-xs"
                >
                  <Plus className="h-3 w-3 mr-1" /> Add
                </Button>
              </div>
              {selections.map((sel, i) => (
                <div key={sel.id} className="flex gap-2 items-center">
                  <Input
                    placeholder={`Outcome ${i + 1} name`}
                    value={sel.name}
                    onChange={(e) =>
                      updateSelection(sel.id, "name", e.target.value)
                    }
                    className="flex-1 h-8 text-sm"
                  />
                  <Input
                    placeholder="Odds"
                    type="number"
                    step="0.01"
                    value={sel.odds}
                    onChange={(e) =>
                      updateSelection(sel.id, "odds", e.target.value)
                    }
                    className="w-20 h-8 text-sm"
                  />
                  {selections.length > 2 && (
                    <Button
                      data-ocid={`admin.removeselection.delete_button.${i + 1}`}
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8 text-destructive"
                      onClick={() => removeSelection(sel.id)}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button
              data-ocid="admin.create.cancel_button"
              variant="outline"
              onClick={() => setCreateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-ocid="admin.create.submit_button"
              className="bg-emerald-brand hover:bg-emerald-light text-white border-0"
              onClick={handleCreate}
              disabled={createEvent.isPending}
            >
              {createEvent.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              Create Event
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
