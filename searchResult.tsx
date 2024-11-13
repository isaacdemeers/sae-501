'use client'
import Link from "next/link"
import React from "react"
import { PlusCircle, Calendar, User, AlignRight } from "lucide-react"
import { abhayalibre } from '@/components/fonts/fonts'
import { Card } from "@/components/ui/card"
import EventCard from "@/components/eventCard"


import { Button } from "@/components/ui/button"
import SearchBar from "@/components/searchBar"



export default function SearchResult() {
    React.useEffect(() => {
        const input = document.querySelector<HTMLInputElement>("#search");
        const bar = document.querySelector<HTMLDivElement>("#searchResult");

        if (!input) return;
        if (!bar) return;


        const handleFocus = () => {
            bar.classList.add("active");
        };

        const handleBlur = () => {
            bar.classList.remove("active");
        };

        // Ajouter les gestionnaires d'événements
        input.addEventListener("focus", handleFocus);
        input.addEventListener("blur", handleBlur);

        // Nettoyer les événements lors du démontage
        return () => {
            input.removeEventListener("focus", handleFocus);
            input.removeEventListener("blur", handleBlur);
        };
    }, []);
    return (
        // <section className=" absolute z-30 top-0 left-0 w-screen h-screen flex items-start sm:items-center justify-center bg-slate-950 sm:px-80 sm:py-16 bg-opacity-60">
        // </section >
        // <section className="bg-slate-950 z-40 absolute w-screen h-screen top-0 left-0 bg-opacity-60 flex items-center justify-center py-24 aspect-square ">
        <Card id="searchResult" className=" transition-all fixed z-40 left-1/2 w-2/3 searchResult-active opacity-0 transform -translate-x-1/2 
         bg-slate-50 bg-opacity-95 items-center justify-between p-4 mt-24 backdrop-blur-md blur-md flex origin-top-left flex-col gap-4 max-h-[80vh]">

            <h1 className=" font-semibold text-slate-600 w-full">Search Results</h1>
            <ul className=" flex flex-wrap items-start justify-evenly w-full max-h-[80vh] overflow-y-scroll rounded-lg gap-2">
                <EventCard title="Event sjhdfgkjsGFKSGKDJFHSDKGQFJHGDKJFHQGSDKJHFGSD1" date="10 janvier 3000" isPublic={false} attendees={30} imageUrl="/img.jpg" />
                <EventCard title="Event sjhdfgkjsGFKSGKDJFHSDKGQFJHGDKJFHQGSDKJHFGSD1" date="10 janvier 3000" isPublic={false} attendees={30} imageUrl="/img.jpg" />
                <EventCard title="Event sjhdfgkjsGFKSGKDJFHSDKGQFJHGDKJFHQGSDKJHFGSD1" date="10 janvier 3000" isPublic={false} attendees={30} imageUrl="/img.jpg" />
                <EventCard title="Event sjhdfgkjsGFKSGKDJFHSDKGQFJHGDKJFHQGSDKJHFGSD1" date="10 janvier 3000" isPublic={false} attendees={30} imageUrl="/img.jpg" />

            </ul>



        </Card>




    )

}