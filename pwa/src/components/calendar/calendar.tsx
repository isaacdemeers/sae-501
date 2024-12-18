'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import listPlugin from '@fullcalendar/list';
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid'
import React, { useRef, useEffect, useState } from 'react';
import EventSideShow from '@/components/events/eventSideShow';
import { Diamond, ChevronLeft, ChevronRight, CalendarDays, ArrowBigUp, SquareMenu, PanelsTopLeft, PanelTop, GitCommitHorizontal } from 'lucide-react';
import CalendarCustomBtn from './customButtons';
import FullCalendar from '@fullcalendar/react'
import { Separator } from "@/components/ui/separator"
import { abhayalibre } from "@/lib/fonts"
import { fetchUserEvents, IsAuthentificated } from "@/lib/request"



const randomColor = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function transformEvents(events: any[]) {
    return events.map(event => ({
        id: event.eventId || event.id,
        title: event.title,
        start: event.datestart.replace(' ', 'T'),
        end: event.dateend.replace(' ', 'T'),
        color: '#475569',
        extendedProps: {
            description: event.description,
            location: event.location,
            maxparticipant: event.maxparticipant,
            sharelink: event.sharelink,
            img: event.img,
            visibility: event.visibility,
            id: event.eventId || event.id,
            creatorusername: event.creatorusername,
            creatoremail: event.creatoremail,
            role: event.role
        }
    }));
}

interface Event {
    id: number;
    title: string;
    image: string;
    dates: string;
    maxparticipant: number;
    visibility: number;
    location: string;
    userCount: number;
    creatorusername: string;
    creatoremail: string;
    role: string;
  }


