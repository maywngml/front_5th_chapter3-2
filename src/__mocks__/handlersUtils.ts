import { http, HttpResponse } from 'msw';

import { server } from '../setupTests';
import { Event, EventForm } from '../types';

// ! Hard 여기 제공 안함
export const setupMockHandlerCreation = (initEvents = [] as Event[]) => {
  const mockEvents: Event[] = [...initEvents];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.post('/api/events', async ({ request }) => {
      const newEvent = (await request.json()) as Event;
      newEvent.id = String(mockEvents.length + 1); // 간단한 ID 생성
      mockEvents.push(newEvent);
      return HttpResponse.json(newEvent, { status: 201 });
    })
  );
};

export const setupMockHandlerUpdating = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '기존 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '기존 회의2',
      date: '2025-10-15',
      startTime: '11:00',
      endTime: '12:00',
      description: '기존 팀 미팅 2',
      location: '회의실 C',
      category: '업무 회의',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 5,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.put('/api/events/:id', async ({ params, request }) => {
      const { id } = params;
      const updatedEvent = (await request.json()) as Event;
      const index = mockEvents.findIndex((event) => event.id === id);

      mockEvents[index] = { ...mockEvents[index], ...updatedEvent };
      return HttpResponse.json(mockEvents[index]);
    })
  );
};

export const setupMockHandlerDeletion = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '삭제할 이벤트',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'none', interval: 0 },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.delete('/api/events/:id', ({ params }) => {
      const { id } = params;
      const index = mockEvents.findIndex((event) => event.id === id);

      mockEvents.splice(index, 1);
      return new HttpResponse(null, { status: 204 });
    })
  );
};

export const setupMockHandlerRecurringCreation = (initEvents = [] as Event[]) => {
  const mockEvents: Event[] = [...initEvents];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.post('/api/events-list', async ({ request }) => {
      const repeatId = String(mockEvents.length + 1);
      const { events: eventsToCreate } = (await request.json()) as { events: EventForm[] };
      const newEvents = eventsToCreate.map((event, index) => {
        const isRepeatEvent = event.repeat.type !== 'none';
        return {
          id: String(mockEvents.length + 2 + index),
          ...event,
          repeat: {
            ...event.repeat,
            id: isRepeatEvent ? repeatId : undefined,
          },
        };
      });

      mockEvents.push(...newEvents);
      return HttpResponse.json(newEvents, { status: 201 });
    })
  );
};

export const setupMockHandlerRecurringUpdating = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '기존 회의',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '기존 회의',
      date: '2025-10-16',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    },
    {
      id: '3',
      title: '기존 회의',
      date: '2025-10-17',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    },
    {
      id: '4',
      title: '기존 회의',
      date: '2025-10-18',
      startTime: '09:00',
      endTime: '10:00',
      description: '기존 팀 미팅',
      location: '회의실 B',
      category: '업무',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.put('/api/events-list', async ({ request }) => {
      const { events: eventsToUpdate } = (await request.json()) as { events: Event[] };

      eventsToUpdate.forEach((event) => {
        const index = mockEvents.findIndex((target) => target.id === event.id);
        mockEvents[index] = { ...mockEvents[index], ...event };
      });

      return HttpResponse.json(mockEvents);
    })
  );
};

export const setupMockHandlerRecurringDeletion = () => {
  const mockEvents: Event[] = [
    {
      id: '1',
      title: '삭제할 반복 이벤트',
      date: '2025-10-15',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    },
    {
      id: '2',
      title: '삭제할 반복 이벤트',
      date: '2025-10-16',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    },
    {
      id: '3',
      title: '삭제할 반복 이벤트',
      date: '2025-10-17',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    },
    {
      id: '4',
      title: '삭제할 반복 이벤트',
      date: '2025-10-18',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    },
    {
      id: '5',
      title: '삭제할 반복 이벤트',
      date: '2025-10-19',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    },
    {
      id: '6',
      title: '삭제할 반복 이벤트',
      date: '2025-10-20',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    },
    {
      id: '7',
      title: '삭제할 반복 이벤트',
      date: '2025-10-21',
      startTime: '09:00',
      endTime: '10:00',
      description: '삭제할 이벤트입니다',
      location: '어딘가',
      category: '기타',
      repeat: { type: 'daily', interval: 1 },
      notificationTime: 10,
    },
  ];

  server.use(
    http.get('/api/events', () => {
      return HttpResponse.json({ events: mockEvents });
    }),
    http.delete('api/events-list', async ({ request }) => {
      const { eventIds: eventIdsToDelete } = (await request.json()) as { eventIds: string[] };
      const deletedEvents = mockEvents.filter((event) => eventIdsToDelete.includes(event.id));

      deletedEvents.forEach((deletedEvent) => {
        const index = mockEvents.findIndex((mockEvent) => mockEvent.id === deletedEvent.id);
        mockEvents.splice(index, 1);
      });
      return new HttpResponse(null, { status: 204 });
    })
  );
};
