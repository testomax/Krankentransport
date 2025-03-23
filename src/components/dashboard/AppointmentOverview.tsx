import React, { useState } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "moment/locale/de";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  Edit,
  Eye,
  Trash2,
} from "lucide-react";

// Setup the localizer for react-big-calendar with German locale
moment.locale("de");
const localizer = momentLocalizer(moment);

// Appointment status types
type AppointmentStatus =
  | "unassigned"
  | "assigned"
  | "in-progress"
  | "completed";

// Appointment type definition
interface Appointment {
  id: string;
  title: string;
  start: Date;
  end: Date;
  status: AppointmentStatus;
  patientData: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  pickupAddress: string;
  destinationAddress: string;
  transportType: "wheelchair" | "carrying-chair";
  vehicleId?: string;
}

// Mock data for appointments
const mockAppointments: Appointment[] = [
  {
    id: "1",
    title: "Müller, Hans",
    start: new Date(2023, 5, 15, 10, 0),
    end: new Date(2023, 5, 15, 10, 45),
    status: "unassigned",
    patientData: {
      firstName: "Hans",
      lastName: "Müller",
      phoneNumber: "+49123456789",
    },
    pickupAddress: "Hauptstraße 1, Berlin",
    destinationAddress: "Klinikum Berlin, Charité",
    transportType: "wheelchair",
  },
  {
    id: "2",
    title: "Schmidt, Maria",
    start: new Date(2023, 5, 15, 11, 0),
    end: new Date(2023, 5, 15, 11, 45),
    status: "assigned",
    patientData: {
      firstName: "Maria",
      lastName: "Schmidt",
      phoneNumber: "+49987654321",
    },
    pickupAddress: "Berliner Straße 42, Berlin",
    destinationAddress: "Praxis Dr. Weber, Friedrichstraße",
    transportType: "carrying-chair",
    vehicleId: "V001",
  },
  {
    id: "3",
    title: "Weber, Klaus",
    start: new Date(2023, 5, 15, 14, 0),
    end: new Date(2023, 5, 15, 14, 45),
    status: "in-progress",
    patientData: {
      firstName: "Klaus",
      lastName: "Weber",
      phoneNumber: "+49123123123",
    },
    pickupAddress: "Alexanderplatz 5, Berlin",
    destinationAddress: "Vivantes Klinikum Neukölln",
    transportType: "wheelchair",
    vehicleId: "V002",
  },
  {
    id: "4",
    title: "Fischer, Anna",
    start: new Date(2023, 5, 15, 16, 0),
    end: new Date(2023, 5, 15, 16, 45),
    status: "completed",
    patientData: {
      firstName: "Anna",
      lastName: "Fischer",
      phoneNumber: "+49456456456",
    },
    pickupAddress: "Kurfürstendamm 123, Berlin",
    destinationAddress: "Hausarztpraxis Dr. Schulz",
    transportType: "carrying-chair",
    vehicleId: "V001",
  },
];

// Status badge component
const StatusBadge = ({ status }: { status: AppointmentStatus }) => {
  const variants: Record<
    AppointmentStatus,
    {
      variant: "default" | "secondary" | "destructive" | "outline";
      label: string;
      className?: string;
    }
  > = {
    unassigned: { variant: "outline", label: "Unverteilt" },
    assigned: { variant: "secondary", label: "Zugeteilt" },
    "in-progress": {
      variant: "default",
      label: "In Durchführung",
      className: "bg-amber-500 hover:bg-amber-600",
    },
    completed: {
      variant: "destructive",
      label: "Erledigt",
      className: "bg-green-600 hover:bg-green-700",
    },
  };

  const { variant, label, className } = variants[status];

  return (
    <Badge variant={variant} className={className}>
      {label}
    </Badge>
  );
};