export function Calendar() {
    const calendarRef = useRef<FullCalendar>(null);
    const [currentTitle, setCurrentTitle] = useState('');
    const [events, setEvents] = useState<any[]>([]);
    const [selectedEvent, setSelectedEvent] = useState<any>(null);
    const [user, setUser] = useState<any>(null);



    useEffect(() => {
        IsAuthentificated().then((data) => {
            setUser(data.user);
            fetchUserEvents(data.user.id).then((data) => {
                const transformedEvents = transformEvents(data);
              
                setEvents(transformedEvents);
            });
        });
    }, []);

    const handleUnsubscribe = async () => {
        const data = await fetchUserEvents(user.id);
 
        if (data.message === "No events found for this user") {
            setEvents([]);
        } else {
            const transformedEvents = transformEvents(data);
            setEvents(transformedEvents);
        }
        setSelectedEvent(null); 
    };

    return (

        <Card className=' relative  h-[87vh]  w-full border-none transition-all flex shadow-none gap-4 flex-row'>
            <Card className='p-4  overflow-hidden pb-14 h-full w-full transition-all'>
                <div className='flex justify-between items-center  '>
                    <h2 id='title' className={`text-slate-600 font-semibold text-4xl ${abhayalibre.className} `}>{currentTitle}</h2>

                    <nav className='flex gap-2 items-center justify-end'>

                        <CalendarCustomBtn icon={<SquareMenu />} action='day' calendarRef={calendarRef} />
                        <CalendarCustomBtn icon={<PanelsTopLeft />} action='week' calendarRef={calendarRef} />
                        <CalendarCustomBtn icon={<PanelTop />} action='month' calendarRef={calendarRef} />

                        <Separator orientation='vertical' className='h-6 mx-2' />


                        <CalendarCustomBtn icon={<ChevronLeft />} action='previous' calendarRef={calendarRef} />
                        <CalendarCustomBtn icon={<GitCommitHorizontal />} action='today' calendarRef={calendarRef} />
                        <CalendarCustomBtn icon={<ChevronRight />} action='next' calendarRef={calendarRef} />


                    </nav>
                </div>

                <FullCalendar
                    ref={calendarRef}
                    plugins={[dayGridPlugin, listPlugin, dayGridPlugin, interactionPlugin, timeGridPlugin]}
                    initialView="timeGridWeek"
                    eventContent={renderEventContent}
                    themeSystem='bootstrap5'
                    height={'100%'}
                    slotDuration={'01:00:00'}


                    headerToolbar={{
                        start: 'title', // will normally be on the left. if RTL, will be on the right
                        center: '',
                        end: '' // dayGridMonth,timeGridWeek,dayGridDay,listWeek prev,today,next
                    }}
                    events={events}

                    eventTimeFormat={{
                        hour: 'numeric',
                        minute: '2-digit',
                        meridiem: false
                    }}

                    slotLabelFormat={{
                        hour: 'numeric',
                        minute: '2-digit',
                        omitZeroMinute: true,
                        meridiem: 'short',
                        hour12: false

                    }}


                    eventMaxStack={3}
                    dayMaxEventRows={true}
                    dayPopoverFormat={{ month: 'long', day: 'numeric', year: 'numeric' }}



                    // HEADERS
                    dayHeaderFormat={{ weekday: 'short', omitCommas: true }}


                    navLinks={true}
                    weekNumbers={true}
                    weekText="s"
                    selectable={true}


                    // dateClick={function (info) {
                    //     // alert('Clicked on: ' + info.dateStr);
                    //     // alert('Coordinates: ' + info.jsEvent.pageX + ',' + info.jsEvent.pageY);
                    //     // alert('Current view: ' + info.view.type);
                    //     info.dayEl.style.backgroundColor = 'red';
                    // }}

                    selectMinDistance={40}
                    select={
                        function (info) {
                            let start = info.startStr;
                            let end = info.endStr;
                            let date = new Date(start);
                            let dateEnd = new Date(end);
                            dateEnd.setDate(dateEnd.getDate() - 1);

                            // TEMPORARY
                            // while (date <= dateEnd) {
                            //     let dateStr = date.toISOString().split('T')[0];
                            //     let day = document.querySelector(`[data-date="${dateStr}"]`);
                            //     day.style.backgroundColor = 'red';
                            //     date.setDate(date.getDate() + 1);
                            // }
                        }}
                    eventClick={function (info) {
                        const formatDate = (dateStr: string) => {
                            const date = new Date(dateStr);
                            const day = new Intl.DateTimeFormat('fr-FR', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric'
                            }).format(date);

                            const time = new Intl.DateTimeFormat('fr-FR', {
                                hour: 'numeric',
                                minute: 'numeric'
                            }).format(date);

                            return {
                                day,
                                time
                            };
                        };

                        let event = {
                            id: info.event.id || info.event.extendedProps.id,  // Utiliser l'ID de l'événement ou celui dans extendedProps
                            title: info.event.title,
                            image: info.event.extendedProps.img,
                            location: info.event.extendedProps.location,
                            dates: (() => {
                                const start = formatDate(info.event.startStr);
                                const end = formatDate(info.event.endStr);

                                if (start.day === end.day) {
                                    return `Le ${start.day}, de ${start.time} à ${end.time}`;
                                }
                                return `Du ${start.day} à ${start.time} au ${end.day} à ${end.time}`;
                            })(),
                            participants: info.event.extendedProps.maxparticipant,
                            visibility: info.event.extendedProps.visibility,
                            creatorusername: info.event.extendedProps.creatorusername,
                            creatoremail: info.event.extendedProps.creatoremail,
                            role: info.event.extendedProps.role
                        }
                        setSelectedEvent(event);
                    }}
                    eventMouseLeave={function (info) {
                        // // reset the border
                        // info.el.style.borderColor = 'transparent';
                        // let sideShow = document.querySelector<HTMLDivElement>("#sideShow");
                        // sideShow?.classList.remove("active");
                    }}

                    eventMouseEnter={function (info) { }}


                    datesSet={(dateInfo) => {
                        const toolbarTitle = document.querySelector('.fc-toolbar-title');
                        if (toolbarTitle) {
                            setCurrentTitle(toolbarTitle.textContent || '');
                        }
                    }}
                />
            </Card>

            <RenderedEventSideShow selectedEvent={selectedEvent} user={user} onUnsubscribe={handleUnsubscribe} />
        </Card >


    )
}

function renderEventContent(eventInfo: any) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    )
}

interface RenderedEventSideShowProps {
    selectedEvent: Event | null;
    user: any;
    onUnsubscribe: () => void;
}

export function RenderedEventSideShow({ selectedEvent, user, onUnsubscribe }: RenderedEventSideShowProps) {
    return (
        <Card className="relative w-full md:w-96 h-fit min-h-[500px] p-0 overflow-x-hidden max-h-full">
            {selectedEvent ? (
                <section className="w-full z-10 h-full opacity-100 overflow-y-scroll rounded-sm overflow-hidden">
                    <EventSideShow event={selectedEvent} user={user} onUnsubscribe={onUnsubscribe} />
                </section>
            ) : (
                <p className="absolute top-1/2 z-0 text-center left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    Rien à afficher
                </p>
            )}
        </Card>
    )
}
