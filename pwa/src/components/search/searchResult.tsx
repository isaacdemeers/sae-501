'use client'
import Link from "next/link"
import React, { useState, useEffect } from "react"
import { PlusCircle, Calendar, User, AlignRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import EventCard from "@/components/events/eventCard"
import FilterBox from "@/components/search/filter"
import imagess from "@images/image_mairie_limoges.png"
import { GetAllEvents } from "@/lib/request"
import { filterOptions } from "./filter"

interface Event {
    id: number;
    title: string;
    datestart: string;
    dateend: string;
    description: string;
    img: string;
    location: string;
    maxparticipant: string;
    sharelink: string;
    visibility: number;
}

interface SearchResultProps {
    isOpen: boolean
    search: string
}

const filterEvents = (events: Event[], search: string, activeFilters: string[]) => {
    // Si aucun filtre n'est actif, retourner tous les événements
    if (activeFilters.length === 0) {
        return events.filter(event => event.title.toLowerCase().includes(search.toLowerCase()));
    }

    // Filtrer d'abord par visibilité si le filtre private est actif
    let filteredEvents = events;
    if (activeFilters.includes('private')) {
        filteredEvents = events.filter((event: Event) => event.visibility == 0);
    }

    // Ensuite appliquer les autres filtres
    return filteredEvents.filter((event: Event) => {
        // Obtenir les filtres actifs sans le filtre private
        const contentFilters = activeFilters.filter(f => f !== 'private');

        if (contentFilters.length === 0) {
            return event.title.toLowerCase().includes(search.toLowerCase());
        }

        return contentFilters.some(filter => {
            switch (filter) {
                case 'title':
                    return event.title?.toLowerCase().includes(search.toLowerCase()) ?? false;
                case 'description':
                    return event.description?.toLowerCase().includes(search.toLowerCase()) ?? false;
                case 'date':
                    return (
                        (event.datestart?.toLowerCase().includes(search.toLowerCase()) ||
                            event.dateend?.toLowerCase().includes(search.toLowerCase())) ?? false
                    );
                case 'users':
                    return event.maxparticipant?.toString().includes(search) ?? false;
                default:
                    return false;
            }
        });
    });
};

// Ajoutez cette fonction pour obtenir le label d'un filtre
const getFilterLabel = (filterId: string): string => {
    const filter = filterOptions.find(option => option.id === filterId);
    return filter ? filter.label : filterId;
}

export default function SearchResult({ isOpen, search }: SearchResultProps) {
    const [allEvents, setAllEvents] = useState<Event[]>([])
    const [events, setEvents] = useState<Event[]>([])
    const [activeFilters, setActiveFilters] = useState<string[]>(["title"])
    const [activeFilterColors, setActiveFilterColors] = useState<string[]>([])

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const data = await GetAllEvents();
                const events = data['hydra:member'] || [];
                setAllEvents(data);
                setEvents(filterEvents(events, search, activeFilters));
            } catch (error) {
                console.error('Error fetching events:', error);
            }
        };

        fetchEvents();
    }, []);

    useEffect(() => {
        setEvents(filterEvents(allEvents, search, activeFilters));
    }, [search, activeFilters, allEvents]);

    // pour les couleurs
    useEffect(() => {
        setActiveFilterColors(activeFilters.map(filter => filterOptions.find(f => f.id === filter)?.color || ''))
    }, [activeFilters])

    return (
        <Card
            id="searchResult"
            className={`bg-slate-50 bg-opacity-100 backdrop-blur-lg transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] fixed top-0 z-40 left-1/2 w-2/3 transform -translate-x-1/2 
             items-center justify-between p-4 mt-24 flex origin-top-left flex-col gap-4 max-h-[80vh] rounded-xl shadow-lg
             ${isOpen ? 'opacity-100 blur-0 translate-y-0' : 'opacity-0 blur-md -translate-y-4 pointer-events-none'}`}
        >
            <header className="flex items-center justify-between w-full">
                <FilterBox onFiltersChange={setActiveFilters} />
            </header>

            <div className="flex items-center justify-start mt-2 w-full gap-2">
                <h4 className="font-normal text-slate-600 text-xs bg-slate-100 rounded-md py-1 px-2">
                    {events.length} résultats
                </h4>

                <h4 className={`font-normal text-slate-600 text-xs rounded-md py-1 px-2  ${activeFilterColors.join(' ')}`}>
                    {activeFilters.length > 0
                        ? 'Filtrés par ' + activeFilters.map(f => getFilterLabel(f)).join(', ')
                        : 'Aucun filtre'}
                </h4>
            </div>

            <ul className="flex flex-wrap items-start justify-evenly w-full max-h-[80vh] overflow-y-scroll rounded-lg gap-2">
                {events.map((event) => (
                    <EventCard
                        key={event.id.toString()}
                        event={{
                            id: event.id.toString(),
                            title: event.title,
                            date: event.datestart,
                            visibility: event.visibility,
                            attendees: parseInt(event.maxparticipant),
                            imageUrl: event.img,
                            description: event.description
                        }}
                        type="searchResult"
                    />
                ))}
            </ul>
        </Card>
    )
}