"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowLeft,
  Edit,
  Share2,
  Users,
  Plus,
  MapPin,
  Clock,
  Mail,
  Eye,
  UserCog,
  Check,
} from "lucide-react";
import Link from "next/link";
import { GetEvent } from "@/lib/request"; // Utilisation de votre fichier request.ts
import { useState, useEffect } from "react";
import Image from "next/image";
import eventImage from "@images/event-background-desktop.png";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  IsAuthentificated,
  JoinEvent,
  VerifyConnectionUUID,
  unsubscribeConnectedUser,
  unsubscribeUUID,
  NewConnectionUUID,
} from "@/lib/request";
import { DialogClose } from "@radix-ui/react-dialog";
import EventForm from "./eventEdit"; // Ajoutez cet import
import EventModerate from "./eventModerate";
import { GetEventAdmin } from "@/lib/request"; // Ajoutez cet import

interface EventPageProps {
  params: {
    id: number;
  };
}

interface Event {
  id: string;
  title: string;
  description: string;
  datestart: string;
  dateend: string;
  location: string;
  maxparticipant: number;
  img: string;
  visibility: boolean;
}

interface Admin {
  id: number;
  email: string;
}

export default function PageEvent({ params }: EventPageProps) {
  const { id } = params;

  // Gestion des états
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [Role, setRole] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [connectionuuid, setConnectionuuid] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMessage, setDialogMessage] = useState("");
  const router = useRouter();
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showModerateDialog, setShowModerateDialog] = useState(false);
  const [eventAdmin, setEventAdmin] = useState<Admin | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchEventAndCheckAuthentication = async () => {
      setLoading(true);
      setError(null);
      const urlParams = new URLSearchParams(window.location.search);
      try {
        const [eventData, authData, adminData] = await Promise.all([
          GetEvent(id),
          IsAuthentificated(),
          GetEventAdmin(id),
        ]);
        setEvent(eventData);
        setEventAdmin(adminData.admin);

        if (eventData.visibility === 0 && !authData.isValid) {
          const newconnection = urlParams.get("newconnection");
          router.push(
            `/login?returnUrl=/events/${id}?newconnection=${newconnection}`
          );
          return;
        } else if (authData.isValid) {
          setIsAuthenticated(true);
          console.log("Admin Data:", adminData);
          console.log("Auth Data:", authData);
          if (
            adminData.admin &&
            authData.user &&
            authData.user.email === adminData.admin.email
          ) {
            setIsAdmin(true);
            setIsSubscribed(true);
          }

          const connection = urlParams.get("connection");
          if (connection) {
            setConnectionuuid(connection);
            await verifyConnectionUUID(connection, id);
          }
          const newconnection = urlParams.get("newconnection");
          if (newconnection) {
            setConnectionuuid(newconnection);
            await NewConnectionUUID(newconnection, id);
          }
        } else if (authData.isValid === false) {
          const urlParams = new URLSearchParams(window.location.search);
          const connection = urlParams.get("connection");
          if (connection) {
            setConnectionuuid(connection);
            await verifyConnectionUUID(connection, id);
          }
          const newconnection = urlParams.get("newconnection");
          if (newconnection) {
            setConnectionuuid(newconnection);
            await NewConnectionUUID(newconnection, id);
          }
        }
      } catch (err) {
        setError("Une erreur est survenue lors du chargement de l'événement.");
        console.error("Erreur lors du chargement de l'événement:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventAndCheckAuthentication();
  }, [id]);

  async function verifyConnectionUUID(connectionUUID: string, id: number) {
    try {
      const response = await VerifyConnectionUUID(connectionUUID, id);
      if (response.isValid) {
        console.log("Connection UUID is valid");
        setIsSubscribed(true);
      } else {
        console.log("Connection UUID is invalid");
      }
    } catch (error) {
      console.error("Error verifying connection UUID:", error);
    }
  }

  async function handleSubscribe() {
    let sub = await JoinEvent(id, email);
    if (sub.message === "User successfully joined the event") {
      setIsDialogOpen(false);
      setIsSubscribed(true);
      console.log(sub);
      if (sub.uuid !== "") {
        setConnectionuuid(sub.uuid); // Replace alert with console log or any other notification method
        console.log("Vous avez rejoint l'événement avec succès");
      }
    } else if (sub.error) {
      console.log(sub);
      setDialogMessage(sub.error);
    }
  }

  async function handleUnsubscribe() {
    if (isAuthenticated) {
      let unsub = await unsubscribeConnectedUser(id);
      if (unsub.message === "User successfully left the event") {
        setIsDialogOpen(false);
        setIsSubscribed(false);
        console.log("Vous vous êtes désinscrit avec succès");
      }
      if (unsub.error === "Admin users cannot unsubscribe from the event") {
        setIsDialogOpen(false);
        setError(" Le créateur ne peut pas se désinscrire de l'événement");
        setTimeout(() => {
          setError("");
        }, 5000);
      }
    } else if (connectionuuid !== "" && isSubscribed) {
      let unsub = await unsubscribeUUID(connectionuuid, id);
      if (unsub.message === "User successfully left the event") {
        setIsDialogOpen(false);
        setIsSubscribed(false);
        console.log("Vous vous êtes désinscrit avec succès");
      } else {
        console.log(unsub);
      }
    }
  }

  // Formatage des dates
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString("fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function isSameDay(dateStart: string, dateEnd: string): boolean {
    const start = new Date(dateStart);
    const end = new Date(dateEnd);
    return (
      start.getFullYear() === end.getFullYear() &&
      start.getMonth() === end.getMonth() &&
      start.getDate() === end.getDate()
    );
  }

  const refreshEventData = async () => {
    try {
      const eventData = await GetEvent(id);
      setEvent(eventData);
    } catch (err) {
      console.error("Erreur lors du rafraîchissement des données:", err);
    }
  };

  // Gestion des cas de chargement ou d'erreur
  if (loading) {
    return <p>Chargement de l&apos;événement...</p>;
  }

  if (!event) {
    return <p>Aucun événement trouvé.</p>;
  }

  // Rendu principal
  return (
    <div className="max-w-2xl p-4 mx-auto md:max-w-3xl lg:max-w-5xl md:p-8 lg:p-12 mt-20">
      {error ? (
        <div className="max-w-2xl p-4 mx-auto md:max-w-3xl lg:max-w-5xl md:p-8 lg:p-12">
          <p className="text-white p-4 bg-red-500 bg-opacity-80 flex justify-center">
            {error}
          </p>
        </div>
      ) : null}
      <header className="flex justify-between mb-8">
        <Link href="/">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" /> Retour
          </Button>
        </Link>
        {isAdmin && (
          <div className="flex gap-2">
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="md:flex">
                  <Edit className="w-4 h-4 mr-2" />
                  Éditer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <EventForm
                  event={event}
                  onClose={() => setShowEditDialog(false)}
                  onUpdate={refreshEventData}
                />
              </DialogContent>
            </Dialog>

            <Dialog
              open={showModerateDialog}
              onOpenChange={setShowModerateDialog}
            >
              <DialogTrigger asChild>
                <Button variant="default" size="sm" className="md:flex">
                  <UserCog className="w-4 h-4 mr-2" />
                  Modérer
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <EventModerate eventId={Number(event.id)} />
              </DialogContent>
            </Dialog>
          </div>
        )}
      </header>

      <Card className="border-none shadow-none">
        <CardHeader>
          <img
            src={event.img}
            alt="Event banner"
            className="object-cover w-full h-48 rounded-xl"
          />
        </CardHeader>
        <CardContent className="md:mt-2 lg:mt-4">
          <CardTitle className="mb-4 text-2xl font-semibold md:text-3xl lg:text-4xl md:font-extrabold">
            {event.title}
          </CardTitle>
          <div className="flex flex-col justify-between md:flex-row-reverse md:mt-8 lg:mt-12 mb-">
            <div className="flex flex-wrap gap-4 mt-2 mb-8 md:mt-0">
              <Button
                variant="default"
                className="bg-green-500 md:flex hover:bg-green-400"
              >
                <Users className="w-4 h-4 mr-2" /> 23
              </Button>
              <Button variant="default" className="">
                <Share2 className="w-4 h-4 mr-2" /> Partager
              </Button>
              {isSubscribed ? (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="default"
                      className="bg-blue-500 md:flex hover:bg-blue-400"
                      onClick={() => setIsDialogOpen(true)}
                    >
                      <Check className="w-4 h-4 mr-2" /> Inscrit
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <h2 className="text-lg font-bold">Désinscription</h2>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        Attention, vous allez vous désinscrire de cet évènement.
                        Voulez-vous vraiment continuer ?
                      </p>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Annuler
                      </Button>
                      <Button variant="destructive" onClick={handleUnsubscribe}>
                        Se désinscrire
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              ) : isAuthenticated ? (
                <Button variant="default" onClick={handleSubscribe}>
                  <Plus className="w-4 h-4 mr-2" /> S&apos;inscrire
                </Button>
              ) : (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="default">
                      <Plus className="w-4 h-4 mr-2" /> S&apos;inscrire
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <h2 className="text-lg font-bold">
                        S&apos;inscrire à l&apos;évènement
                      </h2>
                    </DialogHeader>
                    <div className="space-y-4">
                      {dialogMessage ? (
                        <p className="flex justify-center text-sm text-red-500">
                          {dialogMessage}
                        </p>
                      ) : null}
                      <p className="text-sm text-muted-foreground">
                        Pour vous inscrire, connectez-vous.
                      </p>
                      <div className="flex flex-col gap-4">
                        <Link href={`/login?returnUrl=/events/${id}`} passHref>
                          <Button
                            className="flex w-full items-center justify-center"
                            variant="secondary"
                          >
                            Se connecter
                          </Button>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          ou inscrivez-vous avec votre email
                        </p>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleSubscribe();
                          }}
                          className="space-y-2"
                        >
                          <Label htmlFor="email">Votre email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Entrez votre email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                          />
                          <Button type="submit">
                            S&apos;inscrire avec votre email
                          </Button>
                        </form>
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose>
                        <Button variant="outline" onClick={() => setEmail("")}>
                          Fermer
                        </Button>
                      </DialogClose>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="flex flex-col gap-4 mb-3 w-48md:w-72 lg:w-96 md:mb-6">
              <p>
                {isSameDay(event.datestart, event.dateend)
                  ? `A lieu le ${formatDate(event.datestart)} de ${formatTime(
                      event.datestart
                    )} à ${formatTime(event.dateend)}`
                  : `A lieu du ${formatDate(event.datestart)} à ${formatTime(
                      event.datestart
                    )} au ${formatDate(event.dateend)} à ${formatTime(
                      event.dateend
                    )}`}
              </p>
            </div>
          </div>

          <section className="mb-8">
            <h2 className="mb-3 text-2xl font-semibold md:mb-6">Description</h2>
            <p className="text-muted-foreground">{event.description}</p>
          </section>

          <section>
            <h2 className="mb-6 text-2xl font-semibold">Informations</h2>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
              <div>
                <div className="flex gap-2 pb-2">
                  <MapPin />
                  <h3 className="font-semibold">Lieu</h3>
                </div>
                <p>{event.location}</p>
              </div>
              <div>
                <div className="flex gap-2 pb-2">
                  <Clock />
                  <h3 className="font-semibold">Date</h3>
                </div>
                <p>
                  {isSameDay(event.datestart, event.dateend)
                    ? `Le ${formatDate(event.datestart)} de ${formatTime(
                        event.datestart
                      )} à ${formatTime(event.dateend)}`
                    : `Du ${formatDate(event.datestart)} à ${formatTime(
                        event.datestart
                      )} au ${formatDate(event.dateend)} à ${formatTime(
                        event.dateend
                      )}`}
                </p>
              </div>
              <div>
                <div className="flex gap-2 pb-2">
                  <Users />
                  <h3 className="font-semibold">Places restantes</h3>
                </div>
                <p>30 / {event.maxparticipant} places</p>
              </div>
              <div>
                <div className="flex gap-2 pb-2">
                  <UserCog />
                  <h3 className="font-semibold">Organisateur</h3>
                </div>
                <p>{eventAdmin?.email || "Non spécifié"}</p>
              </div>
              <div>
                <div className="flex gap-2 pb-2">
                  <Eye />
                  <h3 className="font-semibold">Visibilité</h3>
                </div>
                <p>{event.visibility ? "Public" : "Privé"}</p>
              </div>
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
}