// Appointment detail dialog component
const AppointmentDetailDialog = ({
  appointment,
  open,
  onClose,
}: {
  appointment: Appointment | null;
  open: boolean;
  onClose: () => void;
}) => {
  if (!appointment) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Termindetails</DialogTitle>
          <DialogDescription>
            Details zum Termin von {appointment.patientData.firstName}{" "}
            {appointment.patientData.lastName}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Status</Label>
            <div className="col-span-3">
              <StatusBadge status={appointment.status} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Patient</Label>
            <div className="col-span-3">
              {appointment.patientData.firstName}{" "}
              {appointment.patientData.lastName}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Telefon</Label>
            <div className="col-span-3">
              {appointment.patientData.phoneNumber}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Abholadresse</Label>
            <div className="col-span-3">{appointment.pickupAddress}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Zieladresse</Label>
            <div className="col-span-3">{appointment.destinationAddress}</div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Beförderungsart</Label>
            <div className="col-span-3">
              {appointment.transportType === "wheelchair"
                ? "Rollstuhl"
                : "Tragestuhl"}
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Termin</Label>
            <div className="col-span-3">
              {moment(appointment.start).format("DD.MM.YYYY HH:mm")} -{" "}
              {moment(appointment.end).format("HH:mm")}
            </div>
          </div>
          {appointment.vehicleId && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Fahrzeug</Label>
              <div className="col-span-3">{appointment.vehicleId}</div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Schließen
          </Button>
          <Button>Bearbeiten</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Event component for the calendar
const AppointmentEvent = ({ event }: { event: any }) => {
  return (
    <div className="flex flex-col h-full p-1 overflow-hidden">
      <div className="flex justify-between items-center">
        <span className="font-medium truncate">{event.title}</span>
        <StatusBadge status={event.status} />
      </div>
      <div className="text-xs truncate">{event.pickupAddress}</div>
    </div>
  );
};

interface AppointmentOverviewProps {
  className?: string;
}

const AppointmentOverview = ({ className = "" }: AppointmentOverviewProps) => {
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | "all">(
    "all",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  // Filter appointments based on selected filters
  const filteredAppointments = mockAppointments.filter((appointment) => {
    // Filter by status if not 'all'
    if (statusFilter !== "all" && appointment.status !== statusFilter) {
      return false;
    }

    // Filter by selected date
    if (selectedDate) {
      const appointmentDate = new Date(appointment.start);
      if (appointmentDate.toDateString() !== selectedDate.toDateString()) {
        return false;
      }
    }

    return true;
  });

  // Sort appointments by start time
  filteredAppointments.sort((a, b) => a.start.getTime() - b.start.getTime());

  // Handle appointment click
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsDetailDialogOpen(true);
  };

  // Close detail dialog
  const handleCloseDetailDialog = () => {
    setIsDetailDialogOpen(false);
  };

  return (
    <div className={cn("bg-white p-6 rounded-lg shadow-sm", className)}>
      <div className="flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Terminübersicht</h2>
          <div className="flex space-x-2">
            <Tabs
              value={view}
              onValueChange={(v) => setView(v as "calendar" | "list")}
              className="w-[200px]"
            >
              <TabsList className="w-full">
                <TabsTrigger value="calendar" className="flex-1">
                  Kalender
                </TabsTrigger>
                <TabsTrigger value="list" className="flex-1">
                  Liste
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="w-full md:w-64 flex-shrink-0">
            <Card>
              <CardHeader>
                <CardTitle>Filter</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Datum</Label>
                  <div className="p-3 bg-white rounded-md border">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={(date) => {
                        setSelectedDate(date);
                        // Reset view to calendar when date changes
                        setView("calendar");
                      }}
                      className="mx-auto"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select
                    value={statusFilter}
                    onValueChange={(value) =>
                      setStatusFilter(value as AppointmentStatus | "all")
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Status auswählen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Alle Status</SelectItem>
                      <SelectItem value="unassigned">Unverteilt</SelectItem>
                      <SelectItem value="assigned">Zugeteilt</SelectItem>
                      <SelectItem value="in-progress">
                        In Durchführung
                      </SelectItem>
                      <SelectItem value="completed">Erledigt</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex-1">
            <Tabs value={view}>
              <TabsContent value="calendar" className="mt-0">
                <Card>
                  <CardContent className="p-4">
                    <div className="h-[700px] w-full overflow-x-auto">
                      <BigCalendar
                        localizer={localizer}
                        events={filteredAppointments}
                        startAccessor="start"
                        endAccessor="end"
                        views={["day"]}
                        defaultView="day"
                        date={selectedDate}
                        toolbar={false}
                        components={{
                          event: AppointmentEvent,
                        }}
                        onSelectEvent={(event) =>
                          handleAppointmentClick(event as Appointment)
                        }
                        formats={{
                          timeGutterFormat: (date) =>
                            moment(date).format("HH:mm"),
                          dayHeaderFormat: () => "",
                        }}
                        eventPropGetter={(event) => {
                          const appointment = event as Appointment;
                          let backgroundColor = "#e2e8f0"; // Default gray

                          switch (appointment.status) {
                            case "unassigned":
                              backgroundColor = "#f3f4f6"; // Light gray
                              break;
                            case "assigned":
                              backgroundColor = "#dbeafe"; // Light blue
                              break;
                            case "in-progress":
                              backgroundColor = "#bfdbfe"; // Blue
                              break;
                            case "completed":
                              backgroundColor = "#dcfce7"; // Light green
                              break;
                          }

                          return { style: { backgroundColor } };
                        }}
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="list" className="mt-0">
                <Card>
                  <CardContent className="p-4">
                    <div className="rounded-md border">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="p-2 text-left font-medium">
                              Patient
                            </th>
                            <th className="p-2 text-left font-medium">Zeit</th>
                            <th className="p-2 text-left font-medium">
                              Abholadresse
                            </th>
                            <th className="p-2 text-left font-medium">
                              Status
                            </th>
                            <th className="p-2 text-left font-medium">
                              Aktionen
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {filteredAppointments.length === 0 ? (
                            <tr>
                              <td
                                colSpan={5}
                                className="p-4 text-center text-muted-foreground"
                              >
                                Keine Termine gefunden
                              </td>
                            </tr>
                          ) : (
                            filteredAppointments.map((appointment) => (
                              <tr
                                key={appointment.id}
                                className="border-b hover:bg-muted/50"
                              >
                                <td className="p-2">
                                  {appointment.patientData.firstName}{" "}
                                  {appointment.patientData.lastName}
                                </td>
                                <td className="p-2">
                                  {moment(appointment.start).format("HH:mm")}
                                </td>
                                <td className="p-2">
                                  {appointment.pickupAddress}
                                </td>
                                <td className="p-2">
                                  <StatusBadge status={appointment.status} />
                                </td>
                                <td className="p-2">
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        handleAppointmentClick(appointment)
                                      }
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon">
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() => {
                                        if (
                                          window.confirm(
                                            "Sind Sie sicher, dass Sie diesen Termin löschen möchten?",
                                          )
                                        ) {
                                          console.log(
                                            "Deleting appointment:",
                                            appointment.id,
                                          );
                                          // Here you would call your delete function
                                        }
                                      }}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <AppointmentDetailDialog
        appointment={selectedAppointment}
        open={isDetailDialogOpen}
        onClose={handleCloseDetailDialog}
      />
    </div>
  );
};

export default AppointmentOverview;
