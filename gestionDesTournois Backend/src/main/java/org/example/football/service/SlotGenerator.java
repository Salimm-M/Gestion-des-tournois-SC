package org.example.football.service;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class SlotGenerator {
    private final int SLOT_DURATION_MINUTES=120;

    public List<LocalTime> generateSlots(LocalTime start, LocalTime end) {

        if (start == null || end == null || !start.isBefore(end)) {
            throw new IllegalArgumentException("Invalid time range");
        }

        List<LocalTime> slots = new ArrayList<>();
        LocalTime current = start;

        while (!current.plusMinutes(SLOT_DURATION_MINUTES).isAfter(end)) {

            slots.add(current);

            LocalTime next = current.plusMinutes(SLOT_DURATION_MINUTES);


            if (next.isBefore(current)) {
                break;
            }

            current = next;
        }

        return slots;
    }
}
