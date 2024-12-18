"use client";

import { useState } from 'react';
import EventCard from '@/components/dashboard/suggestedCards';
import { Button } from "@/components/ui/button";

interface Event {
    imageUrl: string;
    location: string;
    title: string;
    description: string;
    date: string;
    buttonText: string;
    onRegister?: () => void;
}

interface SuggestedEventsProps {
    initialEvents: {
        id: string;
        imageUrl: string;
        location: string;
        title: string;
        description: string;
        date: string;
        buttonText: string;
    }[];
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

export default function SuggestedEvents({
    initialEvents,
    currentPage,
    totalPages,
    onPageChange
}: SuggestedEventsProps) {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Événements suggérés</h2>
            {initialEvents.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {initialEvents.map((event) => (
                            <EventCard key={event.id} {...event} onRegister={() => console.log(`Register clicked for event: ${event.id}`)} />
                        ))}
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-4">
                            <Button
                                variant="outline"
                                onClick={() => onPageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                Précédent
                            </Button>
                            <span className="flex items-center px-4">
                                Page {currentPage} sur {totalPages}
                            </span>
                            <Button
                                variant="outline"
                                onClick={() => onPageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                Suivant
                            </Button>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-slate-50 rounded-lg p-8 text-center">
                    <p className="text-gray-600">
                        Il n'y a pas d'événements pour le moment
                    </p>
                </div>
            )}
        </div>
    );
}
